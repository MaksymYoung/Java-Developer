package it.dan.userprofile.service;

import io.minio.*;
import it.dan.userprofile.entity.UserImage;
import it.dan.userprofile.exception.ImageUploadException;
import it.dan.userprofile.utility.MinioProperties;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ActiveProfiles("local")
class ImageServiceImplTest {

    @Mock
    private MinioClient minioClient;

    @Mock
    private MinioProperties minioProperties;

    @InjectMocks
    private ImageServiceImpl imageService;

    private UserImage testImage;
    private MultipartFile multipartFile;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        multipartFile = mock(MultipartFile.class);
        testImage = new UserImage();
        testImage.setFile(multipartFile);
        when(minioProperties.getBucket()).thenReturn("test-bucket");
    }

    @Test
    void upload_successful() throws Exception {
        // Arrange
        String fileName = UUID.randomUUID() + ".jpg";
        when(multipartFile.getOriginalFilename()).thenReturn("test.jpg");
        when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        when(multipartFile.getSize()).thenReturn(0L);
        when(multipartFile.getContentType()).thenReturn("image/jpeg");

        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(false);
        doNothing().when(minioClient).makeBucket(any(MakeBucketArgs.class));
        doNothing().when(minioClient).setBucketPolicy(any(SetBucketPolicyArgs.class));

        // Act
        String resultFileName = imageService.upload(testImage);

        // Assert
        assertNotNull(resultFileName);
        assertTrue(resultFileName.endsWith(".jpg"));
        verify(minioClient).putObject(any(PutObjectArgs.class));
    }

    @Test
    void upload_fail_when_no_file_name() throws Exception {
        // Arrange
        when(multipartFile.getOriginalFilename()).thenReturn(null);

        // Act & Assert
        ImageUploadException thrown = assertThrows(ImageUploadException.class, () -> imageService.upload(testImage));
        assertEquals("Image must have name.", thrown.getMessage());
    }

    @Test
    void upload_fail_when_input_stream_cannot_be_opened() throws Exception {
        // Arrange
        when(multipartFile.getOriginalFilename()).thenReturn("test.jpg");
        when(multipartFile.getInputStream()).thenThrow(new RuntimeException("Input stream error"));

        // Act & Assert
        ImageUploadException thrown = assertThrows(ImageUploadException.class, () -> imageService.upload(testImage));
        assertEquals("Image upload failed: Input stream error", thrown.getMessage());
    }

    @SneakyThrows
    @Test
    void delete_successful() {
        // Act
        imageService.delete("path/to/image.jpg");

        // Assert
        verify(minioClient).removeObject(any(RemoveObjectArgs.class));
    }

    @Test
    void upload_fail_on_bucket_creation() throws Exception {
        // Arrange
        when(multipartFile.getOriginalFilename()).thenReturn("test.jpg");
        when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
        when(multipartFile.getSize()).thenReturn(0L);
        when(multipartFile.getContentType()).thenReturn("image/jpeg");

        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenThrow(new RuntimeException("Bucket error"));

        // Act & Assert
        ImageUploadException thrown = assertThrows(ImageUploadException.class, () -> imageService.upload(testImage));
        assertEquals("Image upload failed: Bucket error", thrown.getMessage());
    }
}
