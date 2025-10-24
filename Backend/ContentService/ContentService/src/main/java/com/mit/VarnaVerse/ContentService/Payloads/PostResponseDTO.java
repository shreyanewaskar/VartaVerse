package com.mit.VarnaVerse.ContentService.Payloads;


import com.mit.VarnaVerse.ContentService.Entity.Post; // Assuming you have a Post model

import java.time.LocalDate;;

public class PostResponseDTO {
  
	private Long postId;
    private Long userId; // Author ID
    private String title;
    private String content;
    private String category;
    private Double ratingAvg;
    private Integer likesCount;
    private LocalDate createdAt;
    private LocalDate updatedAt;
	
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
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public Double getRatingAvg() {
		return ratingAvg;
	}
	public void setRatingAvg(Double ratingAvg) {
		this.ratingAvg = ratingAvg;
	}
	public Integer getLikesCount() {
		return likesCount;
	}
	public void setLikesCount(Integer likesCount) {
		this.likesCount = likesCount;
	}
	public LocalDate getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}
	public LocalDate getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDate updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	
	
	public PostResponseDTO(Post post) {
		this.postId = post.getPostId();
		this.userId = post.getUserId();
		this.title = post.getTitle();
		this.content = post.getContent();
		this.category = post.getCategory();
		this.ratingAvg = (double) post.getRatingAvg();
		this.likesCount =(int) post.getLikesCount();
		this.createdAt = post.getCreatedAt();
		this.updatedAt = post.getUpdatedAt();
	}
	public PostResponseDTO(Long postId, Long userId, String title, String content, String category, Double ratingAvg,
			Integer likesCount, LocalDate createdAt, LocalDate updatedAt) {
		super();
		this.postId = postId;
		this.userId = userId;
		this.title = title;
		this.content = content;
		this.category = category;
		this.ratingAvg = ratingAvg;
		this.likesCount = likesCount;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
    
	 public PostResponseDTO() {
			super();
			// TODO Auto-generated constructor stub
		}
}