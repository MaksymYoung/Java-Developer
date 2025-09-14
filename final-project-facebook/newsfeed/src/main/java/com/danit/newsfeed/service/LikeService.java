package com.danit.newsfeed.service;

public interface LikeService {
    void addLikeToFeed(Long feedId, Long userId);
    void addLikeToComment(Long commentId, Long userId);
    void removeLikeFromFeed(Long feedId, Long userId);
    void removeLikeFromComment(Long commentId, Long userId);
    Long getLikesCountForFeed(Long feedId);
    Long getLikesCountForComment(Long commentId);

}
