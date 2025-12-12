import { contentClient, apiCall, logger } from './api-client';
import {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostsResponse,
  PostsQuery,
  SearchQuery,
  Comment,
  CreateCommentRequest,
  CommentsResponse,
  RatePostRequest,
  LikeResponse,
  RatingResponse,
  User,
  LikesResponse,
  BookmarkResponse,
} from './types';

export const contentApi = {
  // Posts Management
  async createPost(data: CreatePostRequest): Promise<Post> {
    logger.info('Creating post', { title: data.title, category: data.category });
    return apiCall<Post>(contentClient, {
      method: 'POST',
      url: '/posts',
      data,
    }, false);
  },

  async getPosts(query: PostsQuery = {}): Promise<PostsResponse> {
    logger.info('Fetching posts', query);
    const params = new URLSearchParams();
    if (query.category) params.append('category', query.category);
    if (query.sort) params.append('sort', query.sort);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    const posts = await apiCall<Post[]>(contentClient, {
      method: 'GET',
      url: `/posts?${params.toString()}`,
    });
    
    return {
      posts,
      total: posts.length,
      page: query.page || 1,
      limit: query.limit || 10
    };
  },

  async getPost(postId: string): Promise<Post> {
    logger.info('Fetching post', { postId });
    return apiCall<Post>(contentClient, {
      method: 'GET',
      url: `/posts/${postId}`,
    });
  },

  async updatePost(postId: string, data: UpdatePostRequest): Promise<Post> {
    logger.info('Updating post', { postId, ...data });
    return apiCall<Post>(contentClient, {
      method: 'PUT',
      url: `/posts/${postId}`,
      data,
    });
  },

  async deletePost(postId: string): Promise<void> {
    logger.info('Deleting post', { postId });
    return apiCall<void>(contentClient, {
      method: 'DELETE',
      url: `/posts/${postId}`,
    });
  },

  // Discovery
  async getTrendingPosts(): Promise<Post[]> {
    logger.info('Fetching trending posts');
    return apiCall<Post[]>(contentClient, {
      method: 'GET',
      url: '/posts/trending',
    });
  },

  async getPopularPosts(): Promise<Post[]> {
    logger.info('Fetching popular posts');
    return apiCall<Post[]>(contentClient, {
      method: 'GET',
      url: '/posts/popular',
    });
  },

  async getRecentPosts(): Promise<Post[]> {
    logger.info('Fetching recent posts');
    return apiCall<Post[]>(contentClient, {
      method: 'GET',
      url: '/posts/recent',
    });
  },

  async getPostsByCategory(category: string, query: PostsQuery = {}): Promise<PostsResponse> {
    logger.info('Fetching posts by category', { category, ...query });
    const params = new URLSearchParams();
    if (query.sort) params.append('sort', query.sort);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    return apiCall<PostsResponse>(contentClient, {
      method: 'GET',
      url: `/posts/category/${category}?${params.toString()}`,
    });
  },

  async searchPosts(query: SearchQuery): Promise<PostsResponse> {
    logger.info('Searching posts', query);
    const params = new URLSearchParams();
    params.append('query', query.query);
    if (query.category) params.append('category', query.category);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    return apiCall<PostsResponse>(contentClient, {
      method: 'GET',
      url: `/posts/search?${params.toString()}`,
    });
  },

  // Interactions
  async toggleLike(postId: string): Promise<LikeResponse> {
    logger.info('Toggling like', { postId });
    await apiCall<void>(contentClient, {
      method: 'POST',
      url: `/posts/${postId}/like`,
    }, false);
    // Return mock response since backend doesn't return like data
    return {
      isLiked: true,
      likesCount: 0
    };
  },

  async getLikes(postId: string): Promise<LikesResponse> {
    logger.info('Fetching post likes', { postId });
    const count = await apiCall<number>(contentClient, {
      method: 'GET',
      url: `/posts/${postId}/likes`,
    });
    return {
      likes: [],
      count: count
    };
  },

  async ratePost(postId: string, data: RatePostRequest): Promise<RatingResponse> {
    logger.info('Rating post', { postId, rating: data.ratingValue });
    await apiCall<void>(contentClient, {
      method: 'POST',
      url: `/posts/${postId}/rate`,
      data,
    }, false);
    // Return mock response since backend doesn't return rating data
    return {
      averageRating: data.ratingValue,
      userRating: data.ratingValue,
      totalRatings: 1
    };
  },

  async getRating(postId: string): Promise<RatingResponse> {
    logger.info('Fetching post rating', { postId });
    return apiCall<RatingResponse>(contentClient, {
      method: 'GET',
      url: `/posts/${postId}/rating`,
    });
  },

  async bookmarkPost(postId: string): Promise<void> {
    logger.info('Bookmarking post', { postId });
    return apiCall<void>(contentClient, {
      method: 'POST',
      url: `/posts/${postId}/bookmark`,
    }, false);
  },

  async unbookmarkPost(postId: string): Promise<void> {
    logger.info('Unbookmarking post', { postId });
    return apiCall<void>(contentClient, {
      method: 'DELETE',
      url: `/posts/${postId}/bookmark`,
    });
  },

  async getBookmarkedPosts(query: PostsQuery = {}): Promise<PostsResponse> {
    logger.info('Fetching bookmarked posts', query);
    const params = new URLSearchParams();
    if (query.category) params.append('category', query.category);
    if (query.sort) params.append('sort', query.sort);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    return apiCall<PostsResponse>(contentClient, {
      method: 'GET',
      url: `/posts/bookmarked?${params.toString()}`,
    });
  },

  // Comments
  async getComments(postId: string): Promise<CommentsResponse> {
    logger.info('Fetching comments', { postId });
    const comments = await apiCall<Comment[]>(contentClient, {
      method: 'GET',
      url: `/posts/${postId}/comments`,
    });
    return {
      comments,
      total: comments.length
    };
  },

  async addComment(postId: string, data: CreateCommentRequest): Promise<Comment> {
    logger.info('Adding comment', { postId, text: data.text.substring(0, 50) + '...' });
    return apiCall<Comment>(contentClient, {
      method: 'POST',
      url: `/posts/${postId}/comment`,
      data,
    }, false);
  },

  async updateComment(postId: string, commentId: string, data: CreateCommentRequest): Promise<Comment> {
    logger.info('Updating comment', { postId, commentId });
    return apiCall<Comment>(contentClient, {
      method: 'PUT',
      url: `/posts/${postId}/comments/${commentId}`,
      data,
    });
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    logger.info('Deleting comment', { postId, commentId });
    return apiCall<void>(contentClient, {
      method: 'DELETE',
      url: `/posts/${postId}/comments/${commentId}`,
    });
  },

  // User Posts
  async getUserPosts(userId: string, query: PostsQuery = {}): Promise<PostsResponse> {
    logger.info('Fetching user posts', { userId, ...query });
    const params = new URLSearchParams();
    if (query.category) params.append('category', query.category);
    if (query.sort) params.append('sort', query.sort);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    return apiCall<PostsResponse>(contentClient, {
      method: 'GET',
      url: `/users/${userId}/posts?${params.toString()}`,
    });
  },

  async getMyPosts(query: PostsQuery = {}): Promise<PostsResponse> {
    logger.info('Fetching my posts', query);
    const params = new URLSearchParams();
    if (query.category) params.append('category', query.category);
    if (query.sort) params.append('sort', query.sort);
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());

    return apiCall<PostsResponse>(contentClient, {
      method: 'GET',
      url: `/posts/my?${params.toString()}`,
    });
  },
};