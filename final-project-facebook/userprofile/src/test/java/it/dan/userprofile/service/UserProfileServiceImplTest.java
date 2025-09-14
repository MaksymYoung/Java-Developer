package it.dan.userprofile.service;

import it.dan.userprofile.entity.UserImage;
import it.dan.userprofile.entity.UserProfile;
import it.dan.userprofile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ActiveProfiles("local")
class UserProfileServiceImplTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private UserProfileServiceImpl userProfileService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getByUserId() {
        Long userId = 1L;
        UserProfile userProfile = new UserProfile();
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(userProfile));

        Optional<UserProfile> result = userProfileService.getByUserId(userId);

        assertTrue(result.isPresent());
        assertEquals(userProfile, result.get());
        verify(userProfileRepository, times(1)).findByUserId(userId);
    }

    @Test
    void getByNickname() {
        String searchString = "nickname";
        Pageable pageable = Pageable.unpaged();
        Page<UserProfile> expectedPage = new PageImpl<>(Collections.emptyList());
        when(userProfileRepository.findByNickname(searchString, pageable)).thenReturn(expectedPage);

        Page<UserProfile> result = userProfileService.getByNickname(searchString, pageable);

        assertEquals(expectedPage, result);
        verify(userProfileRepository, times(1)).findByNickname(searchString, pageable);
    }

    @Test
    void update() {
        Long userId = 1L;
        UserProfile profile = new UserProfile();
        UserProfile existingProfile = new UserProfile();
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(existingProfile));

        UserProfile result = userProfileService.update(userId, profile);

        assertEquals(existingProfile, result);
        verify(userProfileRepository, times(1)).findByUserId(userId);
    }

    @Test
    void delete() {
        Long userId = 1L;
        UserProfile existingProfile = new UserProfile();
        existingProfile.setImages(Collections.singletonList("image1"));
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(existingProfile));

        userProfileService.delete(userId);

        verify(userProfileRepository, times(1)).deleteByUserId(userId);
        verify(imageService, times(1)).delete("image1");
    }

    @Test
    void getAll() {
        Pageable pageable = Pageable.unpaged();
        Page<UserProfile> expectedPage = new PageImpl<>(Collections.emptyList());
        when(userProfileRepository.findAll(pageable)).thenReturn(expectedPage);

        Page<UserProfile> result = userProfileService.getAll(pageable);

        assertEquals(expectedPage, result);
        verify(userProfileRepository, times(1)).findAll(pageable);
    }

    @Test
    void createOrUpdate_existingProfile() {
        Long userId = 1L;
        UserProfile profile = new UserProfile();
        UserProfile existingProfile = new UserProfile();

        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(existingProfile));
        when(userProfileRepository.save(existingProfile)).thenReturn(existingProfile);

        UserProfile result = userProfileService.createOrUpdate(userId, profile);

        assertEquals(existingProfile, result);
        verify(userProfileRepository, times(1)).findByUserId(userId);
        verify(userProfileRepository, times(1)).save(existingProfile);
    }


    @Test
    void createOrUpdate_newProfile() {
        Long userId = 1L;
        UserProfile profile = new UserProfile();
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(userProfileRepository.save(profile)).thenReturn(profile);

        UserProfile result = userProfileService.createOrUpdate(userId, profile);

        assertEquals(profile, result);
        verify(userProfileRepository, times(1)).save(profile);
    }


    @Test
    void uploadImage() {
        Long userId = 1L;
        UserImage image = new UserImage();
        String fileName = "fileName.jpg";
        when(imageService.upload(image)).thenReturn(fileName);

        String result = userProfileService.uploadImage(userId, image);

        assertEquals("/userprofile/" + fileName, result);
        verify(userProfileRepository, times(1)).addImage(
                userId, "/userprofile/" + fileName);
    }

    @Test
    void uploadAvatar() {
        Long userId = 1L;
        UserImage image = new UserImage();
        MultipartFile file = mock(MultipartFile.class);

        String fileName = "avatar.jpg";
        String savedFileName = "/userprofile/" + fileName;

        when(file.getOriginalFilename()).thenReturn(fileName);
        when(file.isEmpty()).thenReturn(false);
        image.setFile(file);

        when(imageService.uploadAvatar(userId, image)).thenReturn(fileName);

        String result = userProfileService.uploadAvatar(userId, image);

        assertEquals(savedFileName, result);
        verify(userProfileRepository, times(1)).addImage(userId, savedFileName);
        verify(imageService, times(1)).uploadAvatar(userId, image);
    }

    @Test
    void uploadCover() {
        Long userId = 1L;
        UserImage image = new UserImage();
        MultipartFile file = mock(MultipartFile.class);

        String fileName = "avatar.jpg";
        String savedFileName = "/userprofile/" + fileName;

        when(file.getOriginalFilename()).thenReturn(fileName);
        when(file.isEmpty()).thenReturn(false);
        image.setFile(file);

        when(imageService.uploadCover(userId, image)).thenReturn(fileName);

        String result = userProfileService.uploadCover(userId, image);

        assertEquals(savedFileName, result);
        verify(userProfileRepository, times(1)).addImage(userId, savedFileName);
        verify(imageService, times(1)).uploadCover(userId, image);
    }

    @Test
    void deleteImage() {
        Long userId = 1L;
        String fileName = "image.jpg";
        when(userProfileRepository.getImageByUserId(userId, fileName)).thenReturn(Optional.of(fileName));

        userProfileService.deleteImage(userId, fileName);

        verify(imageService, times(1)).delete(fileName);
        verify(userProfileRepository, times(1)).deleteImage(userId, fileName);
    }

    @Test
    void deleteAvatar() {
        Long userId = 1L;
        String avatar = "avatar.jpg";
        when(userProfileRepository.getAvatarByUserId(userId)).thenReturn(Optional.of(avatar));

        userProfileService.deleteAvatar(userId);

        verify(imageService, times(1)).deleteAvatarByUserId(userId);
        verify(userProfileRepository, times(1)).deleteAvatar(userId);
    }

    @Test
    void deleteCover() {
        Long userId = 1L;
        String cover = "cover.jpg";
        when(userProfileRepository.getCoverByUserId(userId)).thenReturn(Optional.of(cover));

        userProfileService.deleteCover(userId);

        verify(imageService, times(1)).deleteCoverByUserId(userId);
        verify(userProfileRepository, times(1)).deleteCover(userId);
    }

    @Test
    void getImageByUserId() {
        Long userId = 1L;
        String fileName = "image.jpg";
        when(userProfileRepository.getImageByUserId(userId, fileName)).thenReturn(Optional.of(fileName));

        Optional<String> result = userProfileService.getImageByUserId(userId, fileName);

        assertTrue(result.isPresent());
        assertEquals(fileName, result.get());
        verify(userProfileRepository, times(1)).getImageByUserId(userId, fileName);
    }

    @Test
    void getAvatarByUserId() {
        Long userId = 1L;
        String avatar = "avatar.jpg";
        when(userProfileRepository.getAvatarByUserId(userId)).thenReturn(Optional.of(avatar));

        Optional<String> result = userProfileService.getAvatarByUserId(userId);

        assertTrue(result.isPresent());
        assertEquals(avatar, result.get());
        verify(userProfileRepository, times(1)).getAvatarByUserId(userId);
    }

    @Test
    void getCoverByUserId() {
        Long userId = 1L;
        String cover = "cover.jpg";
        when(userProfileRepository.getCoverByUserId(userId)).thenReturn(Optional.of(cover));

        Optional<String> result = userProfileService.getCoverByUserId(userId);

        assertTrue(result.isPresent());
        assertEquals(cover, result.get());
        verify(userProfileRepository, times(1)).getCoverByUserId(userId);
    }

    @Test
    void getAllImagesByUserId() {
        Long userId = 1L;
        Pageable pageable = Pageable.unpaged();
        Page<String> expectedPage = new PageImpl<>(Collections.emptyList());
        when(userProfileRepository.getAllImagesByUserId(userId, pageable)).thenReturn(expectedPage);

        Page<String> result = userProfileService.getAllImagesByUserId(userId, pageable);

        assertEquals(expectedPage, result);
        verify(userProfileRepository, times(1)).getAllImagesByUserId(userId, pageable);
    }
}
