package org.example.repository;

import org.example.domain.Group;
import org.example.domain.JoinRequest;
import org.example.domain.JoinRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    List<JoinRequest> findByGroupAndStatus(Group group, JoinRequestStatus status);

    @Transactional
    void deleteByGroupId(Long groupId);
    @Transactional
    boolean existsByGroupAndUserIdAndStatus(Group group, Long userId, JoinRequestStatus status);

    List<JoinRequest> findByUserIdAndStatus(Long userId, JoinRequestStatus status);
}
