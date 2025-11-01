package edu.infosys.lostAndFoundApplication.chat;

import java.util.Objects;

// Removed Lombok imports

public class ChatMessage {
    private String content;
    private String sender;
    private String recipient; // Used for private messages
    private MessageType type;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    // No-args constructor (replaces @NoArgsConstructor)
    public ChatMessage() {
    }

    // All-args constructor (replaces @AllArgsConstructor)
    public ChatMessage(String content, String sender, String recipient, MessageType type) {
        this.content = content;
        this.sender = sender;
        this.recipient = recipient;
        this.type = type;
    }

    // --- Getters and Setters (replaces @Data) ---

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    // --- toString() (replaces @Data) ---
    @Override
    public String toString() {
        return "ChatMessage{" +
                "content='" + content + '\'' +
                ", sender='" + sender + '\'' +
                ", recipient='" + recipient + '\'' +
                ", type=" + type +
                '}';
    }

    // --- equals() and hashCode() (replaces @Data) ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMessage that = (ChatMessage) o;
        return Objects.equals(content, that.content) &&
                Objects.equals(sender, that.sender) &&
                Objects.equals(recipient, that.recipient) &&
                type == that.type;
    }

    @Override
    public int hashCode() {
        return Objects.hash(content, sender, recipient, type);
    }
}