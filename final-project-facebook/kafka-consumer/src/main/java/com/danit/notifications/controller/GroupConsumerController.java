package com.danit.notifications.controller;

import com.danit.notifications.entity.GroupConsumerData;
import com.danit.notifications.entity.NotificationStatus;
import com.danit.notifications.exception.NotificationNotFoundException;
import com.danit.notifications.service.GroupConsumerDataService;
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
@RequestMapping("/api/v1/kafka/groups")
@RequiredArgsConstructor
@Slf4j
public class GroupConsumerController {

    private final GroupConsumerDataService groupDataService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllGroupData(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<GroupConsumerData> groupsDataPage = groupDataService.getAllGroupData(pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                groupsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupDataById(@PathVariable final Long id) {
        GroupConsumerData groupData = groupDataService.getGroupDataById(id);
        if (groupData != null) {
            return ResponseEntity.ok(groupData);
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroupDataById(@PathVariable final Long id) {
        GroupConsumerData groupData = groupDataService.getGroupDataById(id);
        if (groupData != null) {
            groupDataService.deleteGroupDataById(id);
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse(
                            "success", "Notification deleted successfully"));
        } else {
            throw new NotificationNotFoundException(
                    String.format("Notification with id %d not found", id));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getGroupDataByStatus(
            @PathVariable NotificationStatus status,
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<GroupConsumerData> groupsDataPage = groupDataService.getGroupConsumerDataByStatus(
                status, pageable);

        return ResponseEntity.ok().body(ResponseUtils.createPagedResponse(
                groupsDataPage, "success",
                "Notifications retrieved successfully"));
    }

    @PutMapping
    public ResponseEntity<?> markAllAsRead(
            @RequestParam(value = "page", defaultValue = "0") final int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) final int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<GroupConsumerData> groupsDataPage = groupDataService.markAllAsRead(pageable);
        if (groupsDataPage.isEmpty()) {
            return ResponseEntity.ok()
                    .body(ResponseUtils.createResponse("success",
                            "No new notifications available."));
        }

        return ResponseEntity.ok()
                .body(ResponseUtils.createPagedResponse(
                        groupsDataPage, "success",
                        "New notifications retrieved successfully."));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateNotificationStatus(@PathVariable final Long id) {
        GroupConsumerData groupData = groupDataService.getGroupDataById(id);
        if (groupData == null) {
            throw new NotificationNotFoundException(String.format(
                    "Notification with id %d not found", id));
        }

        if (groupData.getStatus() == NotificationStatus.PROCESSED) {
            String message = "This notification has already been processed.";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseUtils.createResponse("warning", message));
        }

        GroupConsumerData updatedData = groupDataService.updateNotificationStatus(id);
        return ResponseEntity.ok(updatedData);
    }
}
