package it.dan.userprofile.service;

import io.minio.*;
import io.minio.messages.Item;
import it.dan.userprofile.entity.UserImage;
import it.dan.userprofile.exception.ImageUploadException;
import it.dan.userprofile.utility.MinioProperties;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Setter
@Slf4j
public class ImageServiceImpl implements ImageService {
    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    @Override
    public String upload(
            final UserImage image
    ) {
        try {
            createBucket();
        } catch (Exception e) {
            throw new ImageUploadException("Image upload failed: "
                    + e.getMessage());
        }
        MultipartFile file = image.getFile();
        if (file.isEmpty() || file.getOriginalFilename() == null) {
            throw new ImageUploadException("Image must have name.");
        }
        String fileName = generateFileName(file);
        try (InputStream inputStream = file.getInputStream()) {
            saveImage(inputStream, fileName);
        } catch (Exception e) {
            throw new ImageUploadException("Image upload failed: " + e.getMessage());
        }
        return fileName;
    }

    @Override
    public String uploadAvatar(
            final Long userId, final UserImage image
    ) {
        try {
            createBucket();
        } catch (Exception e) {
            throw new ImageUploadException("Image upload failed: "
                    + e.getMessage());
        }
        MultipartFile file = image.getFile();
        if (file.isEmpty() || file.getOriginalFilename() == null) {
            throw new ImageUploadException("Image must have name.");
        }
        String fileName = generateAvatarName(userId, file);
        try (InputStream inputStream = file.getInputStream()) {
            saveImage(inputStream, fileName);
        } catch (Exception e) {
            throw new ImageUploadException("Image upload failed: " + e.getMessage());
        }
        return fileName;
    }

    @Override
    public String uploadCover(
            final Long userId, final UserImage image
    ) {
        try {
            createBucket();
        } catch (Exception e) {
            throw new ImageUploadException("Image upload failed: "
                    + e.getMessage());
        }
        MultipartFile file = image.getFile();
        if (file.isEmpty() || file.getOriginalFilename() == null) {
            throw new ImageUploadException("Image must have name.");
        }
        String fileName = generateCoverName(userId, file);
        try (InputStream inputStream = file.getInputStream()) {
            saveImage(inputStream, fileName);
        } catch (Exception e) {
            throw new ImageUploadException("Image upload failed: " + e.getMessage());
        }
        return fileName;
    }

    @SneakyThrows
    private void createBucket() {
        boolean found = minioClient.bucketExists(BucketExistsArgs.builder()
                .bucket(minioProperties.getBucket())
                .build());
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs
                    .builder()
                    .bucket(minioProperties.getBucket())
                    .build());
            minioClient
                    .setBucketPolicy(SetBucketPolicyArgs
                            .builder()
                            .bucket(minioProperties.getBucket())
                            .config("{\"Version\":\"2012-10-17\""
                                    + ",\"Statement\":[{\"Effect\":\"Allow\""
                                    + ",\"Principal\":\"*\""
                                    + ",\"Action\":\"s3:GetObject\""
                                    + ",\"Resource\":\"arn:aws:s3:::"
                                    + minioProperties.getBucket() + "/*\"}]}")
                            .build());
        }
    }

    private String generateFileName(
            final MultipartFile file
    ) {
        String extension = getExtension(file);
        return UUID.randomUUID() + "." + extension;
    }

    private String generateAvatarName(
            final Long userId, final MultipartFile file
    ) {
        String extension = getExtension(file);
        return "avatar" + userId + "_" + UUID.randomUUID() + "." + extension;
    }

    private String generateCoverName(
            final Long userId, final MultipartFile file
    ) {
        String extension = getExtension(file);
        return "cover" + userId + "_" + UUID.randomUUID() + "." + extension;
    }

    private String getExtension(
            final MultipartFile file
    ) {
        return file.getOriginalFilename()
                .substring(file.getOriginalFilename()
                        .lastIndexOf(".") + 1);
    }

    @SneakyThrows
    @Override
    public void deleteAvatarByUserId(final Long userId) {
        ListObjectsArgs listObjectsArgs = ListObjectsArgs.builder()
                .bucket(minioProperties.getBucket())
                .prefix("avatar" + userId + "_")
                .build();

        Iterable<Result<Item>> items = minioClient.listObjects(listObjectsArgs);

        for (Result<Item> result : items) {
            Item item = result.get();
            String objectName = item.objectName();
            RemoveObjectArgs rArgs = RemoveObjectArgs.builder()
                    .bucket(minioProperties.getBucket())
                    .object(objectName)
                    .build();
            minioClient.removeObject(rArgs);
            log.info("Deleted avatar: {}", objectName);
        }
    }

    @SneakyThrows
    @Override
    public void deleteCoverByUserId(final Long userId) {
        ListObjectsArgs listObjectsArgs = ListObjectsArgs.builder()
                .bucket(minioProperties.getBucket())
                .prefix("cover" + userId + "_")
                .build();

        Iterable<Result<Item>> items = minioClient.listObjects(listObjectsArgs);

        for (Result<Item> result : items) {
            Item item = result.get();
            String objectName = item.objectName();
            RemoveObjectArgs rArgs = RemoveObjectArgs.builder()
                    .bucket(minioProperties.getBucket())
                    .object(objectName)
                    .build();
            minioClient.removeObject(rArgs);
            log.info("Deleted cover: {}", objectName);
        }
    }

    @SneakyThrows
    @Override
    public void delete(final String objectName) {
        String objectNormName = objectName
                .substring(objectName
                        .lastIndexOf('/') + 1);
        RemoveObjectArgs rArgs = RemoveObjectArgs
                .builder()
                .bucket(minioProperties.getBucket())
                .object(objectNormName)
                .build();
        minioClient.removeObject(rArgs);
    }

    @SneakyThrows
    private void saveImage(
            final InputStream inputStream,
            final String fileName
    ) {
        minioClient.putObject(PutObjectArgs.builder()
                .stream(inputStream, inputStream.available(), -1)
                .bucket(minioProperties.getBucket())
                .object(fileName)
                .build());
    }
}
