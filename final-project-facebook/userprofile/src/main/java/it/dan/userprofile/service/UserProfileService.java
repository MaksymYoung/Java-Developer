package it.dan.userprofile.service;

import it.dan.userprofile.entity.UserImage;
import it.dan.userprofile.entity.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserProfileService {
	Optional<UserProfile> getByUserId(Long userId);
	Page<UserProfile> getByNickname(String searchString, Pageable pageable);
	UserProfile update(Long userId, UserProfile profile);
	void delete(Long userId);
	Page<UserProfile> getAll(Pageable pageable);

	UserProfile createOrUpdate(
			Long userId,
			UserProfile profile);

	UserProfile create(
			Long userId);

	String uploadImage(Long userId, UserImage image);
	String uploadAvatar(Long userId, UserImage image);
	String uploadCover(Long userId, UserImage image);

	void deleteImage(Long userId, String fileName);
    void deleteAvatar(Long userId);
	void deleteCover(Long userId);

	Optional<String> getImageByUserId(Long userId, String fileName);
	Optional<String> getAvatarByUserId(Long userId);
	Optional<String> getCoverByUserId(Long userId);
	Page<String> getAllImagesByUserId(Long userId, Pageable pageable);
}
