package com.mit.VarnaVerse.ContentService.Payloads;

import java.time.LocalDateTime;

public class CommentResponseDTO {
    private Long commentId;
    private Long postId;
    private Long userId; // Commenter ID
    private String text;
    private LocalDateTime createdAt;

    // Dummy Constructor used in PostServiceImpl
    public CommentResponseDTO(String text) {
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }

    // Full Constructor (from Comment Entity)
    public CommentResponseDTO(Long commentId, Long postId, Long userId, String text, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.text = text;
        this.createdAt = createdAt;
    }

}