package org.example.service;

import org.example.domain.Group;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface GroupService {
    List<Group> getAllGroups();

    Page<Group> getAllPageable(int pageNumber, int size);

    Page<Group> getAllGroupsWhereUserIsOwnerPageable(Long ownerId, int pageNumber, int size);

    Page<Group> getGroupsByMemberIdPageable(Long userId, int pageNumber, int size);

    Optional<Group> getGroupById(Long id);

    Group createGroup(Group group);

    Group updateGroup(Long id, Group groupDetails);

    void deleteGroup(Long id);
    boolean leaveGroup(Long groupId, Long userId);
    void uploadImage(Long id, MultipartFile file);
}
