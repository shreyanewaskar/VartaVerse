package com.mit.VarnaVerse.ContentService.Entity;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue; // Correct annotation for auto-generation
import jakarta.persistence.GenerationType; // Strategy type for auto-generation

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


//rating_id, post_id, user_id, rating_value (1–5), created_at
@Entity
@Table(name = "ratings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}))
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "rating_value", nullable = false)
    private Integer ratingValue;   

    @CreationTimestamp
    private LocalDate createdAt;

    @UpdateTimestamp
    private LocalDate updatedAt;

	public Long getRatingId() {
		return ratingId;
	}

	public void setRatingId(Long ratingId) {
		this.ratingId = ratingId;
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

	public Integer getRatingValue() {
		return ratingValue;
	}

	public void setRatingValue(Integer ratingValue) {
		this.ratingValue = ratingValue;
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

	/**
	 * @param ratingId
	 * @param postId
	 * @param userId
	 * @param ratingValue
	 * @param createdAt
	 * @param updatedAt
	 */
	public Rating(Long ratingId, Long postId, Long userId, Integer ratingValue, LocalDate createdAt,
			LocalDate updatedAt) {
		super();
		this.ratingId = ratingId;
		this.postId = postId;
		this.userId = userId;
		this.ratingValue = ratingValue;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	/**
	 * 
	 */
	public Rating() {
		super();
		// TODO Auto-generated constructor stub
	}

    // getters & setters
    
}

