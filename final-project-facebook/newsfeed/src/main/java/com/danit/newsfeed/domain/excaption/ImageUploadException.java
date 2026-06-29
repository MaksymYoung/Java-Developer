package com.danit.newsfeed.domain.excaption;

public class ImageUploadException extends RuntimeException {
    public ImageUploadException(
            final String message
    ) {
        super(message);
    }
}
