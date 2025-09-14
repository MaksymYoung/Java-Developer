package com.danit.newsfeed.web.controller;

import com.danit.newsfeed.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/likes")
@RequiredArgsConstructor
@Tag(
        name = "Likes Controller",
        description = "Like API"
)
public class LikeController {

    private final LikeService likeService;
//    private final KafkaTemplate<String, String> kafkaTemplate;
//
//    @Value("${spring.kafka.topics.like_changes}")
//    private String topicName;

    @PostMapping("/feed")
    @Operation(summary = "Add like to Feed(Post).")
    public ResponseEntity<?> addLikeToFeed(
            @RequestParam final Long feedId,
            @RequestParam final Long userId
    ) {
        try {
            likeService
                    .addLikeToFeed(feedId, userId);
//            kafkaTemplate.send(topicName, String.format(
//                    "User %d add a like to feed %d", userId, feedId));
            return ResponseEntity
                    .ok()
                    .build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/comment")
    @Operation(summary = "Add like to Comment.")
    public ResponseEntity<?> addLikeToComment(
            @RequestParam final Long commentId,
            @RequestParam final Long userId
    ) {
        try {
            likeService
                    .addLikeToComment(commentId, userId);
//            kafkaTemplate.send(topicName, String.format(
//                    "User %d add a like to comment %d", userId, commentId));
            return ResponseEntity
                    .ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/feed")
    @Operation(summary = "Remove like from Feed.")
    public ResponseEntity<?> removeLikeFromFeed(
            @RequestParam final Long feedId,
            @RequestParam final Long userId
    ) {
        try {
            likeService
                    .removeLikeFromFeed(feedId, userId);
//            kafkaTemplate.send(topicName, String.format(
//                    "User %d removed a like from feed %d", userId, feedId));
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/comment")
    @Operation(summary = "Remove like from Comment.")
    public ResponseEntity<?> removeLikeFromComment(
            @RequestParam final Long commentId,
            @RequestParam final Long userId
    ) {
        try {
            likeService
                    .removeLikeFromComment(commentId, userId);
//            kafkaTemplate.send(topicName, String.format(
//                    "User %d removed a like from comment %d",
//                    userId, commentId));
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/feed/count")
    @Operation(summary = "Get likes for feedID.")
    public ResponseEntity<Long> getLikesCountForFeed(
            @RequestParam final Long feedId
    ) {
        Long count = likeService
                .getLikesCountForFeed(feedId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/comment/count")
    @Operation(summary = "Get likes for commentID.")
    public ResponseEntity<Long> getLikesCountForComment(
            @RequestParam final Long commentId
    ) {
        Long count = likeService
                .getLikesCountForComment(commentId);
        return ResponseEntity.ok(count);
    }
}
