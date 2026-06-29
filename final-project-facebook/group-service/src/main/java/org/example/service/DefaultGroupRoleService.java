package org.example.service;

import org.example.domain.Group;
import org.example.domain.GroupRole;
import org.example.domain.RoleType;
import org.example.repository.GroupRepository;
import org.example.repository.GroupRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DefaultGroupRoleService implements GroupRoleService{

    @Autowired
    private GroupRoleRepository groupRoleRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Override
    public List<GroupRole> getRolesByGroup(Long groupId) {
        Optional<Group> group = groupRepository.findById(groupId);
        return group.map(groupRoleRepository::findByGroup).orElse(null);
    }

    @Override
    public boolean assignRole(Long groupId, Long adminId, Long userId, RoleType roleType) {
        Optional<Group> groupOptional = groupRepository.findById(groupId);
        if (groupOptional.isPresent()) {
            Group group = groupOptional.get();

            Optional<GroupRole> adminRoleOptional = groupRoleRepository.findByGroupAndUserId(group, adminId);
            if (adminRoleOptional.isPresent() && adminRoleOptional.get().getRoleType() == RoleType.ADMIN) {
                Optional<GroupRole> userRoleOptional = groupRoleRepository.findByGroupAndUserId(group, userId);

                GroupRole userRole = userRoleOptional.orElseGet(() -> {
                    GroupRole newRole = new GroupRole();
                    newRole.setGroup(group);
                    newRole.setUserId(userId);
                    return newRole;
                });

                userRole.setRoleType(roleType);
                groupRoleRepository.save(userRole);

                // Notify user about role change (можеш використати NotificationService або схожий підхід)
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean isAdmin(Long groupId, Long userId) {
        Optional<Group> groupOptional = groupRepository.findById(groupId);
        return groupOptional.map(group -> {
            Optional<GroupRole> roleOptional = groupRoleRepository.findByGroupAndUserId(group, userId);
            return roleOptional.map(role -> role.getRoleType() == RoleType.ADMIN).orElse(false);
        }).orElse(false);
    }
}
