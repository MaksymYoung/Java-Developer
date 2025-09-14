package com.danit.newsfeed.web.mappers;

import com.danit.newsfeed.domain.feed.FeedImage;
import com.danit.newsfeed.web.dto.feed.FeedImageDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FeedImageMapper extends  Mappable<FeedImage, FeedImageDto> {
}
