        package com.soham.placementportal.controller;

        import com.soham.placementportal.entity.User;
        import com.soham.placementportal.repository.UserRepository;

        import org.springframework.security.crypto.password.PasswordEncoder;
        import org.springframework.web.bind.annotation.*;

        import java.util.HashMap;
        import java.util.List;
        import java.util.Map;

        @RestController
        @RequestMapping("/api/admin/users")
        @CrossOrigin
        public class AdminUserController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public AdminUserController(
                UserRepository userRepository,
                PasswordEncoder passwordEncoder) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @GetMapping
        public List<User> getAllUsers() {

                return userRepository.findAll();
        }

        @PutMapping("/{id}")
        public User updateUser(
                @PathVariable Long id,
                @RequestBody User updatedUser) {

                User user =
                        userRepository.findById(id)
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "User not found"
                                        )
                                );

                user.setName(
                        updatedUser.getName()
                );

                user.setRole(
                        updatedUser.getRole()
                );

                return userRepository.save(user);
        }

        @PutMapping("/{id}/reset-password")
        public Map<String, Object> resetPassword(
                @PathVariable Long id,
                @RequestBody Map<String, String> body) {

                User user =
                        userRepository.findById(id)
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "User not found"
                                        )
                                );

                user.setPassword(
                        passwordEncoder.encode(
                                body.get("password")
                        )
                );

                userRepository.save(user);

                Map<String, Object> response =
                        new HashMap<>();

                response.put(
                        "success",
                        true
                );

                response.put(
                        "message",
                        "Password reset successful"
                );

                return response;
        }

        @DeleteMapping("/{id}")
        public Map<String, Object> deleteUser(
                @PathVariable Long id) {

                Map<String, Object> response =
                        new HashMap<>();

                userRepository.deleteById(id);

                response.put(
                        "success",
                        true
                );

                response.put(
                        "message",
                        "User deleted successfully"
                );

                return response;
        }
        }