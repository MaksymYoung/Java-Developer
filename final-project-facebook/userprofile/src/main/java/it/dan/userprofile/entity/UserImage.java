package it.dan.userprofile.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UserImage {
    private MultipartFile file;
}
