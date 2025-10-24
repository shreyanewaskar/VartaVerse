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


//rating_id, post_id, user_id, rating_value (1–5), created_at
@Entity
@Table(name="ratings")
public class Rating {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) 
	private long ratingId;
	
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
