package edu.infosys.lostAndFoundApplication.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The /ws endpoint is what React will connect to for the WebSocket handshake
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3939") // Allow your React app
                .withSockJS(); // Use SockJS for fallback compatibility
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /app is the prefix for messages from clients to the server (to @MessageMapping)
        registry.setApplicationDestinationPrefixes("/app");
        
        // /topic is for broadcast (one-to-many)
        // /user is for private (one-to-one) messages
        registry.enableSimpleBroker("/topic", "/user");

        // Configures the prefix for user-specific destinations
        registry.setUserDestinationPrefix("/user");
    }
}