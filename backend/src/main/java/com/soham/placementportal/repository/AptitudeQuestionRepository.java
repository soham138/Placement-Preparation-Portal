package com.soham.placementportal.repository;

import com.soham.placementportal.entity.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AptitudeQuestionRepository
        extends JpaRepository<AptitudeQuestion, Long> {

    List<AptitudeQuestion> findByType(String type);

}