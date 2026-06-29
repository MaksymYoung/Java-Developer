package com.danit.messaging.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "group_message")
public class GroupMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer senderId;  // senderId вместо объекта User

    @Column(nullable = false)
    private Integer groupId;   // groupId вместо объекта GroupChat

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
