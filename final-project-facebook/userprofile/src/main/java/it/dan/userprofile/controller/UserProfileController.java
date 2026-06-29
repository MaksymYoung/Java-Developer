package it.dan.userprofile.controller;

import it.dan.userprofile.dto.image.UserImageDto;
import it.dan.userprofile.dto.user.UserProfileDtoRequest;
import it.dan.userprofile.dto.user.UserProfileDtoResponse;
import it.dan.userprofile.entity.UserImage;
import it.dan.userprofile.entity.UserProfile;
import it.dan.userprofile.security.JwtTokenProvider;
import it.dan.userprofile.service.UserProfileService;
import it.dan.userprofile.service.mapper.UserImageMapper;
import it.dan.userprofile.service.mapper.UserProfileMapperRequest;
import it.dan.userprofile.service.mapper.UserProfileMapperResponse;
import it.dan.userprofile.utility.ResponseUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import it.dan.userprofile.exception.UserNotFoundException;
import it.dan.userprofile.exception.ImageNotFoundException;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/userprofile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserProfileMapperRequest userProfileMapperRequest;
    private final UserProfileMapperResponse userProfileMapperResponse;
    private final UserImageMapper userImageMapper;
    private final JwtTokenProvider jwtTokenProvider;

    Long getUserIdFromToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return jwtTokenProvider.getId(token);
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdate(
            @Valid @RequestPart(name = "user") UserProfileDtoRequest userDtoRequest,
            HttpServletRequest request
    ) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            UserProfile userProfile = userProfileMapperRequest.toEntity(userDtoRequest);
            UserProfile savedUserProfile = userProfileService.createOrUpdate(currentUserId, userProfile);
            UserProfileDtoResponse responseData = userProfileMapperResponse.toDto(savedUserProfile);

            return ResponseEntity.ok().body(Map.of("status", "success", "data", responseData));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/uploading/image")
    public ResponseEntity<?> uploadImage(
            @Valid final UserImageDto file,
            HttpServletRequest request
    ) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            Optional<UserProfile> userOptional = userProfileService.getByUserId(currentUserId);
            UserProfile userProfile;
            if (userOptional.isEmpty()) {
                userProfile = userProfileService.create(currentUserId);
            } else {
                userProfile = userOptional.get();
            }
            UserImage image = userImageMapper.toEntity(file);
            String fileName = userProfileService.uploadImage(userProfile.getUserId(), image);
            return ResponseEntity.ok().body(ResponseUtils.createResponse(
                    "success", fileName));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/uploading/avatar-image")
    public ResponseEntity<?> uploadAvatar(
            @Valid final UserImageDto file,
            HttpServletRequest request
    ) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            Optional<UserProfile> userOptional = userProfileService.getByUserId(currentUserId);
            UserProfile userProfile;
            if (userOptional.isEmpty()) {
                userProfile = userProfileService.create(currentUserId);
            } else {
                userProfile = userOptional.get();
            }

            UserImage image = userImageMapper.toEntity(file);
            String fileName = userProfileService.uploadAvatar(userProfile.getUserId(), image);

            return ResponseEntity.ok().body(ResponseUtils.createResponse("success", fileName));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/uploading/cover-image")
    public ResponseEntity<?> uploadCover(
            @Valid final UserImageDto file,
            HttpServletRequest request
    ) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            Optional<UserProfile> userOptional = userProfileService.getByUserId(currentUserId);
            UserProfile userProfile;
            if (userOptional.isEmpty()) {
                userProfile = userProfileService.create(currentUserId);
            } else {
                userProfile = userOptional.get();
            }

            UserImage image = userImageMapper.toEntity(file);
            String fileName = userProfileService.uploadCover(userProfile.getUserId(), image);

            return ResponseEntity.ok().body(ResponseUtils.createResponse("success", fileName));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/deleting/image")
    public ResponseEntity<?> deleteImage(
            @RequestParam final String fileName,
            HttpServletRequest request
    ) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            String image = userProfileService.getImageByUserId(currentUserId, fileName)
                    .orElseThrow(() -> new ImageNotFoundException(
                            String.format("Image %s of user with id %d not found", fileName, currentUserId)));

            userProfileService.deleteImage(currentUserId, fileName);
            return ResponseEntity.ok().body(ResponseUtils.createResponse("success",
                    String.format("User with id %d deleted a photo %s", currentUserId, fileName)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/deleting/avatar-image")
    public ResponseEntity<?> deleteAvatar(
            HttpServletRequest request
    ) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            String image = userProfileService.getAvatarByUserId(currentUserId)
                    .orElseThrow(() -> new ImageNotFoundException(
                            String.format("Avatar of user with id %d not found", currentUserId)));

            userProfileService.deleteAvatar(currentUserId);
            return ResponseEntity.ok().body(ResponseUtils.createResponse("success",
                    String.format("User with id %d deleted avatar", currentUserId)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/deleting/cover-image")
    public ResponseEntity<?> deleteCover(
            HttpServletRequest request
    ) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            String image = userProfileService.getCoverByUserId(currentUserId)
                    .orElseThrow(() -> new ImageNotFoundException(
                            String.format("Cover of user with id %d not found", currentUserId)));

            userProfileService.deleteCover(currentUserId);
            return ResponseEntity.ok().body(ResponseUtils.createResponse("success",
                    String.format("User with id %d deleted cover", currentUserId)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/updating")
    public ResponseEntity<?> update(
            @Valid @RequestBody UserProfileDtoRequest userDtoRequest,
            HttpServletRequest request) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            Optional<UserProfile> existingUserOptional = userProfileService.getByUserId(currentUserId);
            UserProfile userProfile = userProfileMapperRequest.toEntity(userDtoRequest);
            UserProfile existingUser;

            if (existingUserOptional.isPresent()) {
                existingUser = userProfileService.update(currentUserId, userProfile);
            } else {
                existingUser = userProfileService.create(currentUserId);
            }

            UserProfileDtoResponse responseData = userProfileMapperResponse.toDto(existingUser);
            return ResponseEntity.ok().body(ResponseUtils.createResponse(
                    "success",
                    String.format("User with id %d was updated", currentUserId),
                    responseData
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {

        Optional<UserProfile> existingProfile = userProfileService.getByUserId(userId);
        UserProfile userProfile;

        if (existingProfile.isPresent()) {
            userProfile = existingProfile.get();
        } else {
            userProfile = userProfileService.create(userId);
        }

        UserProfileDtoResponse responseData = userProfileMapperResponse.toDto(userProfile);
        return ResponseEntity.ok().body(ResponseUtils.createResponse(
                "success",
                String.format("User with id %d was got", userId),
                responseData
        ));
    }

    @GetMapping("/nickname")
    public ResponseEntity<?> searchUsersByNickname(
            @RequestParam(name = "query", defaultValue = "") String searchString,
            Pageable pageable) {

        Page<UserProfile> usersPage = userProfileService.getByNickname(searchString, pageable);

        List<UserProfileDtoResponse> responseData = usersPage.getContent()
                .stream()
                .map(userProfileMapperResponse::toDto)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", responseData);
        response.put("totalElements", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());
        response.put("currentPage", usersPage.getNumber());
        response.put("pageSize", usersPage.getSize());

        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/deleting")
    public ResponseEntity<?> delete(HttpServletRequest request) {
        Long currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            userProfileService.delete(currentUserId);
            return ResponseEntity.ok().body(ResponseUtils.createResponse("success",
                    String.format("User profile with id %d was deleted", currentUserId)));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<UserProfile> usersPage = userProfileService.getAll(pageable);

        List<UserProfileDtoResponse> responsePage = usersPage.getContent()
                .stream()
                .map(userProfileMapperResponse::toDto)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", responsePage);
        response.put("totalElements", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());
        response.put("currentPage", usersPage.getNumber());
        response.put("pageSize", usersPage.getSize());

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{userId}/getting/image")
    public ResponseEntity<?> getImageByUserId(
            @PathVariable Long userId,
            @RequestParam(name = "fileName") String fileName) {

        Optional<UserProfile> userOptional = userProfileService.getByUserId(userId);
        UserProfile userProfile;
        if (userOptional.isEmpty()) {
            userProfile = userProfileService.create(userId);
        } else {
            userProfile = userOptional.get();
        }

        String image = userProfileService.getImageByUserId(userProfile.getUserId(), fileName)
                .orElseThrow(() -> new ImageNotFoundException(
                        String.format("Image %s of user with id %d not found", fileName, userId)));

        return ResponseEntity.ok().body(ResponseUtils.createResponse(
                "success",
                String.format("Image for user with id %d was retrieved", userId),
                image
        ));
    }

    @GetMapping("/{userId}/getting/avatar-image")
    public ResponseEntity<?> getAvatarByUserId(
            @PathVariable Long userId) {

        Optional<UserProfile> userOptional = userProfileService.getByUserId(userId);
        UserProfile userProfile;
        if (userOptional.isEmpty()) {
            userProfile = userProfileService.create(userId);
        } else {
            userProfile = userOptional.get();
        }

        Optional<String> imageOpt = userProfileService.getAvatarByUserId(userProfile.getUserId());

        if (imageOpt.isEmpty()) {
            return ResponseEntity.ok().body(ResponseUtils.createResponse(
                    "no-avatar",
                    String.format("Avatar for user with id %d not found", userId)
            ));
        }

        return ResponseEntity.ok().body(ResponseUtils.createResponse(
                "success",
                String.format("Avatar for user with id %d was retrieved", userId),
                imageOpt.get()
        ));
    }

    @GetMapping("/{userId}/getting/cover-image")
    public ResponseEntity<?> getCoverByUserId(
            @PathVariable Long userId) {

        Optional<UserProfile> userOptional = userProfileService.getByUserId(userId);
        UserProfile userProfile;
        if (userOptional.isEmpty()) {
            userProfile = userProfileService.create(userId);
        } else {
            userProfile = userOptional.get();
        }

        Optional<String> imageOpt = userProfileService.getCoverByUserId(userProfile.getUserId());

        if (imageOpt.isEmpty()) {
            return ResponseEntity.ok().body(ResponseUtils.createResponse(
                    "no-cover",
                    String.format("Cover for user with id %d not found", userId)
            ));
        }

        return ResponseEntity.ok().body(ResponseUtils.createResponse(
                "success",
                String.format("Cover for user with id %d was retrieved", userId),
                imageOpt.get()
        ));
    }

    @GetMapping("/{userId}/images")
    public ResponseEntity<?> getAllImagesByUserId(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") @Max(20) int size) {

        Optional<UserProfile> userOptional = userProfileService.getByUserId(userId);
        UserProfile userProfile;
        if (userOptional.isEmpty()) {
            userProfile = userProfileService.create(userId);
        } else {
            userProfile = userOptional.get();
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<String> imagesPage = userProfileService.getAllImagesByUserId(
                userProfile.getUserId(), pageable);

        if (imagesPage.isEmpty()) {
            throw new ImageNotFoundException(String.format(
                    "No images found for user with id %d", userId));
        }

        List<String> responsePage = imagesPage.getContent();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", responsePage);
        response.put("totalElements", imagesPage.getTotalElements());
        response.put("totalPages", imagesPage.getTotalPages());
        response.put("currentPage", imagesPage.getNumber());
        response.put("pageSize", imagesPage.getSize());

        return ResponseEntity.ok().body(response);
    }
}
