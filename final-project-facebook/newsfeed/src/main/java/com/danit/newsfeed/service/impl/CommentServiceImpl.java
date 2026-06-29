package com.danit.newsfeed.service.impl;

import com.danit.newsfeed.domain.comment.Comment;
import com.danit.newsfeed.repository.CommentRepository;
import com.danit.newsfeed.repository.LikeRepository;
import com.danit.newsfeed.service.CommentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    @Override
    public Comment createComment(final Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }
    @Override
    public Comment updateComment(final Long id, final String newCommentText) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Comment not found"
                ));

        comment.setComment(newCommentText);
        return commentRepository.save(comment);
    }
    @Override
    @Transactional
    public void delete(final Long id) {

        commentRepository.deleteCommentById(id);
        likeRepository.deleteByCommentId(id);
    }
    @Override
    public List<Comment> getAllCommentsByFeedId(final Long feedId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        return commentRepository.findAllByFeedId(feedId, sort);
    }
    @Override
    public Optional<Comment> getCommentById(final Long id) {
        return commentRepository.findById(id);
    }
}
