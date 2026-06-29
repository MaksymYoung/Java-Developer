package com.danit.newsfeed.web.security;

import com.danit.newsfeed.service.props.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {
    private final JwtProperties jwtProperties;




    public boolean isValid(
            final String token
    ) {
        Jws<Claims> claims = Jwts
                .parser()
                .setSigningKey(jwtProperties.getSecret())
                .build()
                .parseSignedClaims(token);
        return claims.getPayload()
                .getExpiration()
                .after(new Date());
    }
    private Integer getId(
            final String token
    ) {
        return Jwts
                .parser()
                .setSigningKey(jwtProperties.getSecret())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("userId", Integer.class);
    }

    public String getUsername(
            final String token
    ) {
        return Jwts
                .parser()
                .setSigningKey(jwtProperties.getSecret())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public Authentication getAuthentication(
            final String token
    ) {
        Integer id = getId(token);
        String username = getUsername(token);
//        UserDetails userDetails = userDetailsService.loadUserByUsername(
//                username
//        );
        return new UsernamePasswordAuthenticationToken(
                id,
                "",
                new ArrayList<>()
        );
    }
}
