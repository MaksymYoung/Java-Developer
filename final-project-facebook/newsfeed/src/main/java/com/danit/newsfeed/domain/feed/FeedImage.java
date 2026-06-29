package com.danit.newsfeed.domain.feed;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class FeedImage {
    private MultipartFile file;

}
