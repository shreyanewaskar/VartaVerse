package com.mit.VarnaVerse.UserService.Controller;

import com.mit.VarnaVerse.UserService.Entities.Follower;
import com.mit.VarnaVerse.UserService.Entities.User;
import com.mit.VarnaVerse.UserService.Service.FollowerService;
import com.mit.VarnaVerse.UserService.Repository.UserRepository;
import com.mit.VarnaVerse.UserService.Security.JwtHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class FollowerController {

    private static final Logger logger =
            LoggerFactory.getLogger(FollowerController.class);

    private final FollowerService followerService;
    private final JwtHelper jwtHelper;
    private final UserRepository userRepository;

    @Autowired
    public FollowerController(FollowerService followerService,
                              JwtHelper jwtHelper,
                              UserRepository userRepository) {
        this.followerService = followerService;
        this.jwtHelper = jwtHelper;
        this.userRepository = userRepository;
    }

    private User getUserFromJwt(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("Invalid or missing Authorization header");
                throw new RuntimeException("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            String email = jwtHelper.extractUsername(token);
            logger.info("JWT extracted for email: {}", email);

            return userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        logger.error("User not found for email: {}", email);
                        return new RuntimeException("User not found for email: " + email);
                    });

        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage());
            throw new RuntimeException("Invalid JWT token: " + e.getMessage());
        }
    }

    /**
     * POST /users/follow/{targetId}
     */
    @PostMapping("/follow/{targetId}")
    public ResponseEntity<Follower> followUser(@PathVariable long targetId,
                                               @RequestHeader("Authorization") String authHeader) {
        try {
            User currentUser = getUserFromJwt(authHeader);
            logger.info("User {} attempting to follow user {}", currentUser.getId(), targetId);

            Follower follower =
                    followerService.followUser(currentUser.getId(), targetId);

            logger.info("User {} successfully followed user {}",
                    currentUser.getId(), targetId);

            return new ResponseEntity<>(follower, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            logger.warn("Follow failed: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            logger.error("Unexpected error while following user: {}", e.getMessage(), e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * POST /users/unfollow/{targetId}
     */
    @PostMapping("/unfollow/{targetId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable long targetId,
                                             @RequestHeader("Authorization") String authHeader) {

        User currentUser = getUserFromJwt(authHeader);
        logger.info("User {} attempting to unfollow user {}",
                currentUser.getId(), targetId);

        followerService.unfollowUser(currentUser.getId(), targetId);

        logger.info("User {} successfully unfollowed user {}",
                currentUser.getId(), targetId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * GET /users/followers/{userId}
     */
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<Follower>> getFollowers(@PathVariable long userId) {
        logger.info("Fetching followers for user {}", userId);

        List<Follower> followers = followerService.getFollowers(userId);

        logger.info("Found {} followers for user {}", followers.size(), userId);
        return new ResponseEntity<>(followers, HttpStatus.OK);
    }

    /**
     * GET /users/following/{userId}
     */
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<Follower>> getFollowing(@PathVariable long userId) {
        logger.info("Fetching following list for user {}", userId);

        List<Follower> following = followerService.getFollowing(userId);

        logger.info("User {} is following {} users", userId, following.size());
        return new ResponseEntity<>(following, HttpStatus.OK);
    }
}
