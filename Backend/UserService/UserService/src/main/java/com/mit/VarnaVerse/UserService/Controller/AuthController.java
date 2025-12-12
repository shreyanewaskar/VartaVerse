package com.mit.VarnaVerse.UserService.Controller;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.mit.VarnaVerse.UserService.Entities.User;
import com.mit.VarnaVerse.UserService.Security.JwtHelper;
import com.mit.VarnaVerse.UserService.PayLoads.JwtResponse;
import com.mit.VarnaVerse.UserService.PayLoads.LoginRequest;
import com.mit.VarnaVerse.UserService.Repository.UserRepository;
import com.mit.VarnaVerse.UserService.Serivce.Impl.EmailService;

@RestController
public class AuthController {

    @Autowired
    private UserDetailsService customUserDetailsService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private JwtHelper helper;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired 
    private JavaMailSender javaMailSender;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);


    // ==========================
    // LOGIN
    // ==========================
    @PostMapping("/users/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {

        logger.info("Login attempt as USER for email: {}", request.getEmail());

        try {

            // Authenticate credentials
            Authentication authentication = manager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword())
            );

            // Load UserDetails
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getEmail());

            // Generate JWT
            String token = helper.generateToken(userDetails);

            // Fetch user entity
            User user = userRepo.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after auth."));

            JwtResponse response = new JwtResponse(token, user.getName(), user.getId());

            logger.info("Login successful as USER: {}", request.getEmail());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException ex) {
            logger.warn("Login failed for USER: Invalid credentials for {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password (USER)"));
        } catch (Exception e) {
            logger.error("Unexpected error during USER login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong. Please try again."));
        }
    }


    // ==========================
    // FORGOT PASSWORD
    // ==========================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> payload) {

        String email = payload.get("email");

        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with this email does not exist.");
        }

        String userName = userOpt.get().getName();

        String resetLink = "http://localhost:3000/reset-password?email=" + email;

        emailService.sendForgotPasswordEmail(email, userName, resetLink);

        return ResponseEntity.ok("Reset Link sent successfully");
    }


    // ==========================
    // RESET PASSWORD
    // ==========================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email,
                                                @RequestParam String newPassword) {

        logger.info("Reset password request for {}", email);

        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isEmpty()) {
            logger.warn("User doesn't exist with email: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        logger.info("Password reset successful for {}", email);

        return ResponseEntity.ok("Password updated successfully.");
    }


    // ==========================
    // EXCEPTION HANDLING
    // ==========================
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex) {
        logger.warn("BadCredentials: {}", ex.getMessage());
        return new ResponseEntity<>("Invalid credentials!", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException ex) {
        logger.error("RuntimeException: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        logger.error("Unhandled exception: ", ex);
        return new ResponseEntity<>("Something went wrong.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
