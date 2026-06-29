package com.danit.notifications.repository;

import com.danit.notifications.entity.FriendConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendConsumerDataRepository extends JpaRepository<FriendConsumerData, Long> {
    Page<FriendConsumerData> getFriendConsumerDataByStatus(
            NotificationStatus status, Pageable pageable);
}