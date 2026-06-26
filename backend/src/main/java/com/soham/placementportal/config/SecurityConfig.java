package com.soham.placementportal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth

                        // PUBLIC
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // PRACTICE MODE
                        .requestMatchers(
                                "/api/practice/**"
                        ).permitAll()

                        // APTITUDE TEST
                        .requestMatchers(
                                "/api/aptitude/**"
                        ).authenticated()

                        .requestMatchers(
            "/api/coding/**"
    ).authenticated()

    .requestMatchers(
    "/api/notes/admin/**"
).hasRole("ADMIN")

.requestMatchers(
    "/api/notes/**"
).authenticated()

.requestMatchers("/api/profile/admin/**")
.hasRole("ADMIN")

.requestMatchers("/api/profile/**")
.authenticated()

.requestMatchers("/uploads/**")
.permitAll()


                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}