import { userClient, apiCall, logger, TokenManager } from './api-client';
import {
  User,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  FollowersResponse,
  FollowingResponse,
} from './types';

export const userApi = {
  // Authentication
  async register(data: RegisterRequest): Promise<User> {
    TokenManager.removeToken();
    logger.info('Registering user', { email: data.email });

    // Ensure required fields are present
    const registerData = {
      ...data,
      bio: data.bio || '',
      phoneNumber: data.phoneNumber || ''
    };

    return apiCall<User>(userClient, {
      method: 'POST',
      url: '/users/register',
      data: registerData,
    }, false);
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    logger.info('Logging in user', { email: data.email });
    return apiCall<LoginResponse>(userClient, {
      method: 'POST',
      url: '/users/login',
      data,
    }, false);
  },

  // Profile Management
  async getMe(): Promise<User> {
    logger.info('Fetching current user profile');
    return apiCall<User>(userClient, {
      method: 'GET',
      url: '/users/me',
    });
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    logger.info('Updating user profile', data);
    return apiCall<User>(userClient, {
      method: 'PUT',
      url: '/users/update',
      data,
    });
  },

  async deleteAccount(): Promise<User> {
    logger.info('Deleting user account');
    return apiCall<User>(userClient, {
      method: 'DELETE',
      url: '/users/delete',
    });
  },

  async getUserById(id: string): Promise<User> {
    logger.info('Fetching user by ID', { id });
    try {
      return await apiCall<User>(userClient, {
        method: 'GET',
        url: `/users/${id}`,
      });
    } catch (error) {
      logger.error('Get user by ID failed', error);
      throw new Error('User not found or endpoint not available');
    }
  },

  // Social Features - These endpoints may not be implemented yet
  async getFollowers(userId: string): Promise<FollowersResponse> {
    logger.info('Fetching followers', { userId });
    const followers = await apiCall<any[]>(userClient, {
      method: 'GET',
      url: `/users/followers/${userId}`,
    });
    return { followers, count: followers.length };
  },

  async getFollowing(userId: string): Promise<FollowingResponse> {
    logger.info('Fetching following', { userId });
    const following = await apiCall<any[]>(userClient, {
      method: 'GET',
      url: `/users/following/${userId}`,
    });
    return { following, count: following.length };
  },

  async followUser(targetId: string): Promise<void> {
    logger.info('Following user', { targetId });
    try {
      const result = await apiCall<any>(userClient, {
        method: 'POST',
        url: `/users/follow/${targetId}`,
      });
      console.log('Follow API result:', result);
      return result;
    } catch (error) {
      logger.error('Follow endpoint failed', error);
      throw error;
    }
  },

  async unfollowUser(targetId: string): Promise<void> {
    logger.info('Unfollowing user', { targetId });
    try {
      const result = await apiCall<any>(userClient, {
        method: 'POST',
        url: `/users/unfollow/${targetId}`,
      });
      console.log('Unfollow API result:', result);
      return result;
    } catch (error) {
      logger.error('Unfollow endpoint failed', error);
      throw error;
    }
  },

  async isFollowing(targetId: string): Promise<boolean> {
    logger.info('Checking follow status', { targetId });
    try {
      const currentUser = await this.getMe();
      const following = await this.getFollowing(currentUser.id.toString());
      console.log('Following data:', following.following);
      console.log('Target ID to check:', targetId);
      
      const isFollowing = following.following.some(f => {
        console.log('Checking follower object:', f);
        return f.followingId === parseInt(targetId) || 
               f.targetId === parseInt(targetId) ||
               String(f.followingId) === targetId ||
               String(f.targetId) === targetId ||
               f.followerId === parseInt(targetId) ||
               String(f.followerId) === targetId;
      });
      
      console.log('Is following result:', isFollowing);
      return isFollowing;
    } catch (error) {
      logger.error('Failed to check follow status', error);
      return false;
    }
  },

  // Password Reset
  async forgotPassword(data: ForgotPasswordRequest): Promise<string> {
    logger.info('Requesting password reset', { email: data.email });
    return apiCall<string>(userClient, {
      method: 'POST',
      url: '/forgot-password',
      data,
    }, false);
  },

  async resetPassword(email: string, newPassword: string): Promise<string> {
    logger.info('Resetting password', { email });
    return apiCall<string>(userClient, {
      method: 'POST',
      url: `/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`,
    }, false);
  },

  async getAllUsers(): Promise<User[]> {
    logger.info('Fetching all users');
    return apiCall<User[]>(userClient, {
      method: 'GET',
      url: '/getusers',
    });
  },

  async deleteUserById(userId: string): Promise<void> {
    logger.info('Deleting user by ID', { userId });
    return apiCall<void>(userClient, {
      method: 'DELETE',
      url: `/users/${userId}`,
    });
  },
};