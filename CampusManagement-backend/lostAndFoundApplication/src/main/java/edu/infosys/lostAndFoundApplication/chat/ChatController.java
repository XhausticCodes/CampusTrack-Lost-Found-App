package edu.infosys.lostAndFoundApplication.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

// import java.security.Principal; // No longer needed

@Controller
public class ChatController {

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    /**
     * Handles global (broadcast) messages.
     * We now trust the sender from the payload because the WebSocket
     * Principal is null due to cross-origin session issues.
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
     * We also trust the sender from the payload here.
     */
    @MessageMapping("/chat.sendPrivateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        // We are trusting the sender from the client payload.
        if (chatMessage.getSender() == null || chatMessage.getSender().isEmpty()) {
            // Don't send a message that has no sender or recipient
            if (chatMessage.getRecipient() == null || chatMessage.getRecipient().isEmpty()) {
                return;
            }
            chatMessage.setSender("Anonymous");
        }

        chatMessage.setType(ChatMessage.MessageType.CHAT);
        
        messagingTemplate.convertAndSendToUser(
            chatMessage.getRecipient(), 
            "/queue/private", 
            chatMessage
        );
    }
}