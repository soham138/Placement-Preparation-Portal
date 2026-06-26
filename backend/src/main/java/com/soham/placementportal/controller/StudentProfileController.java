package com.soham.placementportal.controller;

import com.soham.placementportal.entity.StudentProfile;
import com.soham.placementportal.repository.StudentProfileRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class StudentProfileController {

    private final StudentProfileRepository profileRepo;

    public StudentProfileController(StudentProfileRepository profileRepo) {
        this.profileRepo = profileRepo;
    }

    // Get Logged In Student Profile
    @GetMapping
    public StudentProfile getProfile(HttpServletRequest request) {

        String email = (String) request.getAttribute("email");

        Optional<StudentProfile> profile =
                profileRepo.findByUserEmail(email);

        return profile.orElse(null);
    }

    // Create Profile
    @PostMapping
public StudentProfile createProfile(
        @RequestBody StudentProfile profile,
        HttpServletRequest request) {

    String email = (String) request.getAttribute("email");

    if (profileRepo.findByUserEmail(email).isPresent()) {
        throw new RuntimeException("Profile already exists");
    }

    profile.setUserEmail(email);

    return profileRepo.save(profile);
}

    // Update Profile
    @PutMapping
public StudentProfile updateProfile(
        @RequestBody StudentProfile updated,
        HttpServletRequest request) {

    String email = (String) request.getAttribute("email");

    StudentProfile profile =
            profileRepo.findByUserEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Profile not found"));

    profile.setFullName(updated.getFullName());
    profile.setCollege(updated.getCollege());
    profile.setBranch(updated.getBranch());
    profile.setYear(updated.getYear());
    profile.setPrn(updated.getPrn());
    profile.setPhone(updated.getPhone());
    profile.setCgpa(updated.getCgpa());
    profile.setSkills(updated.getSkills());
    profile.setGithub(updated.getGithub());
    profile.setLinkedin(updated.getLinkedin());

    // DON'T update resume here

    profile.setAbout(updated.getAbout());

    return profileRepo.save(profile);

    
}
    // Admin - View All Student Profiles
    @GetMapping("/admin/all")
    public List<StudentProfile> getAllProfiles() {
        return profileRepo.findAll();
    }
}   