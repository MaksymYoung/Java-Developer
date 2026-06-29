package org.example.service;

import org.example.domain.GroupImage;

public interface ImageService {
    String upload(
            GroupImage image
    );
    void delete(
            String objectName
    );
}
