package com.danit.newsfeed.web.dto.feed;

import com.danit.newsfeed.web.dto.comment.CommentDto;
import com.danit.newsfeed.web.dto.validation.OnCreate;
import com.danit.newsfeed.web.dto.validation.OnCreateWithGroup;
import com.danit.newsfeed.web.dto.validation.OnUpdate;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Schema(description = "Feed DTO")
public class FeedDto {
    @NotNull(
            message = "Id must be not null.",
            groups = OnUpdate.class
    )
    private Long id;


    @Schema(
            description = "max 500 symbols",
            example = "Some text"
    )
    @Length(
            max = 500,
            message = "Description length must be smaller than 500 symbols.",
            groups = {OnCreate.class, OnUpdate.class}
    )
    private String content;

    @NotNull(
            message = "Group Id must be not null.",
            groups = OnCreateWithGroup.class
    )
    @Positive(
            message = "Group Id must be a positive number.",
            groups = {OnCreate.class, OnUpdate.class, OnCreateWithGroup.class}
    )
    private Long groupId;
    @DateTimeFormat(
            iso = DateTimeFormat.ISO.TIME
    )
    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm"
    )
    @JsonProperty(
            access = JsonProperty.Access.READ_ONLY
    )
    private LocalDateTime postDate;

    @JsonProperty(
            access = JsonProperty.Access.READ_ONLY
    )
    private List<String> images;
    private Long userId;
    @JsonProperty(
            access = JsonProperty.Access.READ_ONLY
    )
    private Long likesCount;
    @JsonProperty(
            access = JsonProperty.Access.READ_ONLY
    )
    @JsonIgnore
    private List<CommentDto> comments;
}
