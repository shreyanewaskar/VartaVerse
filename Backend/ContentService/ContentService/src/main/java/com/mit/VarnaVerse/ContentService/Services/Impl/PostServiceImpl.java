package com.mit.VarnaVerse.ContentService.Services.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mit.VarnaVerse.ContentService.Entity.Comment;
import com.mit.VarnaVerse.ContentService.Entity.Like;
import com.mit.VarnaVerse.ContentService.Entity.Post;
import com.mit.VarnaVerse.ContentService.Entity.Rating;
import com.mit.VarnaVerse.ContentService.Exception.ResourceNotFoundException;
import com.mit.VarnaVerse.ContentService.Payloads.CommentCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.CommentResponseDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostCreateDTO;
import com.mit.VarnaVerse.ContentService.Payloads.PostResponseDTO;
import com.mit.VarnaVerse.ContentService.Repository.CommentRepository;
import com.mit.VarnaVerse.ContentService.Repository.LikeRepository;
import com.mit.VarnaVerse.ContentService.Repository.PostRepository;
import com.mit.VarnaVerse.ContentService.Repository.RatingRepository;
import com.mit.VarnaVerse.ContentService.Services.PostService;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    // --- Core CRUD ---

    @Override
    public PostResponseDTO createPost(PostCreateDTO postCreateDTO, Long userId) {
        Post post = new Post();
        post.setUserId(userId);
        post.setTitle(postCreateDTO.getTitle());
        post.setContent(postCreateDTO.getContent());
        post.setCategory(postCreateDTO.getCategory());
        post.setLikesCount(0L);
        post.setRatingAvg(0.0f);

        Post savedPost = postRepository.save(post);
        return new PostResponseDTO(savedPost);
    }

    @Override
    public PostResponseDTO getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        return new PostResponseDTO(post);
    }

    @Override
    public List<PostResponseDTO> getAllPosts(String category, String sort) {
        List<Post> posts;
        if (category != null && !category.isEmpty()) {
            posts = postRepository.findByCategory(category);
        } else if ("top-rated".equalsIgnoreCase(sort)) {
            posts = postRepository.findTop10ByOrderByRatingAvgDesc();
        } else {
            posts = postRepository.findAll();
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

    // --- Like / Unlike ---
    @Override
    public void toggleLike(Long postId, Long userId) {
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found."));

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            post.setLikesCount(post.getLikesCount() - 1);
        } else {
            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(userId);
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
        }
        postRepository.save(post);
    }

    // --- Comment ---
    @Override
    public CommentResponseDTO addComment(Long postId, Long userId, CommentCreateDTO commentCreateDTO) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setText(commentCreateDTO.getText());

        Comment saved = commentRepository.save(comment);

        LocalDateTime createdAt = saved.getCreatedAt() != null ? saved.getCreatedAt().atStartOfDay() : LocalDateTime.now();
        LocalDateTime updatedAt = saved.getUpdatedAt() != null ? saved.getUpdatedAt().atStartOfDay() : LocalDateTime.now();

        return new CommentResponseDTO(
                saved.getCommentId(),
                saved.getPostId(),
                saved.getUserId(),
                saved.getText(),
                createdAt
        );
    }

    @Override
    public long getCommentsCount(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    // --- Rating ---
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Override
    public void ratePost(Long postId, Long userId, int ratingValue) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Optional<Rating> existing = ratingRepository.findByPostIdAndUserId(postId, userId);

        if (existing.isPresent()) {
            existing.get().setRatingValue(ratingValue);
            ratingRepository.save(existing.get());
        } else {
            Rating rating = new Rating();
            rating.setPostId(postId);
            rating.setUserId(userId);
            rating.setRatingValue(ratingValue);
            ratingRepository.save(rating);
        }

        double avg = ratingRepository.findByPostId(postId).stream()
                .mapToInt(Rating::getRatingValue)
                .average()
                .orElse(0.0);

        post.setRatingAvg((float) avg);
        postRepository.save(post);
    }
    
    @Override
    public boolean hasUserLikedPost(Long postId, Long userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    // --- Count ---
    @Override
    public long getLikesCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return post.getLikesCount();
    }
    
    @Override
    public List<CommentResponseDTO> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(c -> new CommentResponseDTO(
                        c.getCommentId(),
                        c.getPostId(),
                        c.getUserId(),
                        c.getText(),
                        c.getCreatedAt().atStartOfDay()
                ))
                .collect(Collectors.toList());
    }
    @Override
    public Double getAverageRating(Long postId) {
        List<Rating> ratings = ratingRepository.findByPostId(postId);
        if (ratings.isEmpty()) return 3.0; // default rating
        return ratings.stream()
                      .mapToInt(Rating::getRatingValue)
                      .average()
                      .orElse(3.0);
    }

    @Override
    public Integer getUserRating(Long postId, Long userId) {
        return ratingRepository.findByPostIdAndUserId(postId, userId)
                               .map(Rating::getRatingValue)
                               .orElse(0); // default rating
    }

}
