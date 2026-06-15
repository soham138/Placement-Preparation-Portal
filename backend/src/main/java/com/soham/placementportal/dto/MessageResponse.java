package com.soham.placementportal.dto;

public class MessageResponse {

    private String name;
    private String message;

    public MessageResponse(String name, String message) {
        this.name = name;
        this.message = message;
    }

    public String getName() {
        return name;
    }

    public String getMessage() {
        return message;
    }
}