package com.danit.notifications.controller;

import com.danit.notifications.entity.LikeConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.exception.NotificationNotFoundException;
import com.danit.notifications.service.LikeConsumerDataService;
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
@RequestMapping("/api/v1/kafka/likes")
@RequiredArgsConstructor
@Slf4j
public class LikeConsumerController {

    private final LikeConsumerDataService likeDataService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllLikeData(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<LikeConsumerData> likesDataPage = likeDataService.getAllLikeData(pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                likesDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLikeDataById(@PathVariable final Long id) {
        LikeConsumerData likeData = likeDataService.getLikeDataById(id);
        if (likeData != null) {
            return ResponseEntity.ok(likeData);
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLikeDataById(@PathVariable final Long id) {
        LikeConsumerData likeData = likeDataService.getLikeDataById(id);
        if (likeData != null) {
            likeDataService.deleteLikeDataById(id);
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse(
                            "success", "Notification deleted successfully"));
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getLikeDataByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<LikeConsumerData> likesDataPage = likeDataService.getLikeConsumerDataByStatus(
                status, pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                likesDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<?> markAllAsRead(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<LikeConsumerData> likesDataPage = likeDataService.markAllAsRead(pageable);
        if (likesDataPage.isEmpty()) {
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse("success",
                            "No new notifications available."));
        }

        return ResponseEntity.ok()
                .body(ResponseUtils.createPagedResponse(
                        likesDataPage, "success",
                        "New notifications retrieved successfully."));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateNotificationStatus(@PathVariable final Long id) {
        LikeConsumerData likeData = likeDataService.getLikeDataById(id);
        if (likeData == null) {
            throw new NotificationNotFoundException(String.format(
                    "Notification with id %d not found", id));
        }

        if (likeData.getStatus() == NotificationStatus.PROCESSED) {
            String message = "This notification has already been processed.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseUtils.createResponse("warning", message));
        }

        LikeConsumerData updatedData = likeDataService.updateNotificationStatus(id);
        return ResponseEntity.ok(updatedData);
    }
}
