package com.mit.VarnaVerse.UserService.Security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtHelper jwtHelper;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // If no header or does NOT start with Bearer → skip JWT logic safely
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token = authHeader.substring(7);

        if (token.isBlank()) {
            logger.warn("Empty Bearer token");
            filterChain.doFilter(request, response);
            return;
        }

        String username = null;

        try {
            username = jwtHelper.extractUsername(token);
        } catch (ExpiredJwtException e) {
            logger.warn("JWT expired: {}", e.getMessage());
            filterChain.doFilter(request, response);
            return;
        } catch (MalformedJwtException e) {
            logger.warn("Malformed JWT: {}", e.getMessage());
            filterChain.doFilter(request, response);
            return;
        } catch (Exception e) {
            logger.error("JWT parsing error", e);
            filterChain.doFilter(request, response);
            return;
        }

        // When username extracted & no authentication exists yet
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtHelper.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("Authenticated user: {}", username);
            } else {
                logger.warn("JWT validation failed for user {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();

        return path.equals("/login/user") ||
               path.equals("/login/owner") ||
               path.equals("/register") ||
               path.equals("/users/login") ||
               path.equals("/users/register") ||
               path.equals("/owner/register") ||
               path.equals("/forgot-password") ||
               path.equals("/reset-password") ||
               request.getMethod().equalsIgnoreCase("OPTIONS"); // CORS preflight
    }
}
