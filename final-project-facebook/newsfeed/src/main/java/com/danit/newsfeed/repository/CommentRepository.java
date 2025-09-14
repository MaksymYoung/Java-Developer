package com.danit.newsfeed.repository;

import com.danit.newsfeed.domain.comment.Comment;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByFeedId(Long feedId, Sort sort);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.id = :id")
    void deleteCommentById(Long id);
}
