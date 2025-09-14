package com.danit.notifications.service;

import com.danit.notifications.entity.FriendConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.repository.FriendConsumerDataRepository;
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
public class FriendConsumerDataService {

    private final FriendConsumerDataRepository dataRepository;

    @KafkaListener(
            topics = "friend_changes",
            groupId = "consumer"
    )
    public void consume(String eventMessage) {
        try {
            log.info("Message received -> {}", eventMessage);
            FriendConsumerData friendData = new FriendConsumerData();
            friendData.setFriendEventData(eventMessage);
            dataRepository.save(friendData);
        } catch (Exception e) {
            log.error("Error consuming message from Kafka: {}", e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Page<FriendConsumerData> getAllFriendData(Pageable pageable) {
        return dataRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public FriendConsumerData getFriendDataById(Long id) {
        return dataRepository.findById(id).orElse(null);
    }

    public Page<FriendConsumerData> markAllAsRead(Pageable pageable) {
        Page<FriendConsumerData> unreadNotifications = dataRepository.getFriendConsumerDataByStatus(
                NotificationStatus.NEW, pageable);
        unreadNotifications.forEach(notification -> notification.setStatus(
                NotificationStatus.PROCESSED));
        dataRepository.saveAll(unreadNotifications);
        return unreadNotifications;
    }

    public FriendConsumerData updateNotificationStatus(Long id) {
        return dataRepository.findById(id)
                .map(data -> {
                    data.setStatus(NotificationStatus.PROCESSED);
                    return dataRepository.save(data);
                })
                .orElse(null);
    }

    public void deleteFriendDataById(Long id) {
        dataRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<FriendConsumerData> getFriendConsumerDataByStatus(
            NotificationStatus status, Pageable pageable) {
        return dataRepository.getFriendConsumerDataByStatus(status, pageable);
    }
}
