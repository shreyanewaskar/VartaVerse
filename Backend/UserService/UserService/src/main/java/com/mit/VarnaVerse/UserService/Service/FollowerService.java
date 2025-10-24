package com.mit.VarnaVerse.UserService.Service;

import com.mit.VarnaVerse.UserService.Entities.Follower;
import java.util.List;

public interface FollowerService {
    
    /**
     * Follow another user.
     * @param followerId The ID of the user initiating the follow (current authenticated user).
     * @param targetId The ID of the user to follow.
     * @return The created Follower entity.
     */
    Follower followUser(long followerId, long targetId);

    /**
     * Unfollow a user.
     * @param followerId The ID of the user initiating the unfollow.
     * @param targetId The ID of the user to unfollow.
     */
    void unfollowUser(long followerId, long targetId);

    /**
     * Retrieves the list of followers for a user.
     * @param userId The ID of the user whose followers are requested.
     * @return A list of Follower entities (where 'following_id' = userId).
     */
    List<Follower> getFollowers(long userId);

    /**
     * Retrieves the list of users that a person follows.
     * @param userId The ID of the user whose following list is requested.
     * @return A list of Follower entities (where 'follower_id' = userId).
     */
    List<Follower> getFollowing(long userId);
}