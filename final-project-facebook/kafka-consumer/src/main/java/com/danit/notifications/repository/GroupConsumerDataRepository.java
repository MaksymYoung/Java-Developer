package com.danit.notifications.repository;

import com.danit.notifications.entity.GroupConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupConsumerDataRepository extends JpaRepository<GroupConsumerData, Long> {
    Page<GroupConsumerData> getGroupConsumerDataByStatus(
            NotificationStatus status, Pageable pageable);
}
