package edu.infosys.lostAndFoundApplication.chat;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.Set;
import java.util.Collections;

/**
 * Registry to track active WebSocket sessions by username.
 * This allows us to send private messages without requiring Spring Security Principal.
 */
@Component
public class WebSocketSessionRegistry {

    // Map username -> Set of session IDs (a user can have multiple sessions)
    private final ConcurrentMap<String, Set<String>> userSessions = new ConcurrentHashMap<>();

    /**
     * Register a session for a user
     */
    public void registerSession(String username, String sessionId) {
        userSessions.computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
        System.out.println("Registered session for user: " + username + ", session: " + sessionId);
    }

    /**
     * Unregister a session for a user
     */
    public void unregisterSession(String username, String sessionId) {
        Set<String> sessions = userSessions.get(username);
        if (sessions != null) {
            sessions.remove(sessionId);
            if (sessions.isEmpty()) {
                userSessions.remove(username);
            }
            System.out.println("Unregistered session for user: " + username + ", session: " + sessionId);
        }
    }

    /**
     * Get all session IDs for a user
     */
    public Set<String> getSessions(String username) {
        return userSessions.getOrDefault(username, Collections.emptySet());
    }

    /**
     * Check if a user is online
     */
    public boolean isUserOnline(String username) {
        Set<String> sessions = userSessions.get(username);
        return sessions != null && !sessions.isEmpty();
    }

    /**
     * Get all online users
     */
    public Set<String> getOnlineUsers() {
        return userSessions.keySet();
    }

    /**
     * Remove all sessions for a user (useful for logout)
     */
    public void removeUser(String username) {
        userSessions.remove(username);
        System.out.println("Removed all sessions for user: " + username);
    }
}

