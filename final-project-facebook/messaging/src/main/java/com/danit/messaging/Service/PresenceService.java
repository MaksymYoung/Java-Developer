package com.danit.messaging.Service;

import com.danit.messaging.Entity.UserStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {

    private final Map<Integer, Boolean> userStatusMap = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    public PresenceService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void setUserOnline(Integer userId) {
        userStatusMap.put(userId, true);
        // Отправляем сообщение на фронт о том, что пользователь онлайн
        messagingTemplate.convertAndSend("/topic/status", new UserStatus(userId, "online"));
    }

    public void setUserOffline(Integer userId) {
        userStatusMap.remove(userId);
        // Отправляем сообщение на фронт о том, что пользователь оффлайн
        messagingTemplate.convertAndSend("/topic/status", new UserStatus(userId, "offline"));
    }

    public boolean isUserOnline(Integer userId) {
        return userStatusMap.getOrDefault(userId, false);
    }
}