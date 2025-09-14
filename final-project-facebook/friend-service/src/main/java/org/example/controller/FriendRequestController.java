package org.example.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.example.domain.FriendRequest;
import org.example.domain.SuccessResponse;
import org.example.service.FriendRequestServiceImpl;
import org.example.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend-requests")
public class FriendRequestController {

    private final FriendRequestServiceImpl friendRequestService;

//    private final KafkaTemplate<String, String> kafkaTemplate;

//    @Value("${spring.kafka.topics.friend_changes}")
//    private String topicName;

    @Autowired
    public FriendRequestController(FriendRequestServiceImpl friendRequestService
            // KafkaTemplate<String, String> kafkaTemplate
    ) {
        this.friendRequestService = friendRequestService;
//        this.kafkaTemplate = kafkaTemplate;
    }

    @Operation(summary = "Send request from authenticated user to other user")
    @PostMapping("/send")
    public ResponseEntity<?> sendFriendRequest(@RequestParam Long receiverId, HttpServletRequest request) {
        FriendRequest friendRequest = friendRequestService.sendFriendRequest(receiverId, request);
//        kafkaTemplate.send(topicName, String.format(
//                "User %d got the friend request", receiverId));
        return ResponseEntity.ok(new SuccessResponse("success", friendRequest));
    }

    @Operation(summary = "Revoke sent friend request by receiver ID")
    @DeleteMapping("/revoke")
    public ResponseEntity<?> revokeFriendRequest(@RequestParam Long receiverId, HttpServletRequest request) {
        friendRequestService.revokeFriendRequest(receiverId, request);
//        kafkaTemplate.send(topicName, String.format(
//                "User %d revoked the friend request", receiverId));
        return ResponseEntity.ok(new SuccessResponse("success", "Friend request revoked successfully"));
    }

    @Operation(summary = "Approve received request from other user by Id of request")
    @PostMapping("/approve")
    public ResponseEntity<?> approveFriendRequest(@RequestParam Long requestId, HttpServletRequest request) {
        FriendRequest friendRequest = friendRequestService.approveFriendRequest(requestId, request);
//        kafkaTemplate.send(topicName, String.format(
//                "Friend request %d was approved", requestId));
        return ResponseEntity.ok(new SuccessResponse("success", friendRequest));
    }

    @Operation(summary = "Reject received request from other user by Id of request")
    @PostMapping("/reject")
    public ResponseEntity<?> rejectFriendRequest(@RequestParam Long requestId, HttpServletRequest request) {
        FriendRequest friendRequest = friendRequestService.rejectFriendRequest(requestId, request);
//        kafkaTemplate.send(topicName, String.format(
//                "Friend request %d was rejected", requestId));
        return ResponseEntity.ok(new SuccessResponse("success", friendRequest));
    }

    @Operation(summary = "Get all requests, that was sent to authenticated user from other users.")
    @GetMapping("/sent")
    public ResponseEntity<?> getAllSentFriendRequests(HttpServletRequest request) {
        List<FriendRequest> sentRequests = friendRequestService.getAllSentFriendRequests(request);
        return ResponseEntity.ok(new SuccessResponse("success", sentRequests));
    }

    @Operation(summary = "Get all PENDING requests, that was sent to authenticated user from other users")
    @GetMapping("/pending")
    public ResponseEntity<?> getAllPendingFriendRequests(HttpServletRequest request) {
        List<FriendRequest> pendingRequests = friendRequestService.getAllPendingFriendRequests(request);
        return ResponseEntity.ok(new SuccessResponse("success", pendingRequests));
    }


    @Operation(summary = "Get all friends ids of current user.")
    @GetMapping("/friends")
    public ResponseEntity<?> getAllFriends(HttpServletRequest request) {
        List<Long> friends = friendRequestService.getAllFriends(request);
        return ResponseEntity.ok(new SuccessResponse("success", friends));
    }

    @Operation(summary = "Check, if current user and other user are friends.")
    @GetMapping("/are-friends")
    public ResponseEntity<?> areFriends(@RequestParam Long userId, HttpServletRequest request) {
        boolean areFriends = friendRequestService.areFriends(request, userId);
        return ResponseEntity.ok(new SuccessResponse("success", areFriends));
    }

    @Operation(summary = "Remove user from friends of current user.")
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFriend(@RequestParam Long friendId, HttpServletRequest request) {
        friendRequestService.removeFriend(friendId, request);
//        kafkaTemplate.send(topicName, String.format(
//                "User %d was removed from friends", friendId));
        return ResponseEntity.ok().body("Friend was deleted successfully.");
    }
}

