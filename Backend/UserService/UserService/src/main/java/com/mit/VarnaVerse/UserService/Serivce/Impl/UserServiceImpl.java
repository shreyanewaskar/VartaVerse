package com.mit.VarnaVerse.UserService.Serivce.Impl;


import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mit.VarnaVerse.UserService.Entities.User;
import com.mit.VarnaVerse.UserService.Repository.UserRepository;
import com.mit.VarnaVerse.UserService.Service.UserService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private JavaMailSender javaMailSender;
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public List<User> getUser() {
        logger.info("Fetching all users");
        return userRepo.findAll();
    }

    @Override // If this method is overriding an interface method, otherwise remove @Override
    public User register(User user) {
        logger.info("Attempting to register user with email: {}", user.getEmail());

        Optional<User> existingUser = userRepo.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            logger.warn("Registration failed. User already exists with email: {}", user.getEmail());
            throw new RuntimeException("User already exists with email: " + user.getEmail());
        }

        // Encode and save user
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = userRepo.save(user);

        // Prepare dynamic HTML welcome email
        String userName = user.getName() != null ? user.getName() : "There";
        String browsePgLink = "http://localhost:3000/login";
        String contactFaqLink = "http://localhost:3000/contact-us";
        String subject = "Welcome to StayNest! Your Nest Away From Home Awaits!";

        emailService.sendWelcomeEmail(userName,user.getEmail());
       
        logger.info("Welcome email sent to: {}", user.getEmail());


        logger.info("User registered successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    @Override
    public User login(User user) {
        logger.info("Login attempt for email: {}", user.getEmail());

        if (user.getEmail() == null || user.getPassword() == null) {
            logger.warn("Login failed: missing credentials");
            throw new RuntimeException("Credentials not found");
        }

        Optional<User> existingUser = userRepo.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            if (passwordEncoder.matches(user.getPassword(), existingUser.get().getPassword())) {
                logger.info("Login successful for email: {}", user.getEmail());
                return existingUser.get();
            } else {
                logger.warn("Login failed: invalid password for email: {}", user.getEmail());
            }
        } else {
            logger.warn("Login failed: user not found for email: {}", user.getEmail());
        }

        throw new RuntimeException("Invalid email or password");
    }

    @Override
    public User currentUser(User user) {
        logger.info("Fetching current user by email: {}", user.getEmail());
        Optional<User> currentUser = userRepo.findByEmail(user.getEmail());

        if (currentUser.isPresent()) {
            return currentUser.get();
        } else {
            logger.warn("Current user not found for email: {}", user.getEmail());
            throw new RuntimeException("User does not exist");
        }
    }

    @Override
    public User updateUser(String email , User user) {
        logger.info("Updating user with email: {}", email);
        Optional<User> currentUser = userRepo.findByEmail(email);

        if (currentUser.isPresent()) {
            User existingUser = currentUser.get();

            if (user.getName() != null) existingUser.setName(user.getName());
            if (user.getPassword() != null) {
                String encodedPassword = passwordEncoder.encode(user.getPassword());
                existingUser.setPassword(encodedPassword);
            }

            if (user.getPhoneNumber() != null) existingUser.setPhoneNumber(user.getPhoneNumber());
            if (user.getRole() != null) existingUser.setRole(user.getRole());

            User updated = userRepo.save(existingUser);
            logger.info("User updated successfully for ID: {}", updated.getId());
            return updated;
        } else {
            logger.warn("Update failed. User not found for email: {}", user.getEmail());
            throw new RuntimeException("User does not exist");
        }
    }

    @Override
    public User deleteUser(User user) {
        logger.info("Attempting to delete user with ID: {}", user.getId());
        Optional<User> currentUser = userRepo.findById(user.getId());

        if (currentUser.isPresent()) {
            userRepo.deleteById(user.getId());
            logger.info("User deleted successfully with ID: {}", user.getId());
            return currentUser.get();
        } else {
            logger.warn("Delete failed. User not found with ID: {}", user.getId());
            throw new RuntimeException("No User exists with this id");
        }
    }

    @Override
    public User getUserById(String id) {
        logger.info("Fetching user by ID: {}", id);
        Optional<User> user = userRepo.findById(Long.parseLong(id));

        if (user.isPresent()) {
            return user.get();
        } else {
            logger.warn("User not found with ID: {}", id);
            throw new RuntimeException("No User exists with this id");
        }
    }

    @Override
    public List<User> getUserByRole(String role) {
        logger.info("Fetching users by role: {}", role);
        List<User> users = userRepo.findByRole(role);
        logger.info("Found {} users with role '{}'", users.size(), role);
        return users;
    }
}
