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
    
    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponseDTO> getCommentsByPost(@PathVariable Long postId) {
        return postService.getCommentsByPostId(postId);
    }


    
    // ---------------------- RATE POST ----------------------
    @PostMapping("/{postId}/rate")
    public ResponseEntity<Void> ratePost(@PathVariable Long postId, @RequestBody Map<String, Integer> ratingData) {
        Long userId = getUserIdFromUserService();
        Integer rating = ratingData.get("ratingValue");
        if (rating == null || rating < 1 || rating > 5) return ResponseEntity.badRequest().build();

        postService.ratePost(postId, userId, rating);
        return ResponseEntity.ok().build();
        
    }
    
    private final String OMDB_API_KEY = "2095c90f"; // your key
    private final String OMDB_BASE_URL = "http://www.omdbapi.com/";

    @GetMapping("/movies/search")
    public ResponseEntity<String> searchMovies(@RequestParam String title) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = OMDB_BASE_URL + "?s=" + title + "&apikey=" + OMDB_API_KEY;
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\":\"Failed to fetch movies\"}");
        }
    }
    @GetMapping("/movies/default")
    public ResponseEntity<String> getDefaultMovies() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            StringBuilder allMovies = new StringBuilder();
            allMovies.append("{\"Search\": [");

            // Example: Use 5 popular keywords and 10 movies per page -> 50 movies
            String[] keywords = {"Avengers", "Batman", "Spider", "Star", "Harry"};
            boolean first = true;

            for (String keyword : keywords) {
                for (int page = 1; page <= 2; page++) { // 2 pages per keyword = 20 movies per keyword
                    String url = OMDB_BASE_URL + "?s=" + keyword + "&page=" + page + "&apikey=" + OMDB_API_KEY;
                    String response = restTemplate.getForObject(url, String.class);

                    // Extract movies array from response
                    String moviesArray = response.substring(response.indexOf("[") + 1, response.lastIndexOf("]"));

                    if (!moviesArray.trim().isEmpty()) {
                        if (!first) {
                            allMovies.append(",");
                        }
                        allMovies.append(moviesArray);
                        first = false;
                    }
                }
            }

            allMovies.append("]}");

            return ResponseEntity.ok(allMovies.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\":\"Failed to fetch default movies\"}");
        }
    }
    private final String GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=";
    @GetMapping("/shows/default")
    public ResponseEntity<String> getDefaultBooks() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            StringBuilder allBooks = new StringBuilder();
            allBooks.append("{\"books\": [");

            String[] keywords = {"Harry Potter", "Avengers", "Star Wars", "Batman", "Lord of the Rings"};
            boolean first = true;
            int count = 0;

            for (String keyword : keywords) {
                String url = GOOGLE_BOOKS_API + keyword + "&maxResults=10";
                String response = restTemplate.getForObject(url, String.class);

                // Extract "items" array manually
                int start = response.indexOf("\"items\": [");
                if (start != -1) {
                    int end = response.indexOf("]", start);
                    if (end != -1) {
                        String itemsArray = response.substring(start + 10, end); // extract content between [ ]
                        String[] items = itemsArray.split("\\},\\{"); // split individual books

                        for (String item : items) {
                            if (!item.startsWith("{")) item = "{" + item;
                            if (!item.endsWith("}")) item = item + "}";

                            if (!first) allBooks.append(",");
                            allBooks.append(item);
                            first = false;
                            count++;
                            if (count >= 50) break;
                        }
                    }
                }

                if (count >= 50) break;
            }

            allBooks.append("]}");
            return ResponseEntity.ok(allBooks.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\":\"Failed to fetch default books\"}");
        }
    }
    // Get movie details by IMDb ID
    @GetMapping("/{imdbId}")
    public ResponseEntity<String> getMovieDetails(@PathVariable String imdbId) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = OMDB_BASE_URL + "?i=" + imdbId + "&apikey=" + OMDB_API_KEY;
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\":\"Failed to fetch movie details\"}");
        }
    }

    // Add a comment for a movie
    @PostMapping("/{imdbId}/comments")
    public ResponseEntity<String> addComment(
            @PathVariable String imdbId,
            @RequestBody Map<String, String> commentData
    ) {
        String comment = commentData.get("comment");
        // Store comment in DB or in-memory map
        // Example: commentService.addComment(imdbId, comment);
        return ResponseEntity.ok("{\"message\":\"Comment added successfully\"}");
    }

    // Get comments for a movie
    @GetMapping("/{imdbId}/comments")
    public ResponseEntity<List<String>> getComments(@PathVariable String imdbId) {
        // Example: List<String> comments = commentService.getComments(imdbId);
        List<String> comments = new ArrayList<>(); // placeholder
        return ResponseEntity.ok(comments);
    }
    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sort
    ) {
        List<PostResponseDTO> posts = postService.getAllPosts(category, sort);
        return ResponseEntity.ok(posts);
    }
}





