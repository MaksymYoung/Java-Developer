package org.example.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.domain.Friend;
import org.example.domain.FriendRequest;
import org.example.domain.FriendRequestStatus;
import org.example.repository.FriendRepository;
import org.example.repository.FriendRequestRepository;
import org.example.util.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Disabled
public class FriendRequestServiceImplTest {

    @Mock
    private FriendRequestRepository friendRequestRepository;

    @Mock
    private FriendRepository friendRepository;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private HttpServletRequest request;

    @Spy
    @InjectMocks
    private FriendRequestServiceImpl friendRequestService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSendFriendRequest() {
        Long senderId = 2L;
        Long receiverId = 1L;

        when(jwtUtils.getUserIdFromToken(anyString())).thenReturn(senderId);
        when(friendRequestRepository.existsBySenderIdAndReceiverIdAndStatus(senderId, receiverId, FriendRequestStatus.PENDING)).thenReturn(false);
        when(friendRepository.existsByUser1IdAndUser2IdOrUser2IdAndUser1Id(senderId, receiverId)).thenReturn(false);
        when(friendRequestRepository.save(any(FriendRequest.class))).thenReturn(new FriendRequest());

        FriendRequest friendRequest = friendRequestService.sendFriendRequest(receiverId, request);
        assertNotNull(friendRequest);
        verify(friendRequestRepository, times(1)).save(any(FriendRequest.class));
    }

    @Test
    public void testApproveFriendRequest() {
        Long userId = 3L;
        Long requestId = 1L;

        FriendRequest friendRequest = new FriendRequest(requestId, 2L, userId, FriendRequestStatus.PENDING, LocalDateTime.now(), LocalDateTime.now());

        when(jwtUtils.getUserIdFromToken(anyString())).thenReturn(userId);
        when(friendRequestRepository.findById(requestId)).thenReturn(Optional.of(friendRequest));
        when(friendRequestRepository.save(any(FriendRequest.class))).thenReturn(friendRequest);

        FriendRequest result = friendRequestService.approveFriendRequest(requestId, request);
        assertNotNull(result);
        assertEquals(FriendRequestStatus.ACCEPTED, result.getStatus());
        verify(friendRepository, times(1)).save(any(Friend.class));
    }

    @Test
    public void testGetAllSentFriendRequests() {
        Long userId = 1L;

        when(jwtUtils.getUserIdFromToken(anyString())).thenReturn(userId);
        when(friendRequestRepository.findBySenderId(userId)).thenReturn(Collections.singletonList(new FriendRequest()));

        List<FriendRequest> requests = friendRequestService.getAllSentFriendRequests(request);
        assertFalse(requests.isEmpty());
    }

    @Test
    public void getAllPendingFriendRequestsTest() {
        Long receiverId = 3L;

        List<FriendRequest> friendRequests = Arrays.asList(new FriendRequest(1L, 2L, receiverId, FriendRequestStatus.PENDING, LocalDateTime.now(), LocalDateTime.now()));

        when(jwtUtils.getUserIdFromToken(anyString())).thenReturn(receiverId);
        when(friendRequestRepository.findByReceiverIdAndStatus(receiverId, FriendRequestStatus.PENDING)).thenReturn(friendRequests);

        List<FriendRequest> pendingRequests = friendRequestService.getAllPendingFriendRequests(request);

        assertEquals(1, pendingRequests.size());
        assertEquals(receiverId, pendingRequests.get(0).getReceiverId());
    }

    @Test
    public void areFriendsTest() {
        Long user1Id = 1L;
        Long user2Id = 2L;

        when(jwtUtils.getUserIdFromToken(anyString())).thenReturn(user1Id);
        when(friendRepository.existsByUser1IdAndUser2IdOrUser2IdAndUser1Id(user1Id, user2Id)).thenReturn(true);

        boolean areFriends = friendRequestService.areFriends(request, user2Id);

        assertTrue(areFriends);
    }

    @Test
    public void getAllFriendsTest() {
        Long userId = 1L;
        List<Friend> friendIds = Arrays.asList(new Friend(100L, 100L, 100L), new Friend(101L, 101L, 101L));

        when(jwtUtils.getUserIdFromToken(anyString())).thenReturn(userId);
        when(friendRepository.findAllFriendsByUserId(userId)).thenReturn(friendIds);

        List<Long> friends = friendRequestService.getAllFriends(request);

        assertEquals(4, friends.size());
        assertEquals(friendIds.get(0).getUser2Id(), friends.get(0));
    }

    @Test
    public void removeFriendTest() {
        Long userId = 1L;
        Long friendId = 2L;

        when(jwtUtils.getUserIdFromToken(anyString())).thenReturn(userId);
        when(friendRepository.existsByUser1IdAndUser2IdOrUser2IdAndUser1Id(userId, friendId)).thenReturn(true);

        doNothing().when(friendRepository).deleteByUser1IdAndUser2Id(userId, friendId);
        doNothing().when(friendRepository).deleteByUser2IdAndUser1Id(userId, friendId);

        friendRequestService.removeFriend(friendId, request);

        verify(friendRepository, times(1)).deleteByUser1IdAndUser2Id(userId, friendId);
        verify(friendRepository, times(1)).deleteByUser2IdAndUser1Id(userId, friendId);
    }
}

