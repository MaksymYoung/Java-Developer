package com.danit.notifications.service;

import com.danit.notifications.entity.FeedConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.repository.FeedConsumerDataRepository;
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
public class FeedConsumerDataService {

    private final FeedConsumerDataRepository dataRepository;

    @KafkaListener(
            topics = "feed_changes",
            groupId = "consumer"
    )
    public void consume(String eventMessage) {
        try {
            log.info("Message received -> {}", eventMessage);
            FeedConsumerData feedData = new FeedConsumerData();
            feedData.setFeedEventData(eventMessage);
            dataRepository.save(feedData);
        } catch (Exception e) {
            log.error("Error consuming message from Kafka: {}", e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Page<FeedConsumerData> getAllFeedData(Pageable pageable) {
        return dataRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public FeedConsumerData getFeedDataById(Long id) {
        return dataRepository.findById(id).orElse(null);
    }

    public Page<FeedConsumerData> markAllAsRead(Pageable pageable) {
        Page<FeedConsumerData> unreadNotifications = dataRepository.getFeedConsumerDataByStatus(
                NotificationStatus.NEW, pageable);
        unreadNotifications.forEach(notification -> notification.setStatus(
                NotificationStatus.PROCESSED));
        dataRepository.saveAll(unreadNotifications);
        return unreadNotifications;
    }

    public FeedConsumerData updateNotificationStatus(Long id) {
        return dataRepository.findById(id)
                .map(data -> {
                    data.setStatus(NotificationStatus.PROCESSED);
                    return dataRepository.save(data);
                })
                .orElse(null);
    }

    public void deleteFeedDataById(Long id) {
        dataRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<FeedConsumerData> getFeedConsumerDataByStatus(
            NotificationStatus status, Pageable pageable) {
        return dataRepository.getFeedConsumerDataByStatus(status, pageable);
    }
}
