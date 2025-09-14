package com.danit.messaging.dto;

import lombok.Data;

@Data
public class GroupMessageDto {
    private Integer senderId;
    private Integer groupId;
    private String content;
}
