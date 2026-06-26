package com.soham.placementportal.repository;

import com.soham.placementportal.entity.CodingProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CodingProgressRepository
        extends JpaRepository<CodingProgress, Long> {

    List<CodingProgress> findByUserEmail(
            String userEmail
    );

    Optional<CodingProgress>
    findByUserEmailAndQuestionId(
            String userEmail,
            Long questionId
    );
}