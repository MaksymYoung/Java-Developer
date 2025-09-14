package org.example.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.secret.access}")
    private String accessTokenSecret;

    public String getUsernameFromToken(String token) {
        return getAllClaimsFromToken(token, accessTokenSecret).getSubject();
    }

    public Long getUserIdFromToken(String token) {
        return Long.parseLong(getAllClaimsFromToken(token, accessTokenSecret).get("userId").toString());
    }

    private Claims getAllClaimsFromToken(String token, String secret) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, String username) {
        final String usernameFromToken = getUsernameFromToken(token);
        return (usernameFromToken.equals(username) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getAllClaimsFromToken(token, accessTokenSecret).getExpiration();
        return expiration.before(new Date());
    }
}
