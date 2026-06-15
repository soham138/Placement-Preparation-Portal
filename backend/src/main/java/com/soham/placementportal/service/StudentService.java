package com.soham.placementportal.service;

import com.soham.placementportal.entity.Student;
import com.soham.placementportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Save student
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
    return studentRepository.findAll();
}

    // Get student by ID
public Student getStudentById(Long id) {
    return studentRepository.findById(id)
            .orElse(null);
}

// Delete student by ID
public void deleteStudent(Long id) {
    studentRepository.deleteById(id);
}

public Student updateStudent(Long id, Student updatedStudent) {

    Student existingStudent = studentRepository.findById(id).orElse(null);

    if (existingStudent != null) {
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setBranch(updatedStudent.getBranch());

        return studentRepository.save(existingStudent);
    }

    return null;
}
}