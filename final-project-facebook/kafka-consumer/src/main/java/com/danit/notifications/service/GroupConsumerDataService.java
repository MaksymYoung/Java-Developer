package com.danit.notifications.service;

import com.danit.notifications.entity.GroupConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.repository.GroupConsumerDataRepository;
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
public class GroupConsumerDataService {

    private final GroupConsumerDataRepository dataRepository;

    @KafkaListener(
            topics = "group_changes",
            groupId = "consumer"
    )
    public void consume(String eventMessage) {
        try {
            log.info("Message received -> {}", eventMessage);
            GroupConsumerData groupData = new GroupConsumerData();
            groupData.setGroupEventData(eventMessage);
            dataRepository.save(groupData);
        } catch (Exception e) {
            log.error("Error consuming message from Kafka: {}", e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public Page<GroupConsumerData> getAllGroupData(Pageable pageable) {
        return dataRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public GroupConsumerData getGroupDataById(Long id) {
        return dataRepository.findById(id).orElse(null);
    }

    public Page<GroupConsumerData> markAllAsRead(Pageable pageable) {
        Page<GroupConsumerData> unreadNotifications = dataRepository.getGroupConsumerDataByStatus(
                NotificationStatus.NEW, pageable);
        unreadNotifications.forEach(notification -> notification.setStatus(
                NotificationStatus.PROCESSED));
        dataRepository.saveAll(unreadNotifications);
        return unreadNotifications;
    }

    public GroupConsumerData updateNotificationStatus(Long id) {
        return dataRepository.findById(id)
                .map(data -> {
                    data.setStatus(NotificationStatus.PROCESSED);
                    return dataRepository.save(data);
                })
                .orElse(null);
    }

    public void deleteGroupDataById(Long id) {
        dataRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<GroupConsumerData> getGroupConsumerDataByStatus(
            NotificationStatus status, Pageable pageable) {
        return dataRepository.getGroupConsumerDataByStatus(status, pageable);
    }
}
