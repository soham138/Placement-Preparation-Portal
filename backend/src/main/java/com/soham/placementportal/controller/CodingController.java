package com.soham.placementportal.controller;

import com.soham.placementportal.entity.CodingProgress;
import com.soham.placementportal.entity.CodingQuestion;
import com.soham.placementportal.entity.CodingSubmission;
import com.soham.placementportal.repository.CodingProgressRepository;
import com.soham.placementportal.repository.CodingQuestionRepository;
import com.soham.placementportal.repository.CodingSubmissionRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/coding")
@CrossOrigin
public class CodingController {

    private final CodingQuestionRepository questionRepo;
    private final CodingProgressRepository progressRepo;
    private final CodingSubmissionRepository submissionRepo;

    public CodingController(
            CodingQuestionRepository questionRepo,
            CodingProgressRepository progressRepo,
            CodingSubmissionRepository submissionRepo) {

        this.questionRepo = questionRepo;
        this.progressRepo = progressRepo;
        this.submissionRepo = submissionRepo;
    }

    @GetMapping
    public List<CodingQuestion> getAllQuestions() {

        return questionRepo.findAll();
    }

    @GetMapping("/progress")
    public List<CodingProgress> getProgress(
            HttpServletRequest request) {

        String email =
                (String) request.getAttribute("email");

        return progressRepo.findByUserEmail(email);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(
            HttpServletRequest request) {

        String email =
                (String) request.getAttribute("email");

        long totalQuestions =
                questionRepo.count();

        long solvedQuestions =
                progressRepo.findByUserEmail(email)
                        .size();

        double completion = 0;

        if (totalQuestions > 0) {

            completion =
                    ((double) solvedQuestions
                            / totalQuestions) * 100;
        }

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "totalQuestions",
                totalQuestions
        );

        response.put(
                "solvedQuestions",
                solvedQuestions
        );

        response.put(
                "completion",
                completion
        );

        return response;
    }

    @PostMapping("/{id}/submit")
    public Map<String, Object> submitSolution(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        Map<String, Object> response =
                new HashMap<>();

        String email =
                (String) request.getAttribute("email");

        if (email == null) {

            response.put("success", false);
            response.put("message", "Unauthorized");

            return response;
        }

        Optional<CodingSubmission> existing =
                submissionRepo.findByUserEmailAndQuestionId(
                        email,
                        id
                );

        if (existing.isPresent()) {

            response.put("success", false);
            response.put(
                    "message",
                    "You already submitted this question"
            );

            return response;
        }

        String code =
                body.get("code");

        CodingSubmission submission =
                new CodingSubmission();

        submission.setUserEmail(email);
        submission.setQuestionId(id);
        submission.setCode(code);
        submission.setStatus("PENDING");

        submissionRepo.save(submission);

        response.put("success", true);
        response.put(
                "message",
                "Solution submitted successfully"
        );

        return response;
    }

    @GetMapping("/submissions")
    public List<CodingSubmission> getMySubmissions(
            HttpServletRequest request) {

        String email =
                (String) request.getAttribute("email");

        return submissionRepo.findByUserEmail(email);
    }

    @GetMapping("/admin/submissions")
    public List<CodingSubmission> getAllSubmissions() {

        return submissionRepo.findAll();
    }

    @PutMapping("/admin/submissions/{id}/approve")
    public Map<String, Object> approveSubmission(
            @PathVariable Long id) {

        Map<String, Object> response =
                new HashMap<>();

        Optional<CodingSubmission> optional =
                submissionRepo.findById(id);

        if (optional.isEmpty()) {

            response.put("success", false);
            response.put(
                    "message",
                    "Submission not found"
            );

            return response;
        }

        CodingSubmission submission =
                optional.get();

        submission.setStatus("APPROVED");

        submissionRepo.save(submission);

        Optional<CodingProgress> existing =
                progressRepo.findByUserEmailAndQuestionId(
                        submission.getUserEmail(),
                        submission.getQuestionId()
                );

        if (existing.isEmpty()) {

            CodingProgress progress =
                    new CodingProgress();

            progress.setUserEmail(
                    submission.getUserEmail()
            );

            progress.setQuestionId(
                    submission.getQuestionId()
            );

            progressRepo.save(progress);
        }

        response.put("success", true);
        response.put(
                "message",
                "Submission approved"
        );

        return response;
    }

    @PutMapping("/admin/submissions/{id}/reject")
    public Map<String, Object> rejectSubmission(
            @PathVariable Long id) {

        Map<String, Object> response =
                new HashMap<>();

        Optional<CodingSubmission> optional =
                submissionRepo.findById(id);

        if (optional.isEmpty()) {

            response.put("success", false);
            response.put(
                    "message",
                    "Submission not found"
            );

            return response;
        }

        CodingSubmission submission =
                optional.get();

        submission.setStatus("REJECTED");

        submissionRepo.save(submission);

        response.put("success", true);
        response.put(
                "message",
                "Submission rejected"
        );

        return response;
    }

    @PostMapping("/admin")
public CodingQuestion addQuestion(
        @RequestBody CodingQuestion question) {

    return questionRepo.save(question);
}

@PutMapping("/admin/{id}")
public CodingQuestion updateQuestion(
        @PathVariable Long id,
        @RequestBody CodingQuestion updatedQuestion) {

    CodingQuestion question =
            questionRepo.findById(id)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Question not found"
                            )
                    );

    question.setTitle(
            updatedQuestion.getTitle()
    );

    question.setDescription(
            updatedQuestion.getDescription()
    );

    question.setDifficulty(
            updatedQuestion.getDifficulty()
    );

    question.setTopic(
            updatedQuestion.getTopic()
    );

    question.setCompany(
            updatedQuestion.getCompany()
    );

    question.setSolution(
            updatedQuestion.getSolution()
    );

    return questionRepo.save(question);
}

@DeleteMapping("/admin/{id}")
public Map<String, Object> deleteQuestion(
        @PathVariable Long id) {

    Map<String, Object> response =
            new HashMap<>();

    questionRepo.deleteById(id);

    response.put(
            "success",
            true
    );

    response.put(
            "message",
            "Question deleted successfully"
    );

    return response;
}

    @GetMapping("/leaderboard")
    public List<Map<String, Object>> getLeaderboard() {

        List<CodingProgress> progressList =
                progressRepo.findAll();

        Map<String, Integer> scores =
                new HashMap<>();

        for (CodingProgress progress : progressList) {

            String email =
                    progress.getUserEmail();

            scores.put(
                    email,
                    scores.getOrDefault(
                            email,
                            0
                    ) + 1
            );
        }

        List<Map<String, Object>> leaderboard =
                new ArrayList<>();

        for (Map.Entry<String, Integer> entry
                : scores.entrySet()) {

            Map<String, Object> row =
                    new HashMap<>();

            row.put(
                    "email",
                    entry.getKey()
            );

            row.put(
                    "solved",
                    entry.getValue()
            );

            leaderboard.add(row);
        }

        leaderboard.sort(
                (a, b) ->
                        Integer.compare(
                                (Integer) b.get("solved"),
                                (Integer) a.get("solved")
                        )
        );

        return leaderboard;
    }
}