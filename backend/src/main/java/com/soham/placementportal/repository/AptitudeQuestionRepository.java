package com.soham.placementportal.repository;

import com.soham.placementportal.entity.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AptitudeQuestionRepository
        extends JpaRepository<AptitudeQuestion, Long> {
}