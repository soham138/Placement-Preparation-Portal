package com.soham.placementportal.controller;

import com.soham.placementportal.dto.ApiResponse;
import com.soham.placementportal.entity.Student;
import com.soham.placementportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping
    public ApiResponse create(@RequestBody Student student) {

        return ApiResponse.success(
                "Student created",
                studentRepository.save(student)
        );
    }

    @GetMapping
    public ApiResponse getAll() {

        List<Student> students = studentRepository.findAll();

        return ApiResponse.success(
                "All students",
                students
        );
    }

    @GetMapping("/{id}")
    public ApiResponse getById(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return ApiResponse.success(
                "Student found",
                student
        );
    }

    @PutMapping("/{id}")
    public ApiResponse update(
            @PathVariable Long id,
            @RequestBody Student student) {

        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        existing.setName(student.getName());
        existing.setEmail(student.getEmail());
        existing.setBranch(student.getBranch());

        return ApiResponse.success(
                "Student updated",
                studentRepository.save(existing)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse delete(@PathVariable Long id) {

        studentRepository.deleteById(id);

        return ApiResponse.success(
                "Student deleted",
                null
        );
    }
}