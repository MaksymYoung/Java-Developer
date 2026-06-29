package org.example.service;

import org.example.domain.FriendRequest;
import java.util.List;

public interface FriendRequestService {
    public FriendRequest sendFriendRequest(String receiverEmail);

    public FriendRequest approveFriendRequest(Long requestId);

    public FriendRequest rejectFriendRequest(Long requestId);

    public List<FriendRequest> getPendingRequests();

    public List<FriendRequest> getAllSentFriendRequests();

    public List<FriendRequest> getAllPendingFriendRequests();

    public boolean areFriends(String user1Email, String user2Email);

    public List<String> getAllFriends();

    public String getAuthenticatedUserEmail();
}
