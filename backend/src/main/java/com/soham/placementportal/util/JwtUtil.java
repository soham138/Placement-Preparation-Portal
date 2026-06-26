package com.soham.placementportal.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET =
            "my_super_secret_key_123456789_my_super_secret_key";

    private final Key key =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes()
            );

    private final long EXPIRATION_TIME =
            1000 * 60 * 60;

    public String generateToken(
            String email,
            String role) {

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(
                        new Date()
                )
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )
                .signWith(
                        key,
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    public String extractEmail(
            String token) {

        return getClaims(token)
                .getSubject();
    }

    public Claims getClaims(
            String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

  public String extractRole(String token) {

    return getClaims(token)
            .get("role", String.class);
}
}