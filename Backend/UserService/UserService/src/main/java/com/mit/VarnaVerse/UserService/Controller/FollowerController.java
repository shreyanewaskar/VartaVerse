package com.mit.VarnaVerse.UserService.Controller;

import com.mit.VarnaVerse.UserService.Entities.Follower;
import com.mit.VarnaVerse.UserService.Service.FollowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class FollowerController {

    private final FollowerService followerService;

    // Placeholder for the currently authenticated user's ID. 
    // In a real app, this comes from Spring Security.
    private static final long CURRENT_USER_ID = 1L; 

    @Autowired
    public FollowerController(FollowerService followerService) {
        this.followerService = followerService;
    }

    /**
     * POST /users/follow/{targetId}
     * Follow another user.
     */
    @PostMapping("/follow/{targetId}")
    public ResponseEntity<Follower> followUser(@PathVariable long targetId) {
        try {
            Follower follower = followerService.followUser(CURRENT_USER_ID, targetId);
            return new ResponseEntity<>(follower, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Handle self-follow or other business logic errors
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // General error
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * POST /users/unfollow/{targetId}
     * Unfollow a user.
     */
    @PostMapping("/unfollow/{targetId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable long targetId) {
        // In a real app, you might check if the unfollow was successful
        followerService.unfollowUser(CURRENT_USER_ID, targetId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content is standard for successful deletion/unfollow
    }

    /**
     * GET /users/followers/{userId}
     * Retrieves the list of followers for a user.
     */
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<Follower>> getFollowers(@PathVariable long userId) {
        List<Follower> followers = followerService.getFollowers(userId);
        return new ResponseEntity<>(followers, HttpStatus.OK);
    }

    /**
     * GET /users/following/{userId}
     * Retrieves the list of users that a person follows.
     */
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<Follower>> getFollowing(@PathVariable long userId) {
        List<Follower> following = followerService.getFollowing(userId);
        return new ResponseEntity<>(following, HttpStatus.OK);
    }
}