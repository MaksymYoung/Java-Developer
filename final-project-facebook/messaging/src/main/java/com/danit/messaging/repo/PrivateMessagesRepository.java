package com.danit.messaging.repo;

import com.danit.messaging.Entity.PrivateMessages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrivateMessagesRepository extends JpaRepository<PrivateMessages, Integer> {
    List<PrivateMessages> findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

}
