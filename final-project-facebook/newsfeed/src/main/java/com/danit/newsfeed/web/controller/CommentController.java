package com.danit.newsfeed.web.controller;

import com.danit.newsfeed.domain.comment.Comment;
import com.danit.newsfeed.service.CommentService;
import com.danit.newsfeed.web.dto.comment.CommentDto;
import com.danit.newsfeed.web.mappers.CommentMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@Tag(
        name = "Comment Controller",
        description = "Comment API"
)
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;
//    private final KafkaTemplate<String, String> kafkaTemplate;

//    @Value("${spring.kafka.topics.comment_changes}")
//    private String topicName;

    @PostMapping
    @Operation(summary = "Create comment , id will generate auto.")
    @PreAuthorize("@customSecurityExpression.canAccessUser(#commentDto.userId)")
    public ResponseEntity<CommentDto> createComment(
            @RequestBody final CommentDto commentDto
    ) {
        Comment comment = commentMapper
                .toEntity(commentDto);
        Comment createdComment = commentService
                .createComment(comment);
//        kafkaTemplate.send(topicName, String.format(
//                "User %d created a new comment %d: %s",
//                createdComment.getUserId(), createdComment.getId(),
//                createdComment.getComment()));
        return ResponseEntity.ok(commentMapper
                .toDto(createdComment));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update comment .")
    @PreAuthorize("@customSecurityExpression.canAccessUser(#id)")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable final Long id,
            @RequestBody final String text
    ) {
        CommentDto commentDto = new CommentDto();
        commentDto.setComment(text);
        Comment updatedComment = commentService
                .updateComment(id, commentDto.getComment());
//        kafkaTemplate.send(topicName, String.format(
//                "User %d updated a comment %d: %s",
//                updatedComment.getUserId(), updatedComment.getId(),
//                updatedComment.getComment()));
        return ResponseEntity.ok(commentMapper
                .toDto(updatedComment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@customSecurityExpression.canAccessUser(#id)")
    @Operation(summary = "Delete comment by ID.")
    public ResponseEntity<Void> deleteComment(
            @PathVariable final Long id
    ) {
        commentService.delete(id);
//        kafkaTemplate.send(topicName, String.format(
//                "Comment %d was deleted", id));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/feed/{feedId}")
    @Operation(summary = "Get all comments to feed by Id.")
    public ResponseEntity<List<CommentDto>> getAllCommentsByFeedId(
            @PathVariable final Long feedId
    ) {
        List<Comment> comments = commentService
                .getAllCommentsByFeedId(feedId);
        List<CommentDto> commentDtos = comments.stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(commentDtos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get comment by Id.")
    public ResponseEntity<CommentDto> getCommentById(
            @PathVariable final Long id) {
        return commentService.getCommentById(id)
                .map(commentMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
