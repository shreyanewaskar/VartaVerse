package com.mit.VarnaVerse.UserService.Security;


import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
          throws ServletException, IOException {

      String requestHeader = request.getHeader("Authorization");

      logger.info("Authorization Header: {}", requestHeader);

      String username = null;
      String token = null;

      if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
          token = requestHeader.substring(7);
          try {
              username = this.jwtHelper.extractUsername(token);
          } catch (IllegalArgumentException e) {
              logger.error("Illegal argument while fetching the username from token.", e);
          } catch (ExpiredJwtException e) {
              logger.warn("JWT token has expired.", e);
          } catch (MalformedJwtException e) {
              logger.warn("Invalid JWT token - malformed.", e);
          } catch (Exception e) {
              logger.error("Unexpected error occurred while validating token.", e);
          }
      } else {
          logger.warn("Invalid Authorization header format.");
      }

      
      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
          UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
          boolean isTokenValid = this.jwtHelper.validateToken(token, userDetails);
          if (isTokenValid) {
              UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                      userDetails, null, userDetails.getAuthorities());
              authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

              SecurityContextHolder.getContext().setAuthentication(authentication);
              logger.info("Authentication set for user: {}", username);
          } else {
              logger.warn("JWT token validation failed.");
          }
      }

      filterChain.doFilter(request, response);
  }
  
  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
      String path = request.getServletPath();
      return path.equals("/login") || path.equals("/register") || path.equals("/owner/register")
             || path.equals("/forgot-password") || path.equals("/reset-password");
  }

}
