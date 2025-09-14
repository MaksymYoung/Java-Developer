package com.danit.newsfeed.service;

import com.danit.newsfeed.domain.feed.Feed;
import com.danit.newsfeed.domain.feed.FeedImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;



public interface FeedService {
    Feed getById(
            Long id
    );
    Page<Feed> getAllByUserId(
            Long id, Pageable pageable
    );

    Page<Feed> findAllFeedsByListOfUserIds(
            Pageable pageable
    );

    Feed update(
            Feed task
    );

    Feed create(
            Feed feed,
            Long userId
    );

    void delete(
            Long id
    );

    void uploadImage(
            Long id,
            FeedImage image
    );
    Feed createWithImages(
            String text,
            Long userId,
            MultipartFile[] files,
            Long groupId
    );
    Page<Feed> findFeedsByGroupId(
            Long ownerId,
            Pageable pageable);
    Page<Feed> findTopPostsByLikesAndGroupIdIsNull(
            Pageable pageable);
    boolean isFeedOwner(
            Long userId,
            Long taskId
    );
}
