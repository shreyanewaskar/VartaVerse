package com.mit.VarnaVerse.ContentService.Payloads;

import java.time.LocalDateTime;

public class CommentResponseDTO {
    private Long commentId;
    private Long postId;
    private Long userId; // Commenter ID
    private String text; // Comment content
    private LocalDateTime createdAt;

    // Constructor for just text (optional)
    public CommentResponseDTO(String text) {
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }

    // Full constructor from entity
    public CommentResponseDTO(Long commentId, Long postId, Long userId, String text, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.postId = postId;
        this.userId = userId;
        this.text = text;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
