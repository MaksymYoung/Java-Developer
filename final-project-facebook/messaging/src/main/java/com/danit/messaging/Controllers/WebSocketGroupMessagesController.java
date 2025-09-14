package com.danit.messaging.Controllers;

import com.danit.messaging.Service.GroupChatService;
import com.danit.messaging.dto.GroupMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketGroupMessagesController {

    private final GroupChatService groupChatService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/group/sendMessage")
    public void sendGroupMessage(@Payload GroupMessageDto messageDto) {
        log.info("Received message: {}", messageDto);

        groupChatService.sendGroupMessage(
                messageDto.getSenderId(),
                messageDto.getGroupId(),
                messageDto.getContent()
        );

        simpMessagingTemplate.convertAndSend("/topic/groupMessages/" + messageDto.getGroupId(), messageDto);
    }
}