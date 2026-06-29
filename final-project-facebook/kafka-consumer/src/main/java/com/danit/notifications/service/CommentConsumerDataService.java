package com.danit.notifications.service;

import com.danit.notifications.entity.CommentConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.repository.CommentConsumerDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CommentConsumerDataService {

    private final CommentConsumerDataRepository dataRepository;

    @KafkaListener(
            topics = "comment_changes",
            groupId = "consumer"
    )
    public void consume(String eventMessage) {
        try {
            log.info("Message received -> {}", eventMessage);
            CommentConsumerData commentData = new CommentConsumerData();
            commentData.setCommentEventData(eventMessage);
            dataRepository.save(commentData);
        } catch (Exception e) {
            log.error("Error consuming message from Kafka: {}", e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Page<CommentConsumerData> getAllCommentData(Pageable pageable) {
        return dataRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public CommentConsumerData getCommentDataById(Long id) {
        return dataRepository.findById(id).orElse(null);
    }

    public Page<CommentConsumerData> markAllAsRead(Pageable pageable) {
        Page<CommentConsumerData> unreadNotifications = dataRepository.getCommentConsumerDataByStatus(
                NotificationStatus.NEW, pageable);
        unreadNotifications.forEach(notification -> notification.setStatus(
                NotificationStatus.PROCESSED));
        dataRepository.saveAll(unreadNotifications);
        return unreadNotifications;
    }

    public CommentConsumerData updateNotificationStatus(Long id) {
        return dataRepository.findById(id)
                .map(data -> {
                    data.setStatus(NotificationStatus.PROCESSED);
                    return dataRepository.save(data);
                })
                .orElse(null);
    }

    public void deleteCommentDataById(Long id) {
        dataRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<CommentConsumerData> getCommentConsumerDataByStatus(
            NotificationStatus status, Pageable pageable) {
        return dataRepository.getCommentConsumerDataByStatus(status, pageable);
    }
}
