package it.dan.authService.service;

import io.jsonwebtoken.Claims;
import it.dan.authService.entity.JwtRequest;
import it.dan.authService.entity.JwtResponse;
import it.dan.authService.entity.User;
import it.dan.authService.exception.AuthException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserServiceImpl userService;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public List<String> getTokensByUser(String userName) {
        List<String> accessTokens = jwtService.getAccessStorage().get(userName);
        return accessTokens;
    }

    public JwtResponse login(@NonNull JwtRequest authRequest) {
        final User user = userService.getByEmail(authRequest.getEmail())
                .orElseThrow(() -> new AuthException("User not found"));

        if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            final String accessToken = jwtProvider.generateAccessToken(user);
            final String refreshToken = jwtProvider.generateRefreshToken(user);
            jwtService.getRefreshStorage().put(user.getEmail(), refreshToken);

            List<String> accessTokens = jwtService.getAccessStorage().computeIfAbsent(user.getEmail(), k -> new ArrayList<>());
            accessTokens.add(accessToken);
            jwtService.getAccessStorage().put(user.getEmail(), accessTokens);
            return new JwtResponse(accessToken, refreshToken);
        } else {
            throw new AuthException("Password is incorrect");
        }
    }



    public boolean revokeToken(@NonNull String accessToken) {
        if (jwtProvider.validateAccessToken(accessToken)) {
            final Claims claims = jwtProvider.getAccessClaims(accessToken);
            final String login = claims.getSubject();
            List<String> tokens = jwtService.getAccessStorage().get(login);
            if (tokens != null) {
                tokens.remove(accessToken);
                if (tokens.isEmpty()) {
                    jwtService.getAccessStorage().remove(login);
                } else {
                    jwtService.getAccessStorage().put(login, tokens);
                }
                return true;
            }
        }
        return false;
    }
}
