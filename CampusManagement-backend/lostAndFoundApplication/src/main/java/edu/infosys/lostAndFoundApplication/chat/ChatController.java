package edu.infosys.lostAndFoundApplication.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    private WebSocketSessionRegistry sessionRegistry;

    /**
     * Handles global (broadcast) messages.
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/global")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        // We are trusting the sender from the client payload.
        if (chatMessage.getSender() == null || chatMessage.getSender().isEmpty()) {
            chatMessage.setSender("Anonymous");
        }
        chatMessage.setType(ChatMessage.MessageType.CHAT);
        return chatMessage;
    }

    /**
     * Handles private (point-to-point) messages.
     * Uses topic-based routing: sends to /topic/private.{recipient} and /topic/private.{sender}
     */
    @MessageMapping("/chat.sendPrivateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        // Validate sender and recipient
        if (chatMessage.getSender() == null || chatMessage.getSender().isEmpty()) {
            if (chatMessage.getRecipient() == null || chatMessage.getRecipient().isEmpty()) {
                System.out.println("Cannot send private message: missing sender and recipient");
                return;
            }
            chatMessage.setSender("Anonymous");
        }

        if (chatMessage.getRecipient() == null || chatMessage.getRecipient().isEmpty()) {
            System.out.println("Cannot send private message: missing recipient");
            return;
        }

        chatMessage.setType(ChatMessage.MessageType.CHAT);
        
        // Check if recipient is online
        if (!sessionRegistry.isUserOnline(chatMessage.getRecipient())) {
            System.out.println("User " + chatMessage.getRecipient() + " is not online. Message not delivered.");
            // Still send to sender so they see their message
        }
        
        // Send to recipient's private topic
        String recipientTopic = "/topic/private." + chatMessage.getRecipient();
        messagingTemplate.convertAndSend(recipientTopic, chatMessage);
        
        // Send to sender's private topic so they see their sent message
        String senderTopic = "/topic/private." + chatMessage.getSender();
        messagingTemplate.convertAndSend(senderTopic, chatMessage);
        
        System.out.println("Private message sent from " + chatMessage.getSender() + 
                          " to " + chatMessage.getRecipient());
    }
}