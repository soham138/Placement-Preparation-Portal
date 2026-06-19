package com.soham.placementportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_attempts")
public class UserAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private Long questionId;

    private String selectedAnswer;

    @Column(name = "is_correct")
    private boolean correct;

    private LocalDateTime attemptedAt;

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUserEmail() { return userEmail; }

    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getQuestionId() { return questionId; }

    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getSelectedAnswer() { return selectedAnswer; }

    public void setSelectedAnswer(String selectedAnswer) { this.selectedAnswer = selectedAnswer; }

    public boolean isCorrect() { return correct; }

    public void setCorrect(boolean correct) { this.correct = correct; }

    public LocalDateTime getAttemptedAt() { return attemptedAt; }

    public void setAttemptedAt(LocalDateTime attemptedAt) { this.attemptedAt = attemptedAt; }
}