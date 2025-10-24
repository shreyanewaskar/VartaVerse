package com.mit.VarnaVerse.UserService.Serivce.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mit.VarnaVerse.UserService.Entities.User;
import com.mit.VarnaVerse.UserService.Repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Custom implementation of Spring Security's UserDetailsService interface.
 * This class is responsible for loading user-specific data during authentication.
 */
@Service // This registers the class as a bean, solving your previous error.
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo; // Use your UserRepository to fetch the User entity

    /**
     * Locates the user based on the username (which is the email in your case).
     * @param email The email submitted by the user during login.
     * @return a fully populated UserDetails object (from org.springframework.security.core.userdetails.User).
     * @throws UsernameNotFoundException if the user could not be found.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Fetch the User entity from the database using the email
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. Map the User's role to Spring Security GrantedAuthority
        // Assuming your 'role' field is a simple string (e.g., "USER", "ADMIN").
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole()));

        // 3. Return the Spring Security UserDetails object
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),          // Username (used as email for login)
            user.getPassword(),       // Encoded password from the DB
            authorities               // User roles/authorities
        );
    }
}