package org.example.repository;

import org.example.domain.Group;
import org.example.domain.GroupRole;
import org.example.domain.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRoleRepository extends JpaRepository<GroupRole, Long> {
    List<GroupRole> findByGroup(Group group);
    Optional<GroupRole> findByGroupAndUserId(Group group, Long userId);
    List<GroupRole> findByGroupAndRoleType(Group group, RoleType roleType);
}
