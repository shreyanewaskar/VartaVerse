package com.mit.VarnaVerse.ContentService.Services.Impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mit.VarnaVerse.ContentService.Entity.Post;
import com.mit.VarnaVerse.ContentService.Exception.ResourceNotFoundException;
import com.mit.VarnaVerse.ContentService.Payloads.CommentResponseDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostResponseDTO;
import com.mit.VarnaVerse.ContentService.Repository.PostRepository;
import com.mit.VarnaVerse.ContentService.Services.PostService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    // --- Core CRUD ---

    @Override
    public PostResponseDTO createPost(PostCreateDTO postCreateDTO, Long userId) {
        Post post = new Post();
        // Assume mapping from DTO to Entity
        post.setUserId(userId);
        post.setTitle(postCreateDTO.getTitle());
        post.setContent(postCreateDTO.getContent());
        post.setCategory(postCreateDTO.getCategory());
        post.setLikesCount(0); // Initialize
        post.setRatingAvg((float) 0.0); // Initialize

        Post savedPost = postRepository.save(post);
        // Assume mapping from Entity to ResponseDTO
        return new PostResponseDTO(savedPost);
    }

    @Override
    public PostResponseDTO getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        return new PostResponseDTO(post);
    }

    // --- Retrieval and Filtering ---

    @Override
    public List<PostResponseDTO> getAllPosts(String category, String sort) {
        List<Post> posts;

        if (category != null && !category.isEmpty()) {
            posts = postRepository.findByCategory(category);
        } else if ("top-rated".equalsIgnoreCase(sort)) {
            posts = postRepository.findTop10ByOrderByRatingAvgDesc(); // Top-rated logic
        } else { // Default to latest
            posts = postRepository.findAll(); // Simple, real-world would use Pageable
        }

        return posts.stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponseDTO> getTrendingPosts() {
        List<Post> posts = postRepository.findTop10ByOrderByLikesCountDesc();
        return posts.stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostResponseDTO> searchPosts(String query) {
        List<Post> posts = postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query);
        return posts.stream()
                .map(PostResponseDTO::new)
                .collect(Collectors.toList());
    }

    // --- Update/Delete/Interactions ---

    @Override
    public PostResponseDTO updatePost(Long postId, PostCreateDTO postUpdateDTO, long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found."));

        post.setTitle(postUpdateDTO.getTitle());
        post.setContent(postUpdateDTO.getContent());
        post.setCategory(postUpdateDTO.getCategory());

        Post updatedPost = postRepository.save(post);
        return new PostResponseDTO(updatedPost);
    }

    @Override
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found."));

       
        postRepository.delete(post);
    }

    @Override
    public void toggleLike(Long postId, Long userId) {
        // Implementation would involve checking a 'Like' repository table.
        // Simplified: If liked, decrement; else, increment.
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found."));
        // Assuming a simpler logic for demonstration: always increment for this basic structure.
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
    }

    @Override
    public void addComment(Long postId, Long userId, String commentText) {
        // Implementation would involve creating a new 'Comment' entity and saving it.
        // Omitted: CommentRepository/Entity logic.
        getPostById(postId); // Ensures post exists
        System.out.println("Comment added to post " + postId);
    }

    @Override
    public List<CommentResponseDTO> getCommentsByPostId(Long postId) {
        // Implementation would involve fetching comments from the CommentRepository.
        getPostById(postId); // Ensures post exists
        return List.of(new CommentResponseDTO("Dummy Comment 1"), new CommentResponseDTO("Dummy Comment 2"));
    }

    @Override
    public void ratePost(Long postId, Long userId, int ratingValue) {
        // Implementation would involve saving a 'Rating' entity and recalculating the post's rating_avg.
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found."));
        
        // Simplified avg recalculation (In real life, this needs to check existing rating and update)
        post.setRatingAvg((post.getRatingAvg() + ratingValue) / 2); 
        postRepository.save(post);
    }
}