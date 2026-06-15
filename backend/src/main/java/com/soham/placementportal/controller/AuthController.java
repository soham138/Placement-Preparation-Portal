package com.soham.placementportal.controller;

import com.soham.placementportal.dto.ApiResponse;
import com.soham.placementportal.dto.LoginRequest;
import com.soham.placementportal.dto.RegisterRequest;
import com.soham.placementportal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ApiResponse register(@RequestBody RegisterRequest req) {
        return ApiResponse.success(
                "User registered",
                authService.register(req)
        );
    }

    @PostMapping("/login")
    public ApiResponse login(@RequestBody LoginRequest req) {
        return ApiResponse.success(
                "Login successful",
                authService.login(req)
        );
    }
}