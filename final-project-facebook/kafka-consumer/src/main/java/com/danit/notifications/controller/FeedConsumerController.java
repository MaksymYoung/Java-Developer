package com.danit.notifications.controller;

import com.danit.notifications.entity.FeedConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.exception.NotificationNotFoundException;
import com.danit.notifications.service.FeedConsumerDataService;
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
@RequestMapping("/api/v1/kafka/feeds")
@RequiredArgsConstructor
@Slf4j
public class FeedConsumerController {

    private final FeedConsumerDataService feedDataService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllFeedData(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<FeedConsumerData> feedsDataPage = feedDataService.getAllFeedData(pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                feedsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeedDataById(@PathVariable final Long id) {
        FeedConsumerData feedData = feedDataService.getFeedDataById(id);
        if (feedData != null) {
            return ResponseEntity.ok(feedData);
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedDataById(@PathVariable final Long id) {
        FeedConsumerData feedData = feedDataService.getFeedDataById(id);
        if (feedData != null) {
            feedDataService.deleteFeedDataById(id);
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse(
                            "success", "Notification deleted successfully"));
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getFeedDataByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<FeedConsumerData> feedsDataPage = feedDataService.getFeedConsumerDataByStatus(
                status, pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                feedsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<?> markAllAsRead(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<FeedConsumerData> feedsDataPage = feedDataService.markAllAsRead(pageable);
        if (feedsDataPage.isEmpty()) {
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse("success",
                            "No new notifications available."));
        }

        return ResponseEntity.ok()
                .body(ResponseUtils.createPagedResponse(
                        feedsDataPage, "success",
                        "New notifications retrieved successfully."));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateNotificationStatus(@PathVariable final Long id) {
        FeedConsumerData feedData = feedDataService.getFeedDataById(id);
        if (feedData == null) {
            throw new NotificationNotFoundException(String.format(
                    "Notification with id %d not found", id));
        }

        if (feedData.getStatus() == NotificationStatus.PROCESSED) {
            String message = "This notification has already been processed.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseUtils.createResponse("warning", message));
        }

        FeedConsumerData updatedData = feedDataService.updateNotificationStatus(id);
        return ResponseEntity.ok(updatedData);
    }
}
