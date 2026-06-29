package org.example.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.domain.FriendRequest;
import org.example.domain.FriendRequestStatus;
import org.example.exceptions.GlobalExceptionHandler;
import org.example.service.FriendRequestServiceImpl;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Disabled
@ExtendWith(MockitoExtension.class)
class FriendRequestControllerTest {

    @Mock
    private FriendRequestServiceImpl friendRequestService;

    @InjectMocks
    private FriendRequestController friendRequestController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(friendRequestController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testSendFriendRequest() throws Exception {
        FriendRequest friendRequest = new FriendRequest();
        when(friendRequestService.sendFriendRequest(anyLong(), any(HttpServletRequest.class))).thenReturn(friendRequest);

        mockMvc.perform(post("/friend-requests/send")
                        .param("receiverId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").isNotEmpty());
    }

    @Test
    public void testApproveFriendRequest() throws Exception {
        FriendRequest friendRequest = new FriendRequest();
        when(friendRequestService.approveFriendRequest(anyLong(), any(HttpServletRequest.class))).thenReturn(friendRequest);

        mockMvc.perform(post("/friend-requests/approve")
                        .param("requestId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").isNotEmpty());
    }

    @Test
    public void testGetAllSentFriendRequests() throws Exception {
        List<FriendRequest> requests = Collections.singletonList(new FriendRequest());
        when(friendRequestService.getAllSentFriendRequests(any(HttpServletRequest.class))).thenReturn(requests);

        mockMvc.perform(get("/friend-requests/sent")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").isNotEmpty());
    }

    @Test
    public void getAllPendingFriendRequestsTest() throws Exception {
        List<FriendRequest> friendRequests = Arrays.asList(
                new FriendRequest(1L, 2L, 3L, FriendRequestStatus.PENDING, LocalDateTime.now(), LocalDateTime.now())
        );
        when(friendRequestService.getAllPendingFriendRequests(any(HttpServletRequest.class))).thenReturn(friendRequests);

        mockMvc.perform(get("/friend-requests/pending")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(1L));
    }

    @Test
    public void getAllFriendsTest() throws Exception {
        List<Long> friends = Arrays.asList(1L, 2L);
        when(friendRequestService.getAllFriends(any(HttpServletRequest.class))).thenReturn(friends);

        mockMvc.perform(get("/friend-requests/friends")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0]").value(1L));
    }

    @Test
    public void areFriendsTest() throws Exception {
        when(friendRequestService.areFriends(any(HttpServletRequest.class), anyLong())).thenReturn(true);

        mockMvc.perform(get("/friend-requests/are-friends")
                        .param("userId", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    public void removeFriendTest() throws Exception {
        doNothing().when(friendRequestService).removeFriend(anyLong(), any(HttpServletRequest.class));

        mockMvc.perform(delete("/friend-requests/remove")
                        .param("friendId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}