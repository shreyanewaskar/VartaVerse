package com.mit.VarnaVerse.UserService.Serivce.Impl;

import com.mit.VarnaVerse.UserService.Entities.Follower;

import com.mit.VarnaVerse.UserService.Repository.FollowerRepository;
import com.mit.VarnaVerse.UserService.Service.FollowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class FollowerServiceImpl implements FollowerService {

    private final FollowerRepository followerRepository;

    @Autowired
    public FollowerServiceImpl(FollowerRepository followerRepository) {
        this.followerRepository = followerRepository;
    }

    @Override
    public Follower followUser(long followerId, long targetId) {
        // Prevent self-following
        if (followerId == targetId) {
            // In a real app, you might throw a custom exception
            throw new IllegalArgumentException("Cannot follow yourself.");
        }

        // Check if relationship already exists
        Optional<Follower> existingFollow = followerRepository.findByFollowerIdAndFollowingId(followerId, targetId);

        if (existingFollow.isPresent()) {
            // Relationship already exists, return it or throw an exception
            return existingFollow.get();
        }

        // Create new relationship
        Follower newFollower = new Follower();
        newFollower.setFollowerId(followerId);
        newFollower.setFollowingId(targetId);
        
        // Note: The createdAt will be set by @CreationTimestamp
        return followerRepository.save(newFollower);
    }

    @Override
    @Transactional // Ensures the delete operation is atomic
    public void unfollowUser(long followerId, long targetId) {
        // In a real app, you would check if the relationship exists 
        // and throw a Not Found exception if not.
        
        followerRepository.deleteByFollowerIdAndFollowingId(followerId, targetId);
    }

    @Override
    public List<Follower> getFollowers(long userId) {
        return followerRepository.findAllByFollowingId(userId);
    }

    @Override
    public List<Follower> getFollowing(long userId) {
        return followerRepository.findAllByFollowingId(userId);
    }

}