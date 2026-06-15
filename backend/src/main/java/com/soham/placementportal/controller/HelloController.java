package com.soham.placementportal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.soham.placementportal.dto.MessageRequest;
import com.soham.placementportal.dto.MessageResponse;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Placement Portal";
    }

    @GetMapping("/java")
    public String java() {
        return "Java Backend";

    
    }

    @PostMapping("/welcome")
public String welcome() {
    return "Welcome to Placement Portal";
}

@PostMapping("/greet")
public MessageResponse greet(@RequestBody MessageRequest request) {

    return new MessageResponse(
        request.getName(),
        "Welcome " + request.getName()
    );
}
}