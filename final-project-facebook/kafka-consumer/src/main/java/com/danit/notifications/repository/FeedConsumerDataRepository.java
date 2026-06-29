package com.danit.notifications.repository;

import com.danit.notifications.entity.FeedConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedConsumerDataRepository extends JpaRepository<FeedConsumerData, Long> {
    Page<FeedConsumerData> getFeedConsumerDataByStatus(
            NotificationStatus status, Pageable pageable);
}
