package com.danit.notifications.service;

import com.danit.notifications.entity.LikeConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.repository.LikeConsumerDataRepository;
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
public class LikeConsumerDataService {

    private final LikeConsumerDataRepository dataRepository;

    @KafkaListener(
            topics = "like_changes",
            groupId = "consumer"
    )
    public void consume(String eventMessage) {
        try {
            log.info("Message received -> {}", eventMessage);
            LikeConsumerData likeData = new LikeConsumerData();
            likeData.setLikeEventData(eventMessage);
            dataRepository.save(likeData);
        } catch (Exception e) {
            log.error("Error consuming message from Kafka: {}", e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Page<LikeConsumerData> getAllLikeData(Pageable pageable) {
        return dataRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public LikeConsumerData getLikeDataById(Long id) {
        return dataRepository.findById(id).orElse(null);
    }

    public Page<LikeConsumerData> markAllAsRead(Pageable pageable) {
        Page<LikeConsumerData> unreadNotifications = dataRepository.getLikeConsumerDataByStatus(
                NotificationStatus.NEW, pageable);
        unreadNotifications.forEach(notification -> notification.setStatus(
                NotificationStatus.PROCESSED));
        dataRepository.saveAll(unreadNotifications);
        return unreadNotifications;
    }

    public LikeConsumerData updateNotificationStatus(Long id) {
        return dataRepository.findById(id)
                .map(data -> {
                    data.setStatus(NotificationStatus.PROCESSED);
                    return dataRepository.save(data);
                })
                .orElse(null);
    }

    public void deleteLikeDataById(Long id) {
        dataRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<LikeConsumerData> getLikeConsumerDataByStatus(
            NotificationStatus status, Pageable pageable) {
        return dataRepository.getLikeConsumerDataByStatus(status, pageable);
    }
}
