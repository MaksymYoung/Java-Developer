package com.danit.messaging.repo;

import com.danit.messaging.Entity.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage, Integer> {
    List<GroupMessage> findByGroupId(Integer groupId);
}
