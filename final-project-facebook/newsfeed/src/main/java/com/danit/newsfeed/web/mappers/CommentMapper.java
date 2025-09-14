package com.danit.newsfeed.web.mappers;

import com.danit.newsfeed.domain.comment.Comment;

import com.danit.newsfeed.web.dto.comment.CommentDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface CommentMapper extends Mappable<Comment, CommentDto> {
    @Mapping(target = "feedId", source = "feed.id")
    CommentDto toDto(Comment entity);

    @Mapping(target = "feed.id", source = "feedId")
    Comment toEntity(CommentDto dto);

}
