package it.dan.authService.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.Claims;
import it.dan.authService.entity.JwtResponse;
import it.dan.authService.entity.User;
import it.dan.authService.exception.AuthException;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Getter
public class JwtService {

    private final UserServiceImpl userService;
    private final Map<String, String> refreshStorage = new HashMap<>();
    private final Map<String, List<String>> accessStorage = new HashMap<>();
    private final JwtProvider jwtProvider;



    public JwtResponse getAccessToken(@NonNull String refreshToken) {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String email = claims.getSubject();
            final String saveRefreshToken = refreshStorage.get(email);
            if (saveRefreshToken != null && saveRefreshToken.equals(refreshToken)) {
                final User user = userService.getByEmail(email)
                        .orElseThrow(() -> new AuthException("User not found"));
                final String accessToken = jwtProvider.generateAccessToken(user);

                List<String> accessTokens = accessStorage.computeIfAbsent(email, k -> new ArrayList<>());
                accessTokens.add(accessToken);
                accessStorage.put(email, accessTokens);
                return new JwtResponse(accessToken, null);
            }
        }
        return new JwtResponse(null, null);
    }

    public JwtResponse refresh(@NonNull String refreshToken) {
        if (jwtProvider.validateRefreshToken(refreshToken)) {
            final Claims claims = jwtProvider.getRefreshClaims(refreshToken);
            final String email = claims.getSubject();
            final String saveRefreshToken = refreshStorage.get(email);
            if (saveRefreshToken != null && saveRefreshToken.equals(refreshToken)) {
                final User user = userService.getByEmail(email)
                        .orElseThrow(() -> new AuthException("User not found"));
                final String accessToken = jwtProvider.generateAccessToken(user);
                final String newRefreshToken = jwtProvider.generateRefreshToken(user);
                refreshStorage.put(user.getEmail(), newRefreshToken);

                List<String> accessTokens = accessStorage.computeIfAbsent(email, k -> new ArrayList<>());
                accessTokens.add(accessToken);
                accessStorage.put(email, accessTokens);

                return new JwtResponse(accessToken, newRefreshToken);
            }
        }
        throw new AuthException("JWT token is invalid");
    }

    public boolean validateAccessToken(@NonNull String accessToken) {
      return jwtProvider.validateAccessToken(accessToken);
    }

    public boolean validateRefreshToken(@NonNull String refreshToken) {
        return jwtProvider.validateRefreshToken(refreshToken);
    }

    public String decodeToken(@NonNull String token) {

        if (jwtProvider.validateAccessToken(token)) {
            String[] chunks = token.split("\\.");

            Base64.Decoder decoder = Base64.getUrlDecoder();

            String header = new String(decoder.decode(chunks[0]));
            String payload = new String(decoder.decode(chunks[1]));

            return header + "\n" + payload;
        } else {
            throw new AuthException("JWT token is invalid");
        }

    }

    public boolean isJwtExpired (String token) {
            DecodedJWT decodedJWT = JWT.decode(token);
            Date expiresAt = decodedJWT.getExpiresAt();
            return expiresAt.before(new Date());
    }






}
