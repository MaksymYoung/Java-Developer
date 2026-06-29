package it.dan.authService.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetDto {
    private String resetPasswordToken;
    private String newPassword;
    private String confirmPassword;
}
