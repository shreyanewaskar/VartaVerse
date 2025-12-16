package com.mit.VarnaVerse.ContentService.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mit.VarnaVerse.ContentService.Entity.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByPostIdAndUserId(Long postId, Long userId);

    List<Rating> findByPostId(Long postId);
}
