package com.danit.notifications.repository;

import com.danit.notifications.entity.CommentConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentConsumerDataRepository extends JpaRepository<CommentConsumerData, Long> {
    Page<CommentConsumerData> getCommentConsumerDataByStatus(
            NotificationStatus status, Pageable pageable);
}
