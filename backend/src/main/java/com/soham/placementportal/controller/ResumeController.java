package com.soham.placementportal.controller;

import com.soham.placementportal.entity.StudentProfile;
import com.soham.placementportal.repository.StudentProfileRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class ResumeController {

    private final StudentProfileRepository profileRepo;

    public ResumeController(StudentProfileRepository profileRepo) {
        this.profileRepo = profileRepo;
    }

    // ==========================================
    // Upload Resume
    // ==========================================
    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        try {

            String email = (String) request.getAttribute("email");

            StudentProfile profile = profileRepo.findByUserEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Student profile not found"));

        
            String uploadPath =
                    System.getProperty("user.home")
                            + File.separator
                            + "PlacementPortal"
                            + File.separator
                            + "uploads"
                            + File.separator
                            + "resumes";

            File uploadFolder = new File(uploadPath);

            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String fileName = email.replace("@", "_")
                    .replace(".", "_")
                    + "_resume.pdf";

            File destination = new File(uploadFolder, fileName);

            file.transferTo(destination);

            profile.setResumeUrl(destination.getAbsolutePath());

            profileRepo.save(profile);

            System.out.println("================================");
            System.out.println("Resume Uploaded Successfully");
            System.out.println("Saved At : " + destination.getAbsolutePath());
            System.out.println("Database : " + profile.getResumeUrl());
            System.out.println("================================");

            return ResponseEntity.ok("Resume Uploaded Successfully");

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body("Upload Failed : " + e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // ==========================================
    // Student View Resume
    // ==========================================
    @GetMapping("/resume")
    public ResponseEntity<Resource> viewResume(
            HttpServletRequest request) {

        String email = (String) request.getAttribute("email");

        StudentProfile profile = profileRepo.findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Profile not found"));

        if (profile.getResumeUrl() == null ||
                profile.getResumeUrl().isBlank()) {

            throw new RuntimeException("Resume not uploaded.");
        }

        File file = new File(profile.getResumeUrl());

        if (!file.exists()) {
            throw new RuntimeException("Resume file not found.");
        }

        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    // ==========================================
    // Admin View Resume
    // ==========================================
    @GetMapping("/admin/resume/{id}")
    public ResponseEntity<Resource> adminViewResume(
            @PathVariable Long id) {

        StudentProfile profile = profileRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Profile not found"));

        if (profile.getResumeUrl() == null ||
                profile.getResumeUrl().isBlank()) {

            throw new RuntimeException("Resume not uploaded.");
        }

        File file = new File(profile.getResumeUrl());

        if (!file.exists()) {
            throw new RuntimeException("Resume file not found.");
        }

        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

}