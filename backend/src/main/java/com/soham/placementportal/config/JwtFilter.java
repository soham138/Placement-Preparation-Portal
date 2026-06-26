package com.soham.placementportal.config;

import com.soham.placementportal.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            try {
                String token = header.substring(7);
                String email = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token);

                // attach email for controllers
                request.setAttribute("email", email);

                // IMPORTANT: Spring Security authentication
                UsernamePasswordAuthenticationToken auth =
        new UsernamePasswordAuthenticationToken(
                email,
                null,
                List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        )
                )
        );

                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {

    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    response.getWriter().write("Invalid Token");

    return;
}
        }

        filterChain.doFilter(request, response);
    }
}