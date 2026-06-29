package it.dan.userprofile.dto.image;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Schema(description = "User Image DTO")
public class UserImageDto {
    @NotNull(message = "Image must be not null")
    private MultipartFile file;
}
