package com.mit.VarnaVerse.UserService.Repository;

import com.mit.VarnaVerse.UserService.Entities.Follower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, Long> {

    // Corrected method: Changed 'follower_id' to 'followerId'
    Optional<Follower> findByFollowerIdAndFollowingId(long followerId, long followingId); // NOTE: Changed parameter names for consistency as well.

    // Corrected method: Changed 'follower_id' to 'followerId'
    void deleteByFollowerIdAndFollowingId(long followerId, long followingId); // NOTE: Changed parameter names for consistency as well.

    // FIX: Changed 'Following_id' to 'FollowingId'
    // Retrieves the list of followers for a user (where 'followingId' = userId)
    List<Follower> findAllByFollowingId(long userId);  

    // FIX: Changed 'Follower_id' to 'FollowerId'
    // Retrieves the list of users that a person follows (where 'followerId' = userId)
    List<Follower> findAllByFollowerId(long userId);
    
  
}