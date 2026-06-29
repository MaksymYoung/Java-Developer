package org.example.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.example.domain.*;
import org.example.repository.GroupRepository;
import org.example.repository.JoinRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DefaultGroupService implements GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private JoinRequestRepository joinRequestRepository;

    @Autowired
    private ImageServiceImpl imageService;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    @Override
    public Page<Group> getAllPageable(int pageNumber, int size) {
//        Sort sort = Sort.by(new Sort.Order(Sort.Direction.ASC, "name"));
        Pageable pageable = PageRequest.of(pageNumber, size);
        Page<Group> groupPage = groupRepository.findAll(pageable);
        return groupPage;
    }

    @Override
    public Page<Group> getAllGroupsWhereUserIsOwnerPageable(Long ownerId, int pageNumber, int size) {
        Pageable pageable = PageRequest.of(pageNumber, size);
        return groupRepository.findByOwnerId(ownerId, pageable);
    }

    @Override
    public Page<Group> getGroupsByMemberIdPageable(Long userId, int pageNumber, int size) {
        Pageable pageable = PageRequest.of(pageNumber, size);
        return groupRepository.findByMemberId(userId, pageable);
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public Group updateGroup(Long id, Group groupDetails) {
        Optional<Group> optionalGroup = groupRepository.findById(id);
        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            group.setName(groupDetails.getName());
            group.setDescription(groupDetails.getDescription());
            group.setCoverImageUrl(groupDetails.getCoverImageUrl());
            group.setGroupType(groupDetails.getGroupType());
            return groupRepository.save(group);
        }
        return null;
    }

    public List<Group> findByNameContaining(String name) {
        return groupRepository.findByNameContainingIgnoreCase(name);
    }

    public boolean joinGroup(Long groupId, Long userId) {
        Optional<Group> optionalGroup = groupRepository.findById(groupId);
        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            boolean pendingRequestExists = joinRequestRepository.existsByGroupAndUserIdAndStatus(group, userId, JoinRequestStatus.PENDING);
            if (pendingRequestExists) {
                return false;
            }
            if (group.getGroupType() == GroupType.OPEN) {
                group.getMembers().add(userId);
                groupRepository.save(group);
                return true;
            } else {
                JoinRequest joinRequest = new JoinRequest();
                joinRequest.setGroup(group);
                joinRequest.setUserId(userId);
                joinRequest.setStatus(JoinRequestStatus.PENDING);
                joinRequestRepository.save(joinRequest);
                return false;
            }
        }
        return false;
    }

    public void deleteGroup(Long groupId) {
        joinRequestRepository.deleteByGroupId(groupId);
        groupRepository.deleteById(groupId);
    }

    public List<JoinRequest> getPendingJoinRequests(Long groupId) {
        Optional<Group> optionalGroup = groupRepository.findById(groupId);
        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            return joinRequestRepository.findByGroupAndStatus(group, JoinRequestStatus.PENDING);
        }
        return Collections.emptyList();
    }

    public List<JoinRequest> findPendingJoinRequestsFromCurrentUser(Long userId) {
        return joinRequestRepository.findByUserIdAndStatus(userId, JoinRequestStatus.PENDING);
    }

    public boolean isOwner(Long groupId, Long userId) {
        Optional<Group> optionalGroup = groupRepository.findById(groupId);
        return optionalGroup.map(group -> group.getOwnerId().equals(userId)).orElse(false);
    }

    public boolean approveJoinRequest(Long requestId, Long userId) {
        Optional<JoinRequest> optionalRequest = joinRequestRepository.findById(requestId);
        if (optionalRequest.isPresent()) {
            JoinRequest joinRequest = optionalRequest.get();
            Group group = joinRequest.getGroup();

            if (!isOwner(group.getId(), userId)) {
                return false;
            }

            joinRequest.setStatus(JoinRequestStatus.APPROVED);
            joinRequestRepository.save(joinRequest);

            group.getMembers().add(joinRequest.getUserId());
            groupRepository.save(group);

            return true;
        }
        return false;
    }

    public boolean rejectJoinRequest(Long requestId, Long userId) {
        Optional<JoinRequest> optionalRequest = joinRequestRepository.findById(requestId);
        if (optionalRequest.isPresent()) {
            JoinRequest joinRequest = optionalRequest.get();
            Group group = joinRequest.getGroup();

            if (!isOwner(group.getId(), userId)) {
                return false;
            }

            joinRequest.setStatus(JoinRequestStatus.REJECTED);
            joinRequestRepository.save(joinRequest);
            return true;
        }
        return false;
    }

    @Override
    public boolean leaveGroup(Long groupId, Long userId) {
        Optional<Group> optionalGroup = groupRepository.findById(groupId);
        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            if (group.getMembers().contains(userId)) {
                group.getMembers().remove(userId);
                groupRepository.save(group);

                // Remove pending join requests for this user in the group
                List<JoinRequest> joinRequests = joinRequestRepository.findByGroupAndStatus(group, JoinRequestStatus.PENDING);
                joinRequests.stream()
                        .filter(joinRequest -> joinRequest.getUserId().equals(userId))
                        .forEach(joinRequestRepository::delete);

                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional
    public void uploadImage(final Long id, final MultipartFile file) {

//        GroupImage groupImage = new GroupImage();
//        groupImage.setFile(file);
//
//        String fileName = imageService.upload(groupImage);
//        groupRepository.addImage(id, "/groups/" + fileName);
        Optional<Group> optionalGroup = groupRepository.findById(id);

        if (optionalGroup.isPresent()) {
            Group group = optionalGroup.get();
            GroupImage groupImage = new GroupImage();
            groupImage.setFile(file);
            String imageUrl = imageService.upload(groupImage);

            group.setCoverImageUrl(imageUrl);
            groupRepository.save(group);
        } else {
            throw new IllegalArgumentException("Group not found with ID: " + id);
        }

    }

}