package com.mit.VarnaVerse.ContentService.Services;

import java.util.List;

import com.mit.VarnaVerse.ContentService.Payloads.CommentResponseDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostResponseDTO;

public interface PostService {

    // API: POST /posts - Creates a new post
    PostResponseDTO createPost(PostCreateDTO postCreateDTO, Long userId);

    // API: GET /posts - Retrieves all posts (with filtering/sorting logic)
    List<PostResponseDTO> getAllPosts(String category, String sort);

    // API: GET /posts/{postId} - Retrieves a single post
    PostResponseDTO getPostById(Long postId);

    // API: PUT /posts/{postId} - Edits a post
    PostResponseDTO updatePost(Long postId, PostCreateDTO postUpdateDTO, long userId);

    // API: DELETE /posts/{postId} - Deletes a post
    void deletePost(Long postId, Long userId);

    // API: POST /posts/{postId}/like - Likes or unlikes a post
    void toggleLike(Long postId, Long userId);

    // API: POST /posts/{postId}/comment - Adds a comment
    void addComment(Long postId, Long userId, String commentText);

    // API: GET /posts/{postId}/comments - Retrieves all comments on a post
    List<CommentResponseDTO> getCommentsByPostId(Long postId);

    // API: POST /posts/{postId}/rate - Rates a post
    void ratePost(Long postId, Long userId, int ratingValue);

    // API: GET /posts/trending - Fetches trending posts
    List<PostResponseDTO> getTrendingPosts();

    // API: GET /search?query= - Searches posts
    List<PostResponseDTO> searchPosts(String query);
}