package com.mit.VarnaVerse.ContentService.Repository;



import com.mit.VarnaVerse.ContentService.Entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // API: GET /posts/filter?category=&sort=
    List<Post> findByCategory(String category);

    // API: GET /posts/trending (Simplified: find top 10 by likes_count)
    List<Post> findTop10ByOrderByLikesCountDesc();

    // API: GET /posts/filter?category=&sort= (Top-rated)
    List<Post> findTop10ByOrderByRatingAvgDesc();

    // API: GET /search?query=
    List<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String titleQuery, String contentQuery);
}