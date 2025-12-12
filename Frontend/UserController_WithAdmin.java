package com.mit.VarnaVerse.UserService.Controller;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.mit.VarnaVerse.UserService.Entities.User;
import com.mit.VarnaVerse.UserService.Repository.UserRepository;
import com.mit.VarnaVerse.UserService.Security.JwtHelper;
import com.mit.VarnaVerse.UserService.Service.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private User getUserFromJwt(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header");
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        String email = jwtHelper.extractUsername(token);
        logger.info("Extracted email from token: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }

    @PostMapping("/users/register")
    public User register(@RequestBody User request) {
        logger.info("Registering new user with email: {}", request.getEmail());
        User registeredUser = userService.register(request);
        logger.info("User registered successfully with ID: {}", registeredUser.getId());
        return registeredUser;
    }

    @GetMapping("/users/me")
    public User currentUser(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromJwt(authHeader);
        logger.info("Fetching current user from token: {}", user.getEmail());
        return user;
    }

    @GetMapping("/getusers")
    public List<User> getUsers(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromJwt(authHeader);
        logger.info("Admin {} is fetching all users", user.getEmail());
        return userService.getUser();
    }

    @PutMapping("/users/update")
    public User updateUser(@RequestBody User updatedUserData, @RequestHeader("Authorization") String authHeader) {
        User user = getUserFromJwt(authHeader);
        logger.info("User {} is updating their profile", user.getEmail());
        return userService.updateUser(user.getEmail(), updatedUserData);
    }

    @DeleteMapping("/users/delete")
    public User deleteUser(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromJwt(authHeader);
        logger.info("User {} requested deletion", user.getEmail());
        return userService.deleteUser(user);
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        User requester = getUserFromJwt(authHeader);
        logger.info("User {} is fetching user by ID: {}", requester.getEmail(), id);
        return userService.getUserById(id);
    }

    @GetMapping("/users/role")
    public List<User> getUserByRole(@RequestParam String role, @RequestHeader("Authorization") String authHeader) {
        User requester = getUserFromJwt(authHeader);
        logger.info("User {} is fetching users with role: {}", requester.getEmail(), role);
        return userService.getUserByRole(role);
    }

    @GetMapping("/users/admin/static")
    public User getStaticAdmin() {
        logger.info("Fetching static admin user with ID: 6");
        return userRepository.findById("6")
                .orElseThrow(() -> new RuntimeException("Static admin user not found"));
    }
}
