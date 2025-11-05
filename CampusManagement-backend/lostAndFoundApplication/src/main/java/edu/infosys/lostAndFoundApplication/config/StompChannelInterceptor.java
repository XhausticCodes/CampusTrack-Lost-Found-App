package edu.infosys.lostAndFoundApplication.config;

import edu.infosys.lostAndFoundApplication.chat.WebSocketSessionRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

/**
 * Intercepts STOMP messages to extract username from CONNECT frames
 * and register/unregister sessions.
 */
@Component
public class StompChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private WebSocketSessionRegistry sessionRegistry;

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
                    // Register the session
                    sessionRegistry.registerSession(username, sessionId);
                    System.out.println("STOMP CONNECT: Registered user " + username + " with session " + sessionId);
                }
            }
        } else if (accessor.getCommand() == StompCommand.DISCONNECT) {
            // Extract username from session attributes
            var sessionAttrs = accessor.getSessionAttributes();
            if (sessionAttrs != null) {
                String username = (String) sessionAttrs.get("username");
                if (username != null && !username.isEmpty()) {
                    String sessionId = accessor.getSessionId();
                    if (sessionId != null) {
                        sessionRegistry.unregisterSession(username, sessionId);
                        System.out.println("STOMP DISCONNECT: Unregistered user " + username + " with session " + sessionId);
                    }
                }
            }
        }
        
        return message;
    }
}

