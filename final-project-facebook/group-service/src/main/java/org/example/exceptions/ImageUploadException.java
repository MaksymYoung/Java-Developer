package org.example.exceptions;

public class ImageUploadException extends RuntimeException {
    public ImageUploadException(
            final String message
    ) {
        super(message);
    }
}
