package com.mit.VarnaVerse.ContentService.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mit.VarnaVerse.ContentService.Services.*;
import com.mit.VarnaVerse.ContentService.Payloads.CommentResponseDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostResponseDTO;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // --- Core CRUD ---

    // API: POST /posts
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostCreateDTO postCreateDTO) {
        // Placeholder for user ID (In a real app, get from security context)
        Long userId = 1L; 
        PostResponseDTO newPost = postService.createPost(postCreateDTO, userId);
        return new ResponseEntity<>(newPost, HttpStatus.CREATED);
    }

    // API: GET /posts/{postId}
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long postId) {
        PostResponseDTO post = postService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    // API: PUT /posts/{postId}
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> updatePost(@PathVariable Long postId, @RequestBody PostCreateDTO postUpdateDTO) {
        Long userId = 1L; 
        PostResponseDTO updatedPost = postService.updatePost(postId, postUpdateDTO, userId);
        return ResponseEntity.ok(updatedPost);
    }

    // API: DELETE /posts/{postId}
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        Long userId = 1L; 
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }
    
    // --- Retrieval and Filtering ---
    
    // API: GET /posts (and /posts/filter?category=&sort=)
    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort) {
        
        // Handling both /posts and /posts/filter
        if (category != null || sort != null) {
            return ResponseEntity.ok(postService.getAllPosts(category, sort));
        }
        return ResponseEntity.ok(postService.getAllPosts(null, "latest")); // Default
    }

    // API: GET /posts/trending
    @GetMapping("/trending")
    public ResponseEntity<List<PostResponseDTO>> getTrendingPosts() {
        List<PostResponseDTO> trendingPosts = postService.getTrendingPosts();
        return ResponseEntity.ok(trendingPosts);
    }

    // API: GET /search?query= (Handled here as it primarily searches posts)
    @GetMapping("/search")
    public ResponseEntity<List<PostResponseDTO>> searchPosts(@RequestParam String query) {
        // In a real app, this would be more complex and might involve a dedicated SearchController or User search.
        List<PostResponseDTO> results = postService.searchPosts(query);
        return ResponseEntity.ok(results);
    }

    // --- Interaction Endpoints ---

    // API: POST /posts/{postId}/like
    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long postId) {
        Long userId = 1L; 
        postService.toggleLike(postId, userId);
        return ResponseEntity.ok().build();
    }

    // API: POST /posts/{postId}/comment
    @PostMapping("/{postId}/comment")
    public ResponseEntity<Void> addComment(@PathVariable Long postId, @RequestBody Map<String, String> commentData) {
        Long userId = 1L; 
        String text = commentData.get("text");
        if (text == null) return ResponseEntity.badRequest().build();
        
        postService.addComment(postId, userId, text);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // API: GET /posts/{postId}/comments
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long postId) {
        List<CommentResponseDTO> comments = postService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // API: POST /posts/{postId}/rate
    @PostMapping("/{postId}/rate")
    public ResponseEntity<Void> ratePost(@PathVariable Long postId, @RequestBody Map<String, Integer> ratingData) {
        Long userId = 1L; 
        Integer rating = ratingData.get("ratingValue");
        if (rating == null || rating < 1 || rating > 5) return ResponseEntity.badRequest().build();
        
        postService.ratePost(postId, userId, rating);
        return ResponseEntity.ok().build();
    }
}