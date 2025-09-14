package it.dan.userprofile.service;

import it.dan.userprofile.entity.UserImage;
import it.dan.userprofile.entity.UserProfile;
import it.dan.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Transactional
@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final ImageService imageService;

    @Override
    @Transactional(readOnly = true)
    public Optional<UserProfile> getByUserId(Long userId) {
        return userProfileRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfile> getByNickname(String searchString, Pageable pageable) {
        return userProfileRepository.findByNickname(searchString, pageable);
    }

    private UserProfile populateUserProfile(
            UserProfile userProfile,
            UserProfile profile) {
        userProfile.setNickname(profile.getNickname());
        userProfile.setCompany(profile.getCompany());
        userProfile.setInterests(profile.getInterests());
        userProfile.setCountry(profile.getCountry());
        userProfile.setState(profile.getState());
        userProfile.setCity(profile.getCity());
        userProfile.setAddress(profile.getAddress());
        userProfile.setApartment(profile.getApartment());
        userProfile.setPostcode(profile.getPostcode());
        userProfile.setLinkedin(profile.getLinkedin());
        userProfile.setTelegram(profile.getTelegram());
        userProfile.setViber(profile.getViber());
        return userProfile;
    }

    @Override
    public UserProfile update(Long userId, UserProfile profile) {
        Optional<UserProfile> optionalUser = userProfileRepository.findByUserId(userId);
        UserProfile user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            return populateUserProfile(user, profile);
        } else {
            return new UserProfile();
        }
    }

    @Override
    public void delete(final Long userId) {
        Optional<UserProfile> optionalUser = userProfileRepository.findByUserId(userId);
        if (optionalUser.isPresent()) {
            Page<String> allImages = getAllImagesByUserId(userId, Pageable.unpaged());
            allImages.forEach(imageService::delete);
        }
        userProfileRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfile> getAll(Pageable pageable) {
        return userProfileRepository.findAll(pageable);
    }

    @Override
    public UserProfile createOrUpdate(
            final Long userId,
            final UserProfile profile) {

        Optional<UserProfile> existingProfile = userProfileRepository.findByUserId(userId);
        UserProfile userProfile;

        if (existingProfile.isPresent()) {
            userProfile = existingProfile.get();
            populateUserProfile(userProfile, profile);
            userProfile.setLastModifiedDate(LocalDateTime.now());
        } else {
            profile.setUserId(userId);
            profile.setCreationDate(LocalDateTime.now());
            profile.setLastModifiedDate(LocalDateTime.now());
            userProfile = profile;
        }

        return userProfileRepository.save(userProfile);
    }

    @Override
    public UserProfile create(final Long userId) {

        Optional<UserProfile> existingProfile = userProfileRepository.findByUserId(userId);
        UserProfile userProfile = new UserProfile();

        if (existingProfile.isEmpty()) {
            userProfile.setUserId(userId);
            userProfile.setCreationDate(LocalDateTime.now());
            userProfile.setLastModifiedDate(LocalDateTime.now());
        }

        return userProfileRepository.save(userProfile);
    }

    @Override
    @Transactional
    public String uploadImage(final Long userId, final UserImage image) {
        String fileName = "/userprofile/" + imageService.upload(image);
        userProfileRepository.addImage(userId, fileName);
        return fileName;
    }

    @Override
    @Transactional
    public String uploadAvatar(final Long userId, final UserImage image) {
        deleteAvatar(userId);
        String fileName = "/userprofile/" + imageService.uploadAvatar(userId, image);
        if (fileName != null) {
            userProfileRepository.addImage(userId, fileName);
        }
        return fileName;
    }

    @Override
    public void deleteAvatar(final Long userId) {
        Optional<String> avatar = getAvatarByUserId(userId);
        if (avatar.isPresent()) {
            imageService.deleteAvatarByUserId(userId);
            userProfileRepository.deleteAvatar(userId);
        }
    }

    @Override
    @Transactional
    public String uploadCover(final Long userId, final UserImage image) {
        deleteCover(userId);
        String fileName = "/userprofile/" + imageService.uploadCover(userId, image);
        if (fileName != null) {
            userProfileRepository.addImage(userId, fileName);
        }
        return fileName;
    }

    @Override
    public void deleteCover(final Long userId) {
        Optional<String> cover = getCoverByUserId(userId);
        if (cover.isPresent()) {
            imageService.deleteCoverByUserId(userId);
            userProfileRepository.deleteCover(userId);
        }
    }

    @Override
    public void deleteImage(final Long userId, final String fileName) {
        Optional<String> image = getImageByUserId(userId, fileName);
        imageService.delete(image.get());
        userProfileRepository.deleteImage(userId, fileName);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getImageByUserId(final Long userId, final String fileName) {
        return userProfileRepository.getImageByUserId(userId, fileName);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getAvatarByUserId(final Long userId) {
        return userProfileRepository.getAvatarByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<String> getCoverByUserId(final Long userId) {
        return userProfileRepository.getCoverByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<String> getAllImagesByUserId(final Long userId, Pageable pageable) {
        return userProfileRepository.getAllImagesByUserId(userId, pageable);
    }
}
