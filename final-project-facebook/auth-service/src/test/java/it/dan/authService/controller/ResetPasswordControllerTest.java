package it.dan.authService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.dan.authService.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("local")
class ResetPasswordControllerTest {
    @Mock
    private UserServiceImpl userService;
    @InjectMocks
    private ResetPasswordController resetPasswordController;
    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(resetPasswordController)
                .build();
    }

    @Test
    void forgotPassword() throws Exception {
        String email = "test@example.com";
        String token = "resetToken";

        when(userService.initiatePasswordReset(email)).thenReturn(token);

        mockMvc.perform(post("/api/v1/users/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string(token));

        verify(userService, times(1)).initiatePasswordReset(email);
    }

    @Test
    void forgotPasswordEmailNotFound() throws Exception {
        String email = "notfound@example.com";

        when(userService.initiatePasswordReset(email)).thenReturn(null);

        mockMvc.perform(post("/api/v1/users/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\"}"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Email not found."));

        verify(userService, times(1)).initiatePasswordReset(email);
    }

    @Test
    void resetPassword() throws Exception {
        String resetToken = "resetToken";
        String newPassword = "newPassword123";

        when(userService.resetPassword(resetToken, newPassword)).thenReturn(true);

        mockMvc.perform(post("/api/v1/users/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"resetPasswordToken\":\"" + resetToken + "\",\"newPassword\":\"" + newPassword + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password successfully reset."));

        verify(userService, times(1)).resetPassword(resetToken, newPassword);
    }

    @Test
    void resetPasswordInvalidToken() throws Exception {
        String resetToken = "invalidToken";
        String newPassword = "newPassword123";

        when(userService.resetPassword(resetToken, newPassword)).thenReturn(false);

        mockMvc.perform(post("/api/v1/users/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"resetPasswordToken\":\"" + resetToken + "\",\"newPassword\":\"" + newPassword + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid token or passwords do not match."));

        verify(userService, times(1)).resetPassword(resetToken, newPassword);
    }
}
