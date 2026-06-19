package com.soham.placementportal.repository;

import com.soham.placementportal.entity.UserAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAttemptRepository
        extends JpaRepository<UserAttempt, Long> {

    List<UserAttempt> findByUserEmail(String email);

    Optional<UserAttempt> findByUserEmailAndQuestionId(
            String email,
            Long questionId
    );
}