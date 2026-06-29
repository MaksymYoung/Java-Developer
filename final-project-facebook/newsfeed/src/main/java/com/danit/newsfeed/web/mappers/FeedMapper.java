package com.danit.newsfeed.web.mappers;

import com.danit.newsfeed.domain.feed.Feed;
import com.danit.newsfeed.web.dto.feed.FeedDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FeedMapper extends Mappable<Feed, FeedDto> {
}
