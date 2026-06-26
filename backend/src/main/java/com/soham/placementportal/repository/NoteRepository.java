package com.soham.placementportal.repository;

import com.soham.placementportal.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository
        extends JpaRepository<Note, Long> {
}