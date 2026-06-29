package com.danit.messaging.dto;

import lombok.Data;

@Data
public class PrivateMessagesDto {
    private Integer senderId;
    private Integer receiverId;
    private String content;
}
