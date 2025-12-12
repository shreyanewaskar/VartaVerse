package com.mit.VarnaVerse.ContentService.Controller;

import com.mit.VarnaVerse.ContentService.Client.UserClient;
import com.mit.VarnaVerse.ContentService.Payloads.CommentResponseDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostResponseDTO;
import com.mit.VarnaVerse.ContentService.Security.JwtUtil;
import com.mit.VarnaVerse.ContentService.Services.PostService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserClient userClient;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromUserService() {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        var user = userClient.getCurrentUser(authHeader);
        return user.getId();
    }

    // ---------------------- CREATE POST (NO AUTH REQUIRED) ----------------------
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody PostCreateDTO postCreateDTO) {
        // Hardcoded userId for testing - no authentication required
        Long userId = 1L;
        PostResponseDTO savedPost = postService.createPost(postCreateDTO, userId);
        return ResponseEntity.ok(savedPost);
    }

    // ---------------------- GET POST BY ID ----------------------
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    // ---------------------- UPDATE POST ----------------------
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> updatePost(
            @PathVariable Long postId,
            @RequestBody PostCreateDTO postCreateDTO) {
        Long userId = getUserIdFromUserService();
        PostResponseDTO updated = postService.updatePost(postId, postCreateDTO, userId);
        return ResponseEntity.ok(updated);
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
        return ResponseEntity.ok(postService.getAllPosts(category, sort));
    }

    // ---------------------- TRENDING POSTS ----------------------
    @GetMapping("/trending")
    public ResponseEntity<List<PostResponseDTO>> getTrendingPosts() {
        return ResponseEntity.ok(postService.getTrendingPosts());
    }

    // ---------------------- SEARCH POSTS ----------------------
    @GetMapping("/search")
    public ResponseEntity<List<PostResponseDTO>> searchPosts(@RequestParam String query) {
        return ResponseEntity.ok(postService.searchPosts(query));
    }

    // ---------------------- LIKE / UNLIKE ----------------------
    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long postId) {
        Long userId = getUserIdFromUserService();
        postService.toggleLike(postId, userId);
        return ResponseEntity.ok().build();
    }

    // ---------------------- ADD COMMENT ----------------------
    @PostMapping("/{postId}/comment")
    public ResponseEntity<Void> addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> payload) {
        Long userId = getUserIdFromUserService();
        String text = payload.get("text");
        if (text == null || text.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        postService.addComment(postId, userId, text);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ---------------------- GET COMMENTS (NO AUTH REQUIRED) ----------------------
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long postId) {
        // No authentication required for reading comments
        return ResponseEntity.ok(postService.getCommentsByPostId(postId));
    }

    // ---------------------- RATE POST ----------------------
    @PostMapping("/{postId}/rate")
    public ResponseEntity<Void> ratePost(
            @PathVariable Long postId,
            @RequestBody Map<String, Integer> payload) {
        Long userId = getUserIdFromUserService();
        Integer rating = payload.get("ratingValue");
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().build();
        }
        postService.ratePost(postId, userId, rating);
        return ResponseEntity.ok().build();
    }
}