package org.example.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Schema(description = "Group Image DTO")
public class GroupImageDto {
    @NotNull(message = "Image mustn't be empty")
    private MultipartFile file;
}
