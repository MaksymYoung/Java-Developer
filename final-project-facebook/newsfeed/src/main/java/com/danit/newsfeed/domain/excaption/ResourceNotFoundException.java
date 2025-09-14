package com.danit.newsfeed.domain.excaption;

public class ResourceNotFoundException extends RuntimeException  {
    public ResourceNotFoundException(
            final String message
    ) {
        super(message);
    }
}
