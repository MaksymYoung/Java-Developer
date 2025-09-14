package com.danit.newsfeed.repository;

import com.danit.newsfeed.domain.likes.Like;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByFeedIdAndUserId(Long feedId, Long userId);
    Optional<Like> findByCommentIdAndUserId(Long commentId, Long userId);
    Long countByFeedId(Long feedId);
    Long countByCommentId(Long commentId);
    @Transactional
    @Modifying
    @Query("DELETE FROM Like e "
            + "WHERE e.feed.id = :feedId "
            + "AND e.userId = :userId")
    void deleteByFeedIdAndUserId(
            @Param("feedId") Long feedId,
            @Param("userId") Long userId);
    @Transactional
    @Modifying
    @Query("DELETE FROM Like e "
            + "WHERE e.comment.id = :commentId")
    void deleteByCommentId(@Param("commentId") Long commentId);


    @Transactional
    @Modifying
    @Query("DELETE FROM Like e "
            + "WHERE e.comment.id = :commentId "
            + "AND e.userId = :userId")
    void deleteByCommentIdAndUserId(
            @Param("commentId") Long commentId,
            @Param("userId") Long userId);
}
