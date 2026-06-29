package com.danit.notifications.repository;

import com.danit.notifications.entity.LikeConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeConsumerDataRepository extends JpaRepository<LikeConsumerData, Long> {
    Page<LikeConsumerData> getLikeConsumerDataByStatus(
            NotificationStatus status, Pageable pageable);
}

