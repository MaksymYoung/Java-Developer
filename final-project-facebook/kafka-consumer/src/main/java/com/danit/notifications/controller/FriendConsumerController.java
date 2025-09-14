package com.danit.notifications.controller;

import com.danit.notifications.entity.FriendConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.exception.NotificationNotFoundException;
import com.danit.notifications.service.FriendConsumerDataService;
import com.danit.notifications.utility.ResponseUtils;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kafka/friends")
@RequiredArgsConstructor
@Slf4j
public class FriendConsumerController {

    private final FriendConsumerDataService friendDataService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllFriendData(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<FriendConsumerData> friendsDataPage = friendDataService.getAllFriendData(pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                friendsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFriendDataById(@PathVariable final Long id) {
        FriendConsumerData friendData = friendDataService.getFriendDataById(id);
        if (friendData != null) {
            return ResponseEntity.ok(friendData);
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFriendDataById(@PathVariable final Long id) {
        FriendConsumerData friendData = friendDataService.getFriendDataById(id);
        if (friendData != null) {
            friendDataService.deleteFriendDataById(id);
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse(
                            "success", "Notification deleted successfully"));
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getFriendDataByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<FriendConsumerData> friendsDataPage = friendDataService.getFriendConsumerDataByStatus(
                status, pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                friendsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<?> markAllAsRead(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<FriendConsumerData> friendsDataPage = friendDataService.markAllAsRead(pageable);
        if (friendsDataPage.isEmpty()) {
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse("success",
                            "No new notifications available."));
        }

        return ResponseEntity.ok()
                .body(ResponseUtils.createPagedResponse(
                        friendsDataPage, "success",
                        "New notifications retrieved successfully."));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateNotificationStatus(@PathVariable final Long id) {
        FriendConsumerData friendData = friendDataService.getFriendDataById(id);
        if (friendData == null) {
            throw new NotificationNotFoundException(String.format(
                    "Notification with id %d not found", id));
        }

        if (friendData.getStatus() == NotificationStatus.PROCESSED) {
            String message = "This notification has already been processed.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseUtils.createResponse("warning", message));
        }

        FriendConsumerData updatedData = friendDataService.updateNotificationStatus(id);
        return ResponseEntity.ok(updatedData);
    }
}
