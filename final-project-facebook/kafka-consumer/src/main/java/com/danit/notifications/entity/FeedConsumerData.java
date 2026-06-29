package com.danit.notifications.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

import static jakarta.persistence.TemporalType.TIMESTAMP;

@Entity
@Table(name = "feed_changes")
@Getter
@Setter
public class FeedConsumerData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @Column(name = "feed_event_data", nullable = false)
    private String feedEventData;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private NotificationStatus status = NotificationStatus.NEW;

    @CreatedDate
    @Temporal(TIMESTAMP)
    @Column(name = "creation_date")
    protected LocalDateTime creationDate = LocalDateTime.now();

    @LastModifiedDate
    @Temporal(TIMESTAMP)
    @Column(name = "last_modified_date")
    protected LocalDateTime lastModifiedDate = LocalDateTime.now();
}
