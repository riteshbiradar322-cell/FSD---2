package com.example.backend.controller;

import com.example.backend.dto.TaskRequest;
import com.example.backend.entity.Task;
import com.example.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // Admin and user can create tasks.
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request,
                                           Authentication authentication) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setCreatedBy(authentication.getName());
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(taskRepository.save(task));
    }

    // GET is intentionally separate from the dashboard. The frontend calls it only from the Posts page.
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public Page<Task> getTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 20);

        PageRequest pageRequest = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return taskRepository.findAllByOrderByCreatedAtDesc(pageRequest);
    }

    // Users can edit only their own task. Admin can edit any task.
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> updateTask(@PathVariable Long id,
                                        @RequestBody TaskRequest request,
                                        Authentication authentication) {

        return taskRepository.findById(id).map(task -> {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            boolean isOwner = task.getCreatedBy().equals(authentication.getName());

            if (!isAdmin && !isOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Users can edit only their own tasks.");
            }

            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Task title is required.");
            }

            task.setTitle(request.getTitle().trim());
            task.setDescription(request.getDescription());
            task.setUpdatedAt(LocalDateTime.now());

            return ResponseEntity.ok(taskRepository.save(task));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // IMPORTANT: DELETE API is ADMIN ONLY.
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        taskRepository.deleteById(id);
        return ResponseEntity.ok("Task deleted successfully.");
    }
}
