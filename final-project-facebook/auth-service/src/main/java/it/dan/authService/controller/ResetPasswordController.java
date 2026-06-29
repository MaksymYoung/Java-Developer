package it.dan.authService.controller;

import it.dan.authService.dto.EmailDto;
import it.dan.authService.dto.PasswordResetDto;
import it.dan.authService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class ResetPasswordController {

    @Autowired
    private UserService userService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody EmailDto emailDto) {
        String email = emailDto.getEmail();
        String token = userService.initiatePasswordReset(email);
        if (token != null) {
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found.");
        }
    }



    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetDto resetDto) {
        boolean isPasswordReset = userService.resetPassword(resetDto.getResetPasswordToken(), resetDto.getNewPassword());
        if (isPasswordReset) {
            return ResponseEntity.ok("Password successfully reset.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token or passwords do not match.");
        }
    }
}
