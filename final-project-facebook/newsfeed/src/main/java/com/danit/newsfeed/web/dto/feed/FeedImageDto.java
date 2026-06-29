package com.danit.newsfeed.web.dto.feed;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Schema(description = "Feed Image DTO")
public class FeedImageDto {
    @NotNull(
            message = "Image must be not null."
    )
    private MultipartFile file;
}
