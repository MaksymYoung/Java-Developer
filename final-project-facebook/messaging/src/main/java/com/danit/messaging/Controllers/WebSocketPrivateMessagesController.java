package com.danit.messaging.Controllers;

import com.danit.messaging.Service.PrivateMessagesService;
import com.danit.messaging.dto.PrivateMessagesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor

public class WebSocketPrivateMessagesController {

    private final PrivateMessagesService privateMessagesService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/private/sendMessage")
    public void sendMessage(@Payload PrivateMessagesDto messageDto) {

        privateMessagesService.sendMessage(
                messageDto.getSenderId(),
                messageDto.getReceiverId(),
                messageDto.getContent()
        );

        simpMessagingTemplate.convertAndSend("/user/private/" + messageDto.getReceiverId(), messageDto);
    }
}
