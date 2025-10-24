package com.mit.VarnaVerse.UserService.Controller;


import jakarta.mail.MessagingException;

import jakarta.mail.internet.MimeMessage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.naming.AuthenticationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.mit.VarnaVerse.UserService.Security.JwtHelper;
import com.mit.VarnaVerse.UserService.Entities.User; // Ensure User is imported
import com.mit.VarnaVerse.UserService.Serivce.Impl.EmailService; 
import com.mit.VarnaVerse.UserService.PayLoads.JwtResponse; 
import com.mit.VarnaVerse.UserService.PayLoads.LoginRequest; 
import com.mit.VarnaVerse.UserService.Repository.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

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
    
    @PostMapping("/users/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        logger.info("Login attempt as USER for email: {}", request.getEmail());

        try {
            // 1. Authenticate with AuthenticationManager
            Authentication authentication = manager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Load UserDetails from UserDetailsService
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getEmail());

            // 3. Generate JWT Token
            String token = helper.generateToken(userDetails);

            // 4. Fetch User entity for additional info
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


    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Optional<User> userOpt = userRepo.findByEmail(email);
        String userName;
        
        if (userOpt.isPresent()) {
             userName = userOpt.get().getName(); // Get the user's name
        } else {
        	return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with this email does not exist.");
        }
        
     // Construct the reset link. Make sure this matches your frontend's reset password route.
        String resetLink = "http://localhost:3000/reset-password?email=" + email; // Use your actual domain in production

        String subject = "Reset Your Password - TaskSphere"; // Updated subject

        // The detailed HTML email template (Assuming EmailService handles the content)

        emailService.sendForgotPasswordEmail(email,userName , resetLink);
        return ResponseEntity.status(HttpStatus.OK).body("Reset Link sent successfully");
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
    	logger.info("Reset password request initiated for {}",email);
        Optional<User> userOpt = userRepo.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            logger.info("Password reset successful for {}",email);
            userRepo.save(user);
            return ResponseEntity.ok("Password updated successfully.");
        } else {
        	logger.warn("User dosen't exist with mail: {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex) {
        logger.warn("BadCredentialsException: {}", ex.getMessage());
        return new ResponseEntity<>("Invalid credentials!", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUsernameNotFound(UsernameNotFoundException ex) {
        logger.warn("UsernameNotFoundException: {}", ex.getMessage());
        return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> handleNullPointer(NullPointerException ex) {
        logger.error("NullPointerException encountered: ", ex);
        return new ResponseEntity<>("Internal server error: missing data", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException ex) {
        logger.error("RuntimeException encountered: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        logger.error("Unhandled exception: ", ex);
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    

}
