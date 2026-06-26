package com.soham.placementportal.controller;

import com.soham.placementportal.entity.Note;
import com.soham.placementportal.repository.NoteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin
public class NoteController {

    private final NoteRepository noteRepo;

    public NoteController(NoteRepository noteRepo) {
        this.noteRepo = noteRepo;
    }

    @GetMapping
    public List<Note> getAllNotes() {
        return noteRepo.findAll();
    }

    @PostMapping("/admin")
    public Note addNote(
            @RequestBody Note note) {

        return noteRepo.save(note);
    }

    @PutMapping("/admin/{id}")
    public Note updateNote(
            @PathVariable Long id,
            @RequestBody Note updated) {

        Note note =
                noteRepo.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Note not found"
                                )
                        );

        note.setTitle(updated.getTitle());
        note.setCategory(updated.getCategory());
        note.setContent(updated.getContent());

        return noteRepo.save(note);
    }

    @DeleteMapping("/admin/{id}")
    public void deleteNote(
            @PathVariable Long id) {

        noteRepo.deleteById(id);
    }
}