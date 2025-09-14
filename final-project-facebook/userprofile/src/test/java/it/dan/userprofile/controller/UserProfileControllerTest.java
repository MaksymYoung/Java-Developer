package it.dan.userprofile.controller;

import it.dan.userprofile.dto.user.UserProfileDtoRequest;
import it.dan.userprofile.dto.user.UserProfileDtoResponse;
import it.dan.userprofile.entity.UserProfile;
import it.dan.userprofile.security.JwtTokenProvider;
import it.dan.userprofile.service.UserProfileService;
import it.dan.userprofile.service.mapper.UserImageMapper;
import it.dan.userprofile.service.mapper.UserProfileMapperRequest;
import it.dan.userprofile.service.mapper.UserProfileMapperResponse;
import it.dan.userprofile.utility.ResponseUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserProfileControllerTest {

    @InjectMocks
    private UserProfileController userProfileController;

    @Mock
    private UserProfileService userProfileService;

    @Mock
    private UserProfileMapperRequest userProfileMapperRequest;

    @Mock
    private UserProfileMapperResponse userProfileMapperResponse;

    @Mock
    private UserImageMapper userImageMapper;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateOrUpdate() {
        Long userId = 1L;
        UserProfileDtoRequest dtoRequest = new UserProfileDtoRequest();
        HttpServletRequest request = mock(HttpServletRequest.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer someToken");

        when(jwtTokenProvider.getId(anyString())).thenReturn(userId);

        UserProfile userProfile = new UserProfile();
        UserProfile savedUserProfile = new UserProfile();
        UserProfileDtoResponse dtoResponse = new UserProfileDtoResponse();

        when(userProfileMapperRequest.toEntity(dtoRequest)).thenReturn(userProfile);
        when(userProfileService.createOrUpdate(eq(userId), any(UserProfile.class))).thenReturn(savedUserProfile);
        when(userProfileMapperResponse.toDto(savedUserProfile)).thenReturn(dtoResponse);

        ResponseEntity<?> response = userProfileController.createOrUpdate(dtoRequest, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("success", body.get("status"));
        assertEquals(dtoResponse, body.get("data"));
    }

    @Test
    void testUpdate() {
        Long userId = 1L;
        UserProfileDtoRequest dtoRequest = new UserProfileDtoRequest();
        UserProfile userProfile = new UserProfile();
        UserProfile updatedUserProfile = new UserProfile();
        UserProfileDtoResponse dtoResponse = new UserProfileDtoResponse();
        HttpServletRequest request = mock(HttpServletRequest.class);

        // Mock JwtTokenProvider to return the userId
        when(jwtTokenProvider.getId(anyString())).thenReturn(userId);

        // Mock HttpServletRequest to return the expected Authorization header
        when(request.getHeader("Authorization")).thenReturn("Bearer someToken");

        // Mock mapping and service methods
        when(userProfileMapperRequest.toEntity(dtoRequest)).thenReturn(userProfile);
        when(userProfileService.getByUserId(userId)).thenReturn(Optional.of(updatedUserProfile));
        when(userProfileService.update(eq(userId), any(UserProfile.class))).thenReturn(updatedUserProfile);
        when(userProfileMapperResponse.toDto(updatedUserProfile)).thenReturn(dtoResponse);

        // Mock ResponseUtils.createResponse to return a proper map
        Map<String, Object> expectedResponse = Map.of(
                "status", "success",
                "message", String.format("User with id %d was updated", userId),
                "data", dtoResponse
        );

        // If ResponseUtils.createResponse is static, you should use Mockito's `mockStatic` feature to mock it
        try (MockedStatic<ResponseUtils> mockedStatic = mockStatic(ResponseUtils.class)) {
            mockedStatic.when(() -> ResponseUtils.createResponse(
                    anyString(),
                    anyString(),
                    any()
            )).thenReturn(expectedResponse);

            // Call the method under test
            ResponseEntity<?> response = userProfileController.update(dtoRequest, request);

            // Assertions
            assertEquals(HttpStatus.OK, response.getStatusCode());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertNotNull(body);
            assertEquals("success", body.get("status"));
            assertEquals(String.format("User with id %d was updated", userId), body.get("message"));
            assertEquals(dtoResponse, body.get("data"));
        }
    }

    @Test
    void testGetByUserId() {
        Long userId = 1L;
        UserProfile userProfile = new UserProfile();
        UserProfileDtoResponse dtoResponse = new UserProfileDtoResponse();

        when(userProfileService.getByUserId(userId)).thenReturn(Optional.of(userProfile));
        when(userProfileMapperResponse.toDto(userProfile)).thenReturn(dtoResponse);

        ResponseEntity<?> response = userProfileController.getByUserId(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("success", body.get("status"));
        assertEquals(String.format("User with id %d was got", userId), body.get("message"));
        assertEquals(dtoResponse, body.get("data"));
    }

    @Test
    void testSearchUsersByNickname() {
        String searchString = "nickname";
        Pageable pageable = PageRequest.of(0, 10);
        Page<UserProfile> usersPage = new PageImpl<>(Collections.singletonList(new UserProfile()));
        UserProfileDtoResponse dtoResponse = new UserProfileDtoResponse();

        when(userProfileService.getByNickname(searchString, pageable)).thenReturn(usersPage);
        when(userProfileMapperResponse.toDto(any(UserProfile.class))).thenReturn(dtoResponse);

        ResponseEntity<?> response = userProfileController.searchUsersByNickname(searchString, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("success", body.get("status"));
        assertTrue(body.containsKey("data"));
        assertEquals(usersPage.getTotalElements(), body.get("totalElements"));
        assertEquals(usersPage.getTotalPages(), body.get("totalPages"));
        assertEquals(usersPage.getNumber(), body.get("currentPage"));
        assertEquals(usersPage.getSize(), body.get("pageSize"));
    }

    @Test
    void testGetAllUsers() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id"));
        Page<UserProfile> usersPage = new PageImpl<>(Collections.singletonList(new UserProfile()));
        UserProfileDtoResponse dtoResponse = new UserProfileDtoResponse();

        when(userProfileService.getAll(pageable)).thenReturn(usersPage);
        when(userProfileMapperResponse.toDto(any(UserProfile.class))).thenReturn(dtoResponse);

        ResponseEntity<?> response = userProfileController.getAllUsers(0, 10, "id");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("success", body.get("status"));
        assertTrue(body.containsKey("data"));
        assertEquals(usersPage.getTotalElements(), body.get("totalElements"));
        assertEquals(usersPage.getTotalPages(), body.get("totalPages"));
        assertEquals(usersPage.getNumber(), body.get("currentPage"));
        assertEquals(usersPage.getSize(), body.get("pageSize"));
    }
}
