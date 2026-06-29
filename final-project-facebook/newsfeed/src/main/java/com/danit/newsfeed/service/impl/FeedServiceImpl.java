package com.danit.newsfeed.service.impl;

import com.danit.newsfeed.domain.SuccessResponse;
import com.danit.newsfeed.domain.feed.Feed;
import com.danit.newsfeed.domain.feed.FeedImage;
import com.danit.newsfeed.repository.FeedRepository;
import com.danit.newsfeed.service.FeedService;
import com.danit.newsfeed.service.GatewayClient;
import com.danit.newsfeed.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
//@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class FeedServiceImpl implements FeedService {
    private final FeedRepository feedRepository;
    private final ImageService imageService;
    private final GatewayClient gatewayClient;
    @Override
    public Feed getById(final Long id) {
        return feedRepository.findById(id).orElse(null);

    }

    @Override
    public Page<Feed> getAllByUserId(final Long id, final Pageable pageable) {
        return feedRepository.findFeedsByOwnerIdWithoutGroup(id, pageable);
    }

    @Override
    public Page<Feed> findAllFeedsByListOfUserIds(
            final Pageable pageable
    ) {
        List<Long> allFriends = new ArrayList<>();

        try {
            ResponseEntity<SuccessResponse> allFriends1 =
                    gatewayClient.getAllFriends();
            Object data = allFriends1.getBody().getData();
            allFriends = (List<Long>) data;
        } catch (Exception e) {
            log.info("Not found friends from frind service.");
            log.info("Error . {} ", e.getMessage());

            allFriends.add(8888L);
        }

        return feedRepository
                .findFeedsByOwnerIdsWithoutGroup(allFriends, pageable);

    }

    @Override
    public Feed update(final Feed feed) {
        Feed byId = feedRepository.getById(feed.getId());
        byId.setContent(feed.getContent());
        return feedRepository.save(byId);
    }

    @Override
    public Feed create(final Feed feed, final Long userId) {
        feed.setUserId(userId);
        feed.setPostDate(LocalDateTime.now());
        return feedRepository.save(feed);
    }
    @Override
    @Transactional
    public Feed createWithImages(
            final String text,
            final Long userId,
            final MultipartFile[] files,
            final Long groupId
    ) {
        log.info("Post for user id {} created ", userId);
        Feed feed = new Feed();
        feed.setUserId(userId);
        feed.setPostDate(LocalDateTime.now());
        feed.setContent(text);
        feed.setGroupId(groupId);
        Feed save = feedRepository.save(feed);
        List<String> images = new ArrayList<>();
        if (!(files == null)) {
            for (MultipartFile file : files) {
                FeedImage feedImage = new FeedImage();
                feedImage.setFile(file);
                String fileName = imageService.upload(feedImage);
                feedRepository.addImage(save.getId(), "/newsfeed/" + fileName);
                images.add("/newsfeed/" + fileName);
            }
        }

        Feed test = new Feed();
        test.setImages(images);
        test.setId(save.getId());
        test.setContent(save.getContent());
        test.setPostDate(save.getPostDate());
        test.setUserId(userId);
        test.setLikesCount(save.getLikesCount());
        return test;
    }

    @Override
    public void delete(final Long id) {
        Optional<Feed> feed = feedRepository.findById(id);
        feedRepository.deleteById(id);
        feed.ifPresent(f -> {
            for (String image : f.getImages()) {
                imageService.delete(image);
            }
        });

    }

    @Override
    @Transactional
    public void uploadImage(final Long id, final FeedImage image) {

        String fileName = imageService.upload(image);
        feedRepository.addImage(id, "/newsfeed/" + fileName);
    }

    @Override
    @Transactional
    public Page<Feed> findFeedsByGroupId(
            final Long ownerId,
            final Pageable pageable) {
        return feedRepository.findFeedsByGroupId(ownerId, pageable);
    }

    @Override
    public Page<Feed> findTopPostsByLikesAndGroupIdIsNull(
            final Pageable pageable) {
        return feedRepository.findTopPostsByLikesAndGroupIdIsNull(pageable);
    }

    @Override
    public boolean isFeedOwner(final Long userId, final Long taskId) {
        return feedRepository.isFeedOwner(userId, taskId);
    }
}
