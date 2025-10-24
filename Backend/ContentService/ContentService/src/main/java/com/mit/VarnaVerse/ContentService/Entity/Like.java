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


//like_id, post_id, user_id, created_at
@Entity
@Table(name="likes")
public class Like {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private long likeId;
	
	@Column(nullable=false)
	private long post_id;
	
	@Column(nullable=false)
	private long user_id;
	
	@CreationTimestamp 
	@Column(nullable = false)
	private LocalDate createdAt;
	
	@UpdateTimestamp
	@Column(nullable = false)
	private LocalDate updatedAt;
}
