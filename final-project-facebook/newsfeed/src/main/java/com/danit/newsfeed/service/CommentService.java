package com.danit.newsfeed.service;

import com.danit.newsfeed.domain.comment.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentService {
    Comment createComment(Comment comment);

   Comment updateComment(Long id, String newCommentText);

    List<Comment> getAllCommentsByFeedId(Long feedId);

    Optional<Comment> getCommentById(Long id);
    void delete(
            Long id
    );
}
