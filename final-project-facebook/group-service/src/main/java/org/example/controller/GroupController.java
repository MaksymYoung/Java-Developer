package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import org.example.domain.Group;
import org.example.domain.JoinRequest;
import org.example.domain.dto.GroupRequestDto;
import org.example.domain.dto.GroupResponseDto;
import org.example.service.DefaultGroupService;
import org.example.service.mappers.GroupRequestDtoMapper;
import org.example.service.mappers.GroupResponseDtoMapper;
import org.example.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
//import org.springframework.kafka.core.KafkaTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private DefaultGroupService groupService;

    @Autowired
    private GroupRequestDtoMapper groupRequestDtoMapper;

    @Autowired
    private GroupResponseDtoMapper groupResponseDtoMapper;

    @Autowired
    private JwtUtils jwtUtils;

//    @Autowired
//    private KafkaTemplate<String, String> kafkaTemplate;

//    @Value("${spring.kafka.topics.group_changes}")
//    private String topicName;

    private Long getAuthenticatedUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtils.getUserIdFromToken(token);
    }

//    @GetMapping
//    public List<GroupResponseDto> getAllGroups() {
//        return groupService.getAllGroups().stream()
//                .map(groupResponseDtoMapper::convertToDto)
//                .collect(Collectors.toList());
//    }

    @Operation(summary = "Get all groups pageable", description = "Get all groups pageable")
    @GetMapping
    public ResponseEntity<?> getAllGroupsPageable(@RequestParam(defaultValue = "0") int pageNumber,
                                                  @RequestParam(defaultValue = "10") @Max(20) int size) {

        try {
            Page<Group> groupsPage = groupService.getAllPageable(pageNumber, size);
            List<Group> groupsList = groupsPage.toList();
            Long totalGroupsAmount = groupsPage.getTotalElements();

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("groups", groupsList);
            responseData.put("totalAmount", totalGroupsAmount);

            return ResponseEntity.ok().body(Map.of("status", "success", "data", responseData));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("status", "error", "message", "Invalid input data"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while fetching groups"));
        }
    }

    @Operation(summary = "Get all groups where user is owner pageable")
    @GetMapping("/owned")
    public ResponseEntity<?> getGroupsByOwnerIdPageable(HttpServletRequest request,
                                                        @RequestParam(defaultValue = "0") int pageNumber,
                                                        @RequestParam(defaultValue = "10") @Max(20) int size) {
        try {
            Long ownerId = getAuthenticatedUserId(request);
            Page<Group> groupPage = groupService.getAllGroupsWhereUserIsOwnerPageable(ownerId, pageNumber, size);
            List<GroupResponseDto> groupResponseDtos = groupPage.getContent().stream()
                    .map(groupResponseDtoMapper::convertToDto)
                    .collect(Collectors.toList());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("groups", groupResponseDtos);
            responseData.put("totalAmount", groupPage.getTotalElements());

            return ResponseEntity.ok().body(Map.of("status", "success", "data", responseData));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while fetching groups"));
        }
    }

    @Operation(summary = "Get all groups where user is member pageable")
    @GetMapping("/member")
    public ResponseEntity<?> getGroupsByMemberIdPageable(HttpServletRequest request,
                                                         @RequestParam(defaultValue = "0") int pageNumber,
                                                         @RequestParam(defaultValue = "10") @Max(20) int size) {
        try {
            Long userId = getAuthenticatedUserId(request);
            Page<Group> groupPage = groupService.getGroupsByMemberIdPageable(userId, pageNumber, size);
            List<GroupResponseDto> groupResponseDtos = groupPage.getContent().stream()
                    .map(groupResponseDtoMapper::convertToDto)
                    .collect(Collectors.toList());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("groups", groupResponseDtos);
            responseData.put("totalAmount", groupPage.getTotalElements());

            return ResponseEntity.ok().body(Map.of("status", "success", "data", responseData));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while fetching groups"));
        }
    }

    @Operation(summary = "Get group by ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupById(@PathVariable Long id) {
        try {
            return groupService.getGroupById(id)
                    .map(group -> ResponseEntity.ok(Map.of("status", "success", "data", groupResponseDtoMapper.convertToDto(group))))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("status", "error", "message", "Group not found")));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while fetching the group"));
        }
    }

    @Operation(summary = "Search group by name")
    @GetMapping("/search")
    public ResponseEntity<?> getGroupByName(@RequestParam String name) {
        try {
            List<Group> groups = groupService.findByNameContaining(name);
            if (groups.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", "No groups found with the specified name"));
            }

            List<GroupResponseDto> groupResponseDtos = groups.stream()
                    .map(groupResponseDtoMapper::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of("status", "success", "data", groupResponseDtos));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while searching for groups"));
        }
    }


    @Operation(summary = "Create a new group")
    @PostMapping
    public ResponseEntity<?> createGroup(HttpServletRequest request, @Valid @RequestBody GroupRequestDto groupRequestDto) {

        try {
            Long ownerId = getAuthenticatedUserId(request);
            Group group = groupRequestDtoMapper.convertToEntity(groupRequestDto);
            group.setOwnerId(ownerId); // set ownerId from authenticated user
            group.setMembers(Set.of(ownerId));
            group.setCoverImageUrl("");
            Group createdGroup = groupService.createGroup(group);
//            kafkaTemplate.send(topicName, String.format(
//                    "User %d created a new group %d: %s",
//                    ownerId, group.getId(),
//                    group.getDescription()));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("status", "success", "data", groupResponseDtoMapper.convertToDto(createdGroup)));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while creating the group"));
        }
    }

    @Operation(summary = "Update group by ID")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(HttpServletRequest request, @PathVariable Long id, @Valid @RequestBody GroupRequestDto groupRequestDto) {
        try {
            Long userId = getAuthenticatedUserId(request);
            Group groupDetails = groupRequestDtoMapper.convertToEntity(groupRequestDto);
            if (!groupService.isOwner(id, userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "You are not owner of this group"));
            }
            Group updatedGroup = groupService.updateGroup(id, groupDetails);
            if (updatedGroup != null) {
//                kafkaTemplate.send(topicName, String.format(
//                        "User %d updated the group %d: %s",
//                        userId, groupDetails.getId(),
//                        groupDetails.getDescription()));
                return ResponseEntity.ok(Map.of("status", "success", "data", groupResponseDtoMapper.convertToDto(updatedGroup)));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", "Group not found"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while updating the group" + ex));
        }
    }

    @Operation(summary = "Delete group by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(HttpServletRequest request, @PathVariable Long id) {
        try {
            Long userId = getAuthenticatedUserId(request);
            if (!groupService.isOwner(id, userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "You are not owner of this group"));
            }
            groupService.deleteGroup(id);
//            kafkaTemplate.send(topicName, String.format(
//                    "User %d deleted the group %d", userId, id));
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(Map.of("status", "success", "message", "Group deleted successfully"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while deleting the group"));
        }
    }

    @Operation(summary = "Join group by group ID and user ID")
    @PostMapping("/{groupId}/join")
    public ResponseEntity<?> joinGroup(HttpServletRequest request, @PathVariable Long groupId) {

        try {
            Long userId = getAuthenticatedUserId(request);
            Group group = groupService.getGroupById(groupId).orElse(new Group());
            if (group.getId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "success", "message", "Group doesn't found"));
            }
            if (userId.equals(group.getOwnerId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("status", "success", "message", "You are owner of this group"));
            }

            boolean joined = groupService.joinGroup(groupId, userId);
            if (joined) {
//                kafkaTemplate.send(topicName, String.format(
//                        "User %d joined the group %d: %s",
//                        userId, group.getId(),
//                        group.getDescription()));
                return ResponseEntity.ok().body(Map.of("status", "success", "message", "User joined the group"));
            } else {
                return ResponseEntity.status(HttpStatus.ACCEPTED)
                        .body(Map.of("status", "pending", "message", "Join request sent, waiting for approval"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while joining the group"));
        }
    }


    @Operation(summary = "Get pending join requests for a group by group ID")
    @GetMapping("/{groupId}/join-requests")
    public ResponseEntity<?> getPendingJoinRequests(HttpServletRequest request, @PathVariable Long groupId) {
         try {
            Long userId = getAuthenticatedUserId(request);
            if (!groupService.isOwner(groupId, userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "You are not owner of this group"));
            }
            List<JoinRequest> joinRequests = groupService.getPendingJoinRequests(groupId);
            return ResponseEntity.ok().body(Map.of("status", "success", "data", joinRequests));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while fetching join requests"));
        }
    }

    @Operation(summary = "Get pending join requests sent by current user")
    @GetMapping("/pending")
    public List<JoinRequest> getPendingJoinRequests(HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        return groupService.findPendingJoinRequestsFromCurrentUser(userId);
    }

    @Operation(summary = "Approve join request by request ID")
    @PostMapping("/join-requests/{requestId}/approve")
    public ResponseEntity<?> approveJoinRequest(HttpServletRequest request, @PathVariable Long requestId) {
        try {
            Long userId = getAuthenticatedUserId(request);
            boolean approved = groupService.approveJoinRequest(requestId, userId);
            if (approved) {
//                kafkaTemplate.send(topicName, String.format(
//                        "User %d approved the join request %d",
//                        userId, requestId));
                return ResponseEntity.ok().body(Map.of("status", "success", "message", "Join request approved"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", "Join request not found"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while approving join request"));
        }
    }

    @Operation(summary = "Reject join request by request ID")
    @PostMapping("/join-requests/{requestId}/reject")
    public ResponseEntity<?> rejectJoinRequest(HttpServletRequest request, @PathVariable Long requestId) {
        try {
            Long userId = getAuthenticatedUserId(request);
            boolean rejected = groupService.rejectJoinRequest(requestId, userId);
            if (rejected) {
//                kafkaTemplate.send(topicName, String.format(
//                        "User %d rejected the join request %d",
//                        userId, requestId));
                return ResponseEntity.ok().body(Map.of("status", "success", "message", "Join request rejected"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", "Join request not found"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while rejecting join request"));
        }
    }

    @Operation(summary = "Leave group by group ID")
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<?> leaveGroup(HttpServletRequest request, @PathVariable Long groupId) {
        try {
            Long userId = getAuthenticatedUserId(request);

            boolean left = groupService.leaveGroup(groupId, userId);
            if (left) {
//                kafkaTemplate.send(topicName, String.format(
//                        "User %d left the group %d", userId, groupId));
                return ResponseEntity.ok().body(Map.of("status", "success", "message", "User left the group"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("status", "error", "message", "User is not a member of the group"));
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while leaving the group"));
        }
    }

    @PostMapping("/{id}/image")
    @Operation(summary = "Upload image to group. Id of group")
    public ResponseEntity<?> uploadImage(
            HttpServletRequest request,
            @PathVariable final Long id,
            @Validated final MultipartFile file
    ) {
        try {
            Long userId = getAuthenticatedUserId(request);
            if (!groupService.isOwner(id, userId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "error", "message", "You are not owner of this group"));
            }
            groupService.uploadImage(id, file);
//            kafkaTemplate.send(topicName, String.format(
//                    "User %d apploaded the image %s for the group %d",
//                    userId, file.getOriginalFilename(), id));
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("status", "success"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "An error occurred while uploading the image"));
        }
    }
}
