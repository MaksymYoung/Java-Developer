package org.example.service;

import org.example.domain.GroupRole;
import org.example.domain.RoleType;

import java.util.List;

public interface GroupRoleService {
    List<GroupRole> getRolesByGroup(Long groupId);
    boolean assignRole(Long groupId, Long adminId, Long userId, RoleType roleType);
    boolean isAdmin(Long groupId, Long userId);
}
