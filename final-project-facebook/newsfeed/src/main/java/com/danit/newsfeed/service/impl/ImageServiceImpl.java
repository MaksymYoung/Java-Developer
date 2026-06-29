package com.danit.newsfeed.service.impl;

import com.danit.newsfeed.domain.excaption.ImageUploadException;
import com.danit.newsfeed.domain.feed.FeedImage;
import com.danit.newsfeed.service.ImageService;
import com.danit.newsfeed.service.props.MinioProperties;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final MinioClient minioClient;
    private final MinioProperties minioProperties;

    @Override
    public String upload(
            final FeedImage image
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
        InputStream inputStream;
        try {
            inputStream = file.getInputStream();
        } catch (Exception e) {
            throw new ImageUploadException("Image upload failed: "
                    + e.getMessage());
        }
        saveImage(inputStream, fileName);
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

    private String getExtension(
            final MultipartFile file
    ) {
        return file.getOriginalFilename()
                .substring(file.getOriginalFilename()
                        .lastIndexOf(".") + 1);
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
