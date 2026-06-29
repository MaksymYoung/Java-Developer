package com.danit.messaging.dto.search;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PrivateMessageSearchDto {
    private Integer id;
    private String content;
    private LocalDateTime timestamp;

    public PrivateMessageSearchDto(Integer id, String content, LocalDateTime timestamp) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
    }
}
