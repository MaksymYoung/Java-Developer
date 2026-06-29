package it.dan.userprofile.service;

import it.dan.userprofile.entity.UserImage;

public interface ImageService {

    String upload(
            UserImage image
    );

    String uploadAvatar(
            Long userId, UserImage image
    );

    String uploadCover(
            Long userId, UserImage image
    );

    void deleteAvatarByUserId(
            Long userId
    );

    void deleteCoverByUserId(
            Long userId
    );

    void delete(
            String objectName
    );
}
