package it.dan.authService.controller;

import it.dan.authService.entity.JwtRequest;
import it.dan.authService.entity.JwtResponse;
import it.dan.authService.entity.RefreshJwtRequest;
import it.dan.authService.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest authRequest) {
        final JwtResponse token = authService.login(authRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/revoke")
    public ResponseEntity<?> revokeToken(@RequestParam String accessToken) {
        boolean isRevokeSuccess = authService.revokeToken(accessToken);
        if (isRevokeSuccess) {
            return ResponseEntity.ok("Token was revoked successfully");
        }
        return ResponseEntity.badRequest().body("Token was not revoked");
    }

}
