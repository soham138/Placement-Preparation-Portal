package com.soham.placementportal.controller;

import com.soham.placementportal.entity.AptitudeQuestion;
import com.soham.placementportal.repository.AptitudeQuestionRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/practice")
@CrossOrigin
public class PracticeController {

    private final AptitudeQuestionRepository repo;

    public PracticeController(
            AptitudeQuestionRepository repo) {

        this.repo = repo;
    }

    @GetMapping
     public List<AptitudeQuestion> getQuestions() {
    return repo.findByType("PRACTICE");
}

    @PostMapping("/{id}/check")
    public Map<String, Object> checkAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Map<String, Object> response =
                new HashMap<>();

        AptitudeQuestion question =
                repo.findById(id).orElse(null);

        if (question == null) {

            response.put("success", false);
            response.put("message", "Question not found");

            return response;
        }

        String selectedAnswer =
                body.get("selectedAnswer");

        boolean isCorrect =
                question.getCorrectAnswer()
                        .equalsIgnoreCase(selectedAnswer);

        response.put("success", true);
        response.put("correct", isCorrect);
        response.put(
                "correctAnswer",
                question.getCorrectAnswer()
        );

        return response;
    }
}