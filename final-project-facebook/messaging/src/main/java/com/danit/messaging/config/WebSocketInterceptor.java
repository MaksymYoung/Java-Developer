package com.danit.messaging.config;


import com.danit.messaging.Service.PresenceService;
import com.danit.messaging.security.JwtTokenProvider;
import exception.UnauthorizedException;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class WebSocketInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final PresenceService presenceService;

    public WebSocketInterceptor(JwtTokenProvider jwtTokenProvider, @Lazy PresenceService presenceService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.presenceService = presenceService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null) {
            if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
                if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                    String token = authorizationHeader.substring(7);
                    if (jwtTokenProvider.isValid(token)) {
                        Integer userId = jwtTokenProvider.getId(token);
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
                        accessor.setUser(auth);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        presenceService.setUserOnline(userId);
                    } else {
                        throw new UnauthorizedException("Invalid token");
                    }
                } else {
                    throw new UnauthorizedException("Token missing");
                }
            } else if (StompCommand.DISCONNECT.equals(accessor.getCommand()) && accessor.getUser() != null) {
                Integer userId = (Integer) ((UsernamePasswordAuthenticationToken) accessor.getUser()).getPrincipal();
                presenceService.setUserOffline(userId);
            }
        }
        return message;
    }

    @Override
    public void afterSendCompletion(Message<?> message, MessageChannel channel, boolean sent, Exception ex) {
        SecurityContextHolder.clearContext();
    }
}
