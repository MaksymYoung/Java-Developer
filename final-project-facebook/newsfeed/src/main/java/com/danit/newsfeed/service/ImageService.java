package com.danit.newsfeed.service;

import com.danit.newsfeed.domain.feed.FeedImage;

public interface ImageService {
    String upload(
            FeedImage image
    );
    void delete(
            String objectName
    );
}
