package edu.infosys.lostAndFoundApplication.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private StompChannelInterceptor stompChannelInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The /ws endpoint is what React will connect to for the WebSocket handshake
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3939") // Allow your React app
                .addInterceptors(new WebSocketHandshakeInterceptor())
                .withSockJS(); // Use SockJS for fallback compatibility
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Register the interceptor to capture username from STOMP CONNECT frames
        registration.interceptors(stompChannelInterceptor);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /app is the prefix for messages from clients to the server (to @MessageMapping)
        registry.setApplicationDestinationPrefixes("/app");
        
        // /topic is for broadcast (one-to-many)
        // /queue is for private (one-to-one) messages
        registry.enableSimpleBroker("/topic", "/queue");

        // Configures the prefix for user-specific destinations
        registry.setUserDestinationPrefix("/user");
    }
}