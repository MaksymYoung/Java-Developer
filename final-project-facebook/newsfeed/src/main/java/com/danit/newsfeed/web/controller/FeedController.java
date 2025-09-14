package com.danit.newsfeed.web.controller;

import com.danit.newsfeed.domain.feed.Feed;
import com.danit.newsfeed.domain.feed.FeedImage;
import com.danit.newsfeed.service.FeedService;
import com.danit.newsfeed.web.dto.feed.FeedDto;
import com.danit.newsfeed.web.dto.feed.FeedImageDto;
import com.danit.newsfeed.web.dto.validation.OnUpdate;
import com.danit.newsfeed.web.mappers.FeedImageMapper;
import com.danit.newsfeed.web.mappers.FeedMapper;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
//import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/v1/feeds")
@RequiredArgsConstructor
@Tag(
        name = "Feed Controller",
        description = "Feed API"
)
public class FeedController {
    private final FeedService feedService;
    private final FeedMapper feedMapper;
    private final FeedImageMapper feedImageMapper;
//    private final KafkaTemplate<String, String> kafkaTemplate;

//    @Value("${spring.kafka.topics.feed_changes}")
//    private String topicName;

    @GetMapping("/users/{id}")
    @Operation(summary = "Get all User feeds")
    public ResponseEntity<Page<FeedDto>> getFeedsByUserId(
            @PathVariable final Long id,
            @RequestParam(defaultValue = "0") final int page,
            @RequestParam(defaultValue = "10") @Max(20) final int size
    ) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "postDate"));
        Page<Feed> feedsPage = feedService.getAllByUserId(id, pageable);
        Page<FeedDto> feedDtoPage = feedsPage.map(feedMapper::toDto);

        return ResponseEntity.ok(feedDtoPage);
    }
    @GetMapping("/group/{id}")
    @Operation(summary = "Get all  feeds by Group ID")
    public ResponseEntity<Page<FeedDto>> getFeedsByGroupId(
            @PathVariable final Long id,
            @RequestParam(defaultValue = "0") final int page,
            @RequestParam(defaultValue = "10") @Max(20) final int size
    ) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "postDate"));
        Page<Feed> feedsPage = feedService.findFeedsByGroupId(id, pageable);
        Page<FeedDto> feedDtoPage = feedsPage.map(feedMapper::toDto);
        return ResponseEntity.ok(feedDtoPage);
    }
    @GetMapping("/friends")
    @Operation(summary = "Get all friends feeds")
    public Page<FeedDto>  findAllFeedsByListOfUserIds(
            @RequestParam(defaultValue = "0") final int page,
            @RequestParam(defaultValue = "10") @Max(20) final int size
    ) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "postDate"));
         //Testing data
        Page<Feed> feedsPage  = feedService
                .findAllFeedsByListOfUserIds(pageable);
        if (page >= feedsPage.getTotalPages()) {
            return feedsPage.map(feedMapper::toDto);
        }
        if (feedsPage.isEmpty()) {
            feedsPage = feedService
                    .findTopPostsByLikesAndGroupIdIsNull(pageable);
        }

        return feedsPage.map(feedMapper::toDto);
    }
    @PostMapping("/users/{id}/feeds")
    @Operation(summary = "Create feed for user ID")
    @PreAuthorize("@customSecurityExpression.canAccessUser(#id)")
    public FeedDto createFeed(
            @PathVariable final Long id,
            @RequestPart(name = "text", required = false)
            final String text,
            @RequestPart(name = "file", required = false)
            final MultipartFile[] files

    ) {

        Feed createdFeed = feedService
                .createWithImages(text, id, files, null);
//        kafkaTemplate.send(topicName, String.format(
//                "User %d created a new feed %d", id, createdFeed.getId()));
        return feedMapper.toDto(createdFeed);
    }
    @PostMapping("/{id}/image")
    @Operation(summary = "Upload image to feed. Id of feed")
    @PreAuthorize("@customSecurityExpression.canAccessUser(#id)")
    public void uploadImage(
            @PathVariable final Long id,
            @Validated  final FeedImageDto imageDto
    ) {
        FeedImage image = feedImageMapper.toEntity(imageDto);
        feedService.uploadImage(id, image);
//        kafkaTemplate.send(topicName, String.format(
//                "User %d uploaded a new image %s",
//                id, image.getFile().getOriginalFilename()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get FeedDto by id")
    public FeedDto getById(
            @PathVariable final Long id
    ) {
        Feed task = feedService.getById(id);
        return feedMapper.toDto(task);
    }
    @PutMapping
    @Operation(summary = "Update feed")
    @PreAuthorize("@customSecurityExpression.canAccessMethod(#dto.id)")
    public FeedDto update(
            @Validated(OnUpdate.class)
            @RequestBody final FeedDto dto
    ) {
        Feed feed = feedMapper.toEntity(dto);
        Feed updatedTask = feedService.update(feed);
//        kafkaTemplate.send(topicName,
//                "Feed updated: " + updatedTask.getContent());
        return feedMapper.toDto(updatedTask);
    }
    @Operation(summary = "Create feed fo user ID and GroupId")
    @PostMapping("/users/{id}/group/{groupId}")
    @PreAuthorize("@customSecurityExpression.canAccessUser(#id)")
    public FeedDto createWithImagesGroupFeed(
            @PathVariable final Long id,
            @PathVariable final Long groupId,
            @RequestPart(name = "text", required = true)
            final String text,
            @RequestPart(name = "file", required = false)
            final MultipartFile[] files
    ) {
        Feed createdFeed = feedService
                .createWithImages(text, id, files, groupId);
//        kafkaTemplate.send(topicName, String.format(
//                "User %d created a new feed %d in group %d",
//                id, createdFeed.getId(), groupId));
        return feedMapper.toDto(createdFeed);
    }
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete feed")
    @PreAuthorize("@customSecurityExpression.canAccessMethod(#id)")
    public void deleteById(
            @PathVariable  final Long id
    ) {
        feedService.delete(id);
    }
}
