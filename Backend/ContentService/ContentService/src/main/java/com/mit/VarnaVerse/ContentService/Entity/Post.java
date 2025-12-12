package com.mit.VarnaVerse.ContentService.Entity;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue; // Correct annotation for auto-generation
import jakarta.persistence.GenerationType; // Strategy type for auto-generation

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


@Entity
@Table(name="posts")
public class Post { 
//	post_id, user_id, title, content, category, rating_avg, likes_count, created_at, updated_at
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private long postId; 
	
	@Column(nullable = false) 
	private long userId; 
	
	@Column(nullable = false)
	private String title;
	
	@Column(nullable = false, columnDefinition = "TEXT") 
	private String content;
	
	@Column(nullable = false)
	private String category;
	
	@Column(nullable = true)
	private float ratingAvg = 0.0f; 
	
	@Column(nullable = true)
	private long likesCount = 0L; 
	
	@CreationTimestamp 
	@Column(nullable = false)
	private LocalDate createdAt;
	
	@UpdateTimestamp
	@Column(nullable = true)
	private LocalDate updatedAt;

	public long getPostId() {
		return postId;
	}

	public void setPostId(long postId) {
		this.postId = postId;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
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

	public float getRatingAvg() {
		return ratingAvg;
	}

	public void setRatingAvg(float ratingAvg) {
		this.ratingAvg = ratingAvg;
	}

	public long getLikesCount() {
		return likesCount;
	}

	public void setLikesCount(long likesCount) {
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
	
	

	public Post() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Post(long postId, long userId, String title, String content, String category, float ratingAvg,
			long likesCount, LocalDate createdAt, LocalDate updatedAt) {
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
	
	

}