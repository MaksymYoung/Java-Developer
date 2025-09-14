package com.danit.newsfeed.web.dto.comment;

import com.danit.newsfeed.web.dto.validation.OnUpdate;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "Comment DTO")
public class CommentDto {
    @NotNull(
            message = "Id must be not null.",
            groups = OnUpdate.class
    )
    private Long id;

    @NotNull(
            message = "Feed Id must be not null."
    )
    @Schema(description = "Feed ID", example = "1")
    private Long feedId;

    @NotNull(
            message = "User Id must be not null."
    )
    @Schema(description = "User ID", example = "1")
    private Long userId;

    @NotNull(
            message = "Comment text must be not null."
    )
    @Schema(
            description = "Comment text",
            example = "This is a comment"
    )
    private String comment;

    @DateTimeFormat(
            iso = DateTimeFormat.ISO.TIME
    )
    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm"
    )
    @JsonProperty(
            access = JsonProperty.Access.READ_ONLY
    )
    @Schema(description = "Creation timestamp", example = "2024-07-10 12:34")
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Number of likes", example = "5")
    private Long likesCount;
}
