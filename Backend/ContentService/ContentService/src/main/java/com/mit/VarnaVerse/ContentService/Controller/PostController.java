package com.mit.VarnaVerse.ContentService.Controller;

import com.mit.VarnaVerse.ContentService.Client.UserClient;
import com.mit.VarnaVerse.ContentService.Payloads.CommentCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.CommentResponseDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostResponseDTO;
import com.mit.VarnaVerse.ContentService.Services.PostService;
import com.mit.VarnaVerse.ContentService.Services.Impl.MovieService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserClient userClient;   // Feign Client for UserService

    // ---------------------- HELPER: Get User ID from UserService ----------------------
    private Long getUserIdFromUserService() {
        // Pass null because Feign interceptor automatically injects JWT
        return userClient.getCurrentUser(null).getId();
    }

    // ---------------------- CREATE POST ----------------------
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostCreateDTO postCreateDTO) {
        Long userId = getUserIdFromUserService();
        PostResponseDTO newPost = postService.createPost(postCreateDTO, userId);
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    // ---------------------- GET POST BY ID ----------------------
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long postId) {
        PostResponseDTO post = postService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    // ---------------------- UPDATE POST ----------------------
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> updatePost(@PathVariable Long postId, @RequestBody PostCreateDTO postUpdateDTO) {
        Long userId = getUserIdFromUserService();
        PostResponseDTO updatedPost = postService.updatePost(postId, postUpdateDTO, userId);
        return ResponseEntity.ok(updatedPost);
    }

    // ---------------------- DELETE POST ----------------------
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        Long userId = getUserIdFromUserService();
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    // ---------------------- GET ALL POSTS ----------------------
    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {

        if (category != null || sort != null) {
            return ResponseEntity.ok(postService.getAllPosts(category, sort));
        }
        return ResponseEntity.ok(postService.getAllPosts(null, "latest")); // Default
    }

    // ---------------------- TRENDING POSTS ----------------------
    @GetMapping("/trending")
    public ResponseEntity<List<PostResponseDTO>> getTrendingPosts() {
        List<PostResponseDTO> trendingPosts = postService.getTrendingPosts();
        return ResponseEntity.ok(trendingPosts);
    }

    // ---------------------- SEARCH POSTS ----------------------
    @GetMapping("/search")
    public ResponseEntity<List<PostResponseDTO>> searchPosts(@RequestParam String query) {
        List<PostResponseDTO> results = postService.searchPosts(query);
        return ResponseEntity.ok(results);
    }

    // ---------------------- LIKE / UNLIKE ----------------------
    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long postId) {
        Long userId = getUserIdFromUserService();
        postService.toggleLike(postId, userId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{postId}/likes")
    public ResponseEntity<Long> getLikes(@PathVariable Long postId) {
        long likes = postService.getLikesCount(postId);
        return ResponseEntity.ok(likes);
    }

    // ---------------------- ADD COMMENT ----------------------
  

    // Add a comment
    @PostMapping("/{postId}/comment")
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable Long postId,
            @RequestBody CommentCreateDTO commentDTO
    ) {
        Long userId = getUserIdFromUserService(); // replace with actual logic
        if (commentDTO.getText() == null || commentDTO.getText().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        CommentResponseDTO savedComment = postService.addComment(postId, userId, commentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    // Get comments count
    @GetMapping("/{postId}/comments/count")
    public ResponseEntity<Long> getCommentsCount(@PathVariable Long postId) {
        long count = postService.getCommentsCount(postId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/{postId}/comments")
    public List<CommentResponseDTO> getCommentsByPost(@PathVariable Long postId) {
        return postService.getCommentsByPostId(postId);
    }


    
    // ---------------------- RATE POST ----------------------
    @PostMapping("/{postId}/rate")
    public ResponseEntity<Void> ratePost(@PathVariable Long postId,@RequestBody Map<String, Integer> ratingData) {
        Integer rating = ratingData.get("ratingValue");
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().build();
        }

        Long userId = getUserIdFromUserService();   // ✅ REAL userId
        postService.ratePost(postId, userId, rating);

        return ResponseEntity.ok().build();
    }
 // Get average rating for a post
    @GetMapping("/{postId}/rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long postId) {
        Double avgRating = postService.getAverageRating(postId);
        return ResponseEntity.ok(avgRating);
    }

    // Get rating of current user for a post
    @GetMapping("/{postId}/rating/user")
    public ResponseEntity<Integer> getUserRating(@PathVariable Long postId) {
        Long userId = getUserIdFromUserService(); // fetch user from JWT
        Integer rating = postService.getUserRating(postId, userId);
        return ResponseEntity.ok(rating); // will return 3 if user hasn't rated
    }
 
       
 
}





