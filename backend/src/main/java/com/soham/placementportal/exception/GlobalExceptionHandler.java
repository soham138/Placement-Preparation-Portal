package com.soham.placementportal.exception;

import com.soham.placementportal.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ApiResponse handle(Exception e) {
        return ApiResponse.error(e.getMessage());
    }
}