package org.example.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.domain.Friend;
import org.example.domain.FriendRequest;
import org.example.domain.FriendRequestStatus;
import org.example.repository.FriendRepository;
import org.example.repository.FriendRequestRepository;
//import org.springframework.security.oauth2.jwt.Jwt;
import org.example.util.JwtUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FriendRequestServiceImpl {

    private final FriendRequestRepository friendRequestRepository;
    private final FriendRepository friendRepository;
    private final JwtUtils jwtUtils;

    public FriendRequestServiceImpl(FriendRequestRepository friendRequestRepository, FriendRepository friendRepository, JwtUtils jwtUtils) {
        this.friendRequestRepository = friendRequestRepository;
        this.friendRepository = friendRepository;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public FriendRequest sendFriendRequest(Long receiverId, HttpServletRequest request) {
        Long senderId = getAuthenticatedUserId(request);

        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("You can't send request to yourself");
        }

        if (friendRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, FriendRequestStatus.PENDING)) {
            throw new IllegalStateException("Friend request already sent");
        }

        if (areFriends(request, receiverId)) {
            throw new IllegalStateException("Users are already friends");
        }

        FriendRequest friendRequest = FriendRequest.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .status(FriendRequestStatus.PENDING)
                .createdDate(LocalDateTime.now())
                .updatedDate(LocalDateTime.now())
                .build();

        return friendRequestRepository.save(friendRequest);
    }

    @Transactional
    public void revokeFriendRequest(Long receiverId, HttpServletRequest request) {
        Long currentUserId = getAuthenticatedUserId(request);

        FriendRequest friendRequest = friendRequestRepository.findBySenderIdAndReceiverIdAndStatus(currentUserId, receiverId, FriendRequestStatus.PENDING)
                .orElseThrow(() -> new IllegalArgumentException("Pending friend request not found"));

        friendRequestRepository.delete(friendRequest);
    }

    @Transactional
    public FriendRequest approveFriendRequest(Long requestId, HttpServletRequest request) {
        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!friendRequest.getStatus().equals(FriendRequestStatus.PENDING)) {
            throw new IllegalArgumentException("Request have already been resolved.");
        }

        Long currentUserId = getAuthenticatedUserId(request);
        Long senderUserId = friendRequest.getSenderId();

        if (!friendRequest.getReceiverId().equals(currentUserId)) {
            throw new IllegalArgumentException("Request did not send to you. You have no rights to manage it.");
        }

        Friend friend = Friend.builder()
                .user1Id(senderUserId)
                .user2Id(friendRequest.getReceiverId())
                .build();
        friendRepository.save(friend);

      friendRequestRepository.delete(friendRequest);

        friendRequestRepository.deleteBySenderIdAndReceiverIdOrReceiverIdAndSenderIdAndStatus(
                senderUserId,
                currentUserId,
                FriendRequestStatus.PENDING
        );

        return friendRequest;
    }

    @Transactional
    public FriendRequest rejectFriendRequest(Long requestId, HttpServletRequest request) {

        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (!friendRequest.getReceiverId().equals(getAuthenticatedUserId(request))) {
            throw new IllegalArgumentException("Request did not send to you. You have no rights to manage it.");
        }

        friendRequestRepository.delete(friendRequest);

        return friendRequest;
    }


    public List<FriendRequest> getAllSentFriendRequests(HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        return friendRequestRepository.findBySenderId(userId);
    }

    public List<FriendRequest> getAllPendingFriendRequests(HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        return friendRequestRepository.findByReceiverIdAndStatus(userId, FriendRequestStatus.PENDING);
    }

    public boolean areFriends(HttpServletRequest request, Long userId) {
        Long currentUserId = getAuthenticatedUserId(request);
        return friendRepository.existsByUser1IdAndUser2IdOrUser2IdAndUser1Id(currentUserId, userId);
    }

    @Transactional(readOnly = true)
    public List<Long> getAllFriends(HttpServletRequest request) {
        Long currentUserId = getAuthenticatedUserId(request);
        List<Friend> friends = friendRepository.findAllFriendsByUserId(currentUserId);
        return friends.stream()
                .flatMap(friend -> Stream.of(friend.getUser1Id(), friend.getUser2Id()))
                .filter(id -> !id.equals(currentUserId)) // Exclude the authenticated user's own Id
                .collect(Collectors.toList());
    }

    private Long getAuthenticatedUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7); // Remove "Bearer " prefix
        return jwtUtils.getUserIdFromToken(token);
    }

    @Transactional
    public void removeFriend(Long friendId, HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        if (!areFriends(request, friendId)) {
            throw new IllegalStateException("Users are not friends");
        }

        if (friendRepository.existsByUser1IdAndUser2IdOrUser2IdAndUser1Id(userId, friendId)) {
            friendRepository.deleteByUser1IdAndUser2Id(userId, friendId);
            friendRepository.deleteByUser2IdAndUser1Id(userId, friendId);
        }
    }
}




