package com.danit.messaging.repo;

import com.danit.messaging.Entity.GroupChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupChatRepository extends JpaRepository<GroupChat, Integer> {

}
