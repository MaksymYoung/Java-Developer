package com.danit.notifications.controller;

import com.danit.notifications.entity.CommentConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.exception.NotificationNotFoundException;
import com.danit.notifications.service.CommentConsumerDataService;
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
@RequestMapping("/api/v1/kafka/comments")
@RequiredArgsConstructor
@Slf4j
public class CommentConsumerController {

    private final CommentConsumerDataService commentDataService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllCommentData(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<CommentConsumerData> commentsDataPage = commentDataService.getAllCommentData(pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                commentsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentDataById(@PathVariable final Long id) {
        CommentConsumerData commentData = commentDataService.getCommentDataById(id);
        if (commentData != null) {
            return ResponseEntity.ok(commentData);
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommentDataById(@PathVariable final Long id) {
        CommentConsumerData commentData = commentDataService.getCommentDataById(id);
        if (commentData != null) {
            commentDataService.deleteCommentDataById(id);
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse(
                            "success", "Notification deleted successfully"));
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getCommentDataByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<CommentConsumerData> commentsDataPage = commentDataService.getCommentConsumerDataByStatus(
                status, pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                commentsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<?> markAllAsRead(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<CommentConsumerData> commentsDataPage = commentDataService.markAllAsRead(pageable);
        if (commentsDataPage.isEmpty()) {
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse("success",
                            "No new notifications available."));
        }

        return ResponseEntity.ok()
                .body(ResponseUtils.createPagedResponse(
                        commentsDataPage, "success",
                        "New notifications retrieved successfully."));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateNotificationStatus(@PathVariable final Long id) {
        CommentConsumerData commentData = commentDataService.getCommentDataById(id);
        if (commentData == null) {
            throw new NotificationNotFoundException(String.format(
                    "Notification with id %d not found", id));
        }

        if (commentData.getStatus() == NotificationStatus.PROCESSED) {
            String message = "This notification has already been processed.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseUtils.createResponse("warning", message));
        }

        CommentConsumerData updatedData = commentDataService.updateNotificationStatus(id);
        return ResponseEntity.ok(updatedData);
    }
}
