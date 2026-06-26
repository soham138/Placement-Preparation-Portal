package com.soham.placementportal.repository;

import com.soham.placementportal.entity.CodingSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CodingSubmissionRepository
        extends JpaRepository<CodingSubmission, Long> {

    List<CodingSubmission> findByUserEmail(
            String userEmail
    );

    List<CodingSubmission> findByStatus(
            String status
    );

    Optional<CodingSubmission>
    findByUserEmailAndQuestionId(
            String userEmail,
            Long questionId
    );
}