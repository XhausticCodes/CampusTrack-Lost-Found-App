package edu.infosys.lostAndFoundApplication.config;

import edu.infosys.lostAndFoundApplication.chat.ChatMessage;
import edu.infosys.lostAndFoundApplication.chat.WebSocketSessionRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Intercepts STOMP messages to extract username from CONNECT frames
 * and register/unregister sessions. Also broadcasts JOIN/LEAVE messages.
 */
@Component
public class StompChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private WebSocketSessionRegistry sessionRegistry;

    @Autowired
    @Lazy
    private SimpMessageSendingOperations messagingTemplate;

    // Track users who have newly connected but haven't subscribed yet
    private final Set<String> pendingJoinUsers = ConcurrentHashMap.newKeySet();
    // Track users who have already sent their JOIN message to prevent duplicates
    private final Set<String> usersWhoSentJoin = ConcurrentHashMap.newKeySet();

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor == null) {
            return message;
        }
        
        if (accessor.getCommand() == StompCommand.CONNECT) {
            // Extract username from STOMP CONNECT headers
            String username = accessor.getFirstNativeHeader("username");
            
            // If not in headers, try to get from session attributes (set during handshake)
            if (username == null || username.isEmpty()) {
                var sessionAttrs = accessor.getSessionAttributes();
                if (sessionAttrs != null) {
                    Object sessionUsername = sessionAttrs.get("username");
                    if (sessionUsername != null) {
                        username = sessionUsername.toString();
                    }
                }
            }
            
            if (username != null && !username.isEmpty()) {
                String sessionId = accessor.getSessionId();
                if (sessionId != null) {
                    // Store username in session attributes for later use
                    var sessionAttrs = accessor.getSessionAttributes();
                    if (sessionAttrs != null) {
                        sessionAttrs.put("username", username);
                    }
                    
                    // Check if this is the user's first session (before registration)
                    int sessionCountBefore = sessionRegistry.getSessions(username).size();
                    
                    // Register the session
                    sessionRegistry.registerSession(username, sessionId);
                    System.out.println("STOMP CONNECT: Registered user " + username + " with session " + sessionId);
                    
                    // If this was the first session, mark user as pending join
                    // We'll send the JOIN message when they subscribe to /topic/global
                    if (sessionCountBefore == 0) {
                        pendingJoinUsers.add(username);
                    }
                }
            }
        } else if (accessor.getCommand() == StompCommand.SUBSCRIBE) {
            // When user subscribes to /topic/global, send their JOIN message if they're pending
            // We'll handle this in postSend to ensure subscription is complete
        } else if (accessor.getCommand() == StompCommand.DISCONNECT) {
            // Extract username from session attributes
            var sessionAttrs = accessor.getSessionAttributes();
            if (sessionAttrs != null) {
                String username = (String) sessionAttrs.get("username");
                if (username != null && !username.isEmpty()) {
                    String sessionId = accessor.getSessionId();
                    if (sessionId != null) {
                        // Check if this is the user's last session (before unregistration)
                        int sessionCountBefore = sessionRegistry.getSessions(username).size();
                        
                        // Unregister the session
                        sessionRegistry.unregisterSession(username, sessionId);
                        System.out.println("STOMP DISCONNECT: Unregistered user " + username + " with session " + sessionId);
                        
                        // Remove from pending join users if they never subscribed
                        pendingJoinUsers.remove(username);
                        
                        // If this was the last session, broadcast LEAVE message and remove from sent join tracking
                        if (sessionCountBefore == 1) {
                            // Remove from usersWhoSentJoin so they can send JOIN again if they reconnect
                            usersWhoSentJoin.remove(username);
                            
                            int onlineUserCount = sessionRegistry.getOnlineUsers().size();
                            ChatMessage leaveMessage = new ChatMessage();
                            leaveMessage.setType(ChatMessage.MessageType.LEAVE);
                            leaveMessage.setSender(username);
                            leaveMessage.setContent(username + " left the chat. Online users: " + onlineUserCount);
                            
                            // Send LEAVE message to global topic
                            messagingTemplate.convertAndSend("/topic/global", leaveMessage);
                            System.out.println("User " + username + " left. Remaining online users: " + onlineUserCount);
                        }
                    }
                }
            }
        }
        
        return message;
    }

    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor == null) {
            return;
        }
        
        if (accessor.getCommand() == StompCommand.SUBSCRIBE) {
            // When user subscribes to /topic/global, send their JOIN message if they're pending
            // postSend ensures subscription is fully processed
            var sessionAttrs = accessor.getSessionAttributes();
            if (sessionAttrs != null) {
                String username = (String) sessionAttrs.get("username");
                String destination = accessor.getDestination();
                
                if (username != null && !username.isEmpty() && 
                    destination != null && destination.equals("/topic/global")) {
                    
                    // Check if this user is pending join and hasn't already sent JOIN message
                    boolean isNewUser = pendingJoinUsers.remove(username);
                    boolean alreadySentJoin = usersWhoSentJoin.contains(username);
                    
                    // Only send JOIN message if user is new and hasn't already sent it
                    if (isNewUser && !alreadySentJoin) {
                        int onlineUserCount = sessionRegistry.getOnlineUsers().size();
                        
                        // Mark that this user has sent their JOIN message
                        usersWhoSentJoin.add(username);
                        
                        // New user joining - send JOIN message
                        ChatMessage joinMessage = new ChatMessage();
                        joinMessage.setType(ChatMessage.MessageType.JOIN);
                        joinMessage.setSender(username);
                        joinMessage.setContent(username + " joined the chat. Online users: " + onlineUserCount);
                        
                        // Send JOIN message to global topic
                        messagingTemplate.convertAndSend("/topic/global", joinMessage);
                        System.out.println("User " + username + " subscribed to global chat. Total online users: " + onlineUserCount);
                        
                        // Also send a separate count message to ensure the user sees the count
                        // This is a safety measure in case they miss their own JOIN message
                        ChatMessage countMessage = new ChatMessage();
                        countMessage.setType(ChatMessage.MessageType.JOIN); // Use JOIN type so frontend processes it
                        countMessage.setSender("System");
                        countMessage.setContent("Online users: " + onlineUserCount);
                        
                        // Send count update to global topic
                        messagingTemplate.convertAndSend("/topic/global", countMessage);
                        System.out.println("Sent user count update for new user: " + onlineUserCount + " users online");
                    }
                    // If user already sent JOIN or is resubscribing, don't send duplicate messages
                }
            }
        }
    }
}