package com.soham.placementportal.controller;

import com.soham.placementportal.entity.AptitudeQuestion;
import com.soham.placementportal.entity.UserAttempt;
import com.soham.placementportal.repository.AptitudeQuestionRepository;
import com.soham.placementportal.repository.UserAttemptRepository;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/aptitude")
@CrossOrigin
public class AptitudeController {

    private final AptitudeQuestionRepository repo;
    private final UserAttemptRepository attemptRepo;

    public AptitudeController(AptitudeQuestionRepository repo,
                              UserAttemptRepository attemptRepo) {
        this.repo = repo;
        this.attemptRepo = attemptRepo;
    }

    // GET ALL QUESTIONS
    @GetMapping
    public List<AptitudeQuestion> getAll() {
        return repo.findAll();
    }

    // SUBMIT ANSWER (FIXED VERSION)
   @PostMapping("/{id}/submit")
public Map<String, Object> submitAnswer(
        @PathVariable Long id,
        @RequestBody Map<String, String> body,
        HttpServletRequest request) {

    Map<String, Object> res = new HashMap<>();

    String email = (String) request.getAttribute("email");
    String selectedAnswer = body.get("selectedAnswer");

    if (email == null) {
        res.put("success", false);
        res.put("message", "Unauthorized");
        return res;
    }

    AptitudeQuestion q = repo.findById(id).orElse(null);

    if (q == null) {
        res.put("success", false);
        res.put("message", "Question not found");
        return res;
    }

    // PREVENT MULTIPLE ATTEMPTS
    Optional<UserAttempt> existingAttempt =
            attemptRepo.findByUserEmailAndQuestionId(email, id);

    if (existingAttempt.isPresent()) {
        res.put("success", false);
        res.put("message", "You have already attempted this question");
        return res;
    }

    String correctAnswer = q.getCorrectAnswer();

    boolean isCorrect =
            correctAnswer != null &&
            correctAnswer.trim().equalsIgnoreCase(selectedAnswer);

    UserAttempt attempt = new UserAttempt();
    attempt.setUserEmail(email);
    attempt.setQuestionId(id);
    attempt.setSelectedAnswer(selectedAnswer);
    attempt.setCorrect(isCorrect);
    attempt.setAttemptedAt(LocalDateTime.now());

    attemptRepo.save(attempt);

    res.put("success", true);
    res.put("correct", isCorrect);
    res.put("correctAnswer", correctAnswer);
   res.put("selectedAnswer", selectedAnswer);

return res;
}

@GetMapping("/score")
public Map<String, Object> getScore(
        HttpServletRequest request) {

    String email =
            (String) request.getAttribute("email");

    List<UserAttempt> attempts =
            attemptRepo.findByUserEmail(email);

    long correct =
            attempts.stream()
                    .filter(UserAttempt::isCorrect)
                    .count();

    long wrong =
            attempts.size() - correct;

    double accuracy =
            attempts.isEmpty()
                    ? 0
                    : (correct * 100.0 / attempts.size());

    Map<String, Object> response =
            new HashMap<>();

    response.put("totalAttempts", attempts.size());
    response.put("correctAnswers", correct);
    response.put("wrongAnswers", wrong);
    response.put("accuracy", accuracy);

    return response;
}

@GetMapping("/attempts")
public List<UserAttempt> getAttempts(
        HttpServletRequest request) {

    String email =
            (String) request.getAttribute("email");

    return attemptRepo.findByUserEmail(email);
}


@GetMapping("/leaderboard")
public List<com.soham.placementportal.dto.LeaderboardDTO> leaderboard() {

    List<UserAttempt> attempts =
            attemptRepo.findAll();

    Map<String, List<UserAttempt>> grouped =
            new HashMap<>();

    for (UserAttempt attempt : attempts) {

        grouped
                .computeIfAbsent(
                        attempt.getUserEmail(),
                        k -> new ArrayList<>()
                )
                .add(attempt);
    }

    List<com.soham.placementportal.dto.LeaderboardDTO> result =
            new ArrayList<>();

    for (String email : grouped.keySet()) {

        List<UserAttempt> userAttempts =
                grouped.get(email);

        long total =
                userAttempts.size();

        long correct =
                userAttempts.stream()
                        .filter(UserAttempt::isCorrect)
                        .count();

        double accuracy =
                total == 0
                        ? 0
                        : (correct * 100.0 / total);

        result.add(
                new com.soham.placementportal.dto.LeaderboardDTO(
                        email,
                        total,
                        correct,
                        accuracy
                )
        );
    }

    result.sort(
            (a, b) ->
                    Long.compare(
                            b.getCorrectAnswers(),
                            a.getCorrectAnswers()
                    )
    );

    return result;
}}