package com.danit.newsfeed.service.impl;

import com.danit.newsfeed.domain.comment.Comment;
import com.danit.newsfeed.domain.feed.Feed;
import com.danit.newsfeed.domain.likes.Like;
import com.danit.newsfeed.repository.CommentRepository;
import com.danit.newsfeed.repository.FeedRepository;
import com.danit.newsfeed.repository.LikeRepository;
import com.danit.newsfeed.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;

    private final FeedRepository feedRepository;

    private final CommentRepository commentRepository;

    public void addLikeToFeed(
            final Long feedId,
            final Long userId
    ) {
        if (likeRepository
                .findByFeedIdAndUserId(feedId, userId)
                .isPresent()) {
            throw new IllegalArgumentException(
                    "User has already liked this feed");
        }

        Feed feed = feedRepository
                .findById(feedId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Feed not found"));

        Like like = new Like();
        like.setFeed(feed);
        like.setUserId(userId);
        likeRepository.save(like);
    }

    public void addLikeToComment(
            final Long commentId,
            final Long userId
    ) {
        if (likeRepository
                .findByCommentIdAndUserId(commentId, userId)
                .isPresent()) {
            throw new IllegalArgumentException(
                    "User has already liked this comment");
        }

        Comment comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Comment not found"));

        Like like = new Like();
        like.setComment(comment);
        like.setUserId(userId);
        likeRepository.save(like);
    }

    public void removeLikeFromFeed(
            final Long feedId,
            final Long userId
    ) {
        if (!likeRepository
                .findByFeedIdAndUserId(feedId, userId)
                .isPresent()) {
            throw new IllegalArgumentException(
                    "User has not liked this feed");
        }

        likeRepository.deleteByFeedIdAndUserId(feedId, userId);
    }

    public void removeLikeFromComment(
            final Long commentId,
            final Long userId
    ) {
        if (!likeRepository
                .findByCommentIdAndUserId(commentId, userId)
                .isPresent()) {
            throw new IllegalArgumentException(
                    "User has not liked this comment");
        }

        likeRepository
                .deleteByCommentIdAndUserId(commentId, userId);
    }

    public Long getLikesCountForFeed(final Long feedId) {
        return likeRepository.countByFeedId(feedId);
    }

    public Long getLikesCountForComment(final Long commentId) {
        return likeRepository.countByCommentId(commentId);
    }
}
