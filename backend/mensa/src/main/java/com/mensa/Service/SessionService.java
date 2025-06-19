package com.mensa.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    
    private final Map<String, String> sessionStore = new ConcurrentHashMap<>();

    public void saveSession(String sessionId, String username) {
        sessionStore.put(sessionId, username);
    }

    public String getUsernameFromSession(String sessionId) {
        return sessionStore.get(sessionId);
    }

    public Cookie createSession(String username) {
        String sessionId = UUID.randomUUID().toString();
        saveSession(sessionId, username);
        Cookie cookie = new Cookie("SESSIONID", sessionId);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60);
        return cookie;
    }
}
