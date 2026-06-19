package com.soham.placementportal.dto;

public class LeaderboardDTO {

    private String userEmail;
    private long totalAttempts;
    private long correctAnswers;
    private double accuracy;

    public LeaderboardDTO(
            String userEmail,
            long totalAttempts,
            long correctAnswers,
            double accuracy) {

        this.userEmail = userEmail;
        this.totalAttempts = totalAttempts;
        this.correctAnswers = correctAnswers;
        this.accuracy = accuracy;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public long getTotalAttempts() {
        return totalAttempts;
    }

    public long getCorrectAnswers() {
        return correctAnswers;
    }

    public double getAccuracy() {
        return accuracy;
    }
}