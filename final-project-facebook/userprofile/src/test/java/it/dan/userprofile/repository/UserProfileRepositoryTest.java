package it.dan.userprofile.repository;

import it.dan.userprofile.entity.UserProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("local")
class UserProfileRepositoryTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserProfileRepositoryTest userProfileRepositoryTest;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testFindByNickname() {
        UserProfile userProfile = new UserProfile();
        userProfile.setNickname("testNickname");
        Page<UserProfile> page = new PageImpl<>(List.of(userProfile));

        when(userProfileRepository.findByNickname(anyString(), any(Pageable.class)))
                .thenReturn(page);

        Page<UserProfile> result = userProfileRepository.findByNickname("test", Pageable.unpaged());

        assertEquals(1, result.getTotalElements());
        assertEquals("testNickname", result.getContent().get(0).getNickname());
    }

    @Test
    @Transactional
    void testAddImage() {
        doNothing().when(userProfileRepository).addImage(anyLong(), anyString());

        userProfileRepository.addImage(1L, "image.png");

        verify(userProfileRepository, times(1)).addImage(anyLong(), anyString());
    }

    @Test
    @Transactional
    void testDeleteImage() {
        doNothing().when(userProfileRepository).deleteImage(anyLong(), anyString());

        userProfileRepository.deleteImage(1L, "image.png");

        verify(userProfileRepository, times(1)).deleteImage(anyLong(), anyString());
    }

    @Test
    @Transactional
    void testDeleteAvatar() {
        doNothing().when(userProfileRepository).deleteAvatar(anyLong());

        userProfileRepository.deleteAvatar(1L);

        verify(userProfileRepository, times(1)).deleteAvatar(anyLong());
    }

    @Test
    @Transactional
    void testDeleteCover() {
        doNothing().when(userProfileRepository).deleteCover(anyLong());

        userProfileRepository.deleteCover(1L);

        verify(userProfileRepository, times(1)).deleteCover(anyLong());
    }

    @Test
    void testGetImageByUserId() {
        when(userProfileRepository.getImageByUserId(anyLong(), anyString()))
                .thenReturn(Optional.of("image.png"));

        Optional<String> result = userProfileRepository.getImageByUserId(1L, "image.png");

        assertTrue(result.isPresent());
        assertEquals("image.png", result.get());
    }

    @Test
    void testGetAvatarByUserId() {
        when(userProfileRepository.getAvatarByUserId(anyLong()))
                .thenReturn(Optional.of("avatar.png"));

        Optional<String> result = userProfileRepository.getAvatarByUserId(1L);

        assertTrue(result.isPresent());
        assertEquals("avatar.png", result.get());
    }

    @Test
    void testGetCoverByUserId() {
        when(userProfileRepository.getCoverByUserId(anyLong()))
                .thenReturn(Optional.of("cover.png"));

        Optional<String> result = userProfileRepository.getCoverByUserId(1L);

        assertTrue(result.isPresent());
        assertEquals("cover.png", result.get());
    }

    @Test
    void testGetAllImagesByUserId() {
        Page<String> page = new PageImpl<>(List.of("image1.png", "image2.png"));

        when(userProfileRepository.getAllImagesByUserId(anyLong(), any(Pageable.class)))
                .thenReturn(page);

        Page<String> result = userProfileRepository.getAllImagesByUserId(1L, Pageable.unpaged());

        assertEquals(2, result.getTotalElements());
        assertTrue(result.getContent().contains("image1.png"));
        assertTrue(result.getContent().contains("image2.png"));
    }

    @Test
    void testFindByUserId() {
        UserProfile userProfile = new UserProfile();
        userProfile.setId(1L);

        when(userProfileRepository.findByUserId(anyLong()))
                .thenReturn(Optional.of(userProfile));

        Optional<UserProfile> result = userProfileRepository.findByUserId(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testDeleteByUserId() {
        doNothing().when(userProfileRepository).deleteByUserId(anyLong());

        userProfileRepository.deleteByUserId(1L);

        verify(userProfileRepository, times(1)).deleteByUserId(anyLong());
    }
}
