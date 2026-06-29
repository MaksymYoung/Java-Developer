package com.danit.messaging.dto.search;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GroupChatSearchDto {
    private Integer id;
    private String name;
    private String lastMessage;
    private LocalDateTime timestamp;

    public GroupChatSearchDto(Integer id, String name, String lastMessage, LocalDateTime timestamp) {
        this.id = id;
        this.name = name;
        this.lastMessage = lastMessage;
        this.timestamp = timestamp;
    }
}
