package com.mit.VarnaVerse.ContentService.Entity;
//comment_id, post_id, user_id, text, created_at

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
@Table(name="comments")
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private long commentId;
	
	@Column(nullable=false)
	private long post_id;
	
	@Column(nullable=false)
	private long user_id;
	
	@Column(nullable=false,columnDefinition="TEXT")
	private String ratingText;
	
	@CreationTimestamp 
	@Column(nullable = false)
	private LocalDate createdAt;
	
	@UpdateTimestamp
	@Column(nullable = false)
	private LocalDate updatedAt;
	
}
