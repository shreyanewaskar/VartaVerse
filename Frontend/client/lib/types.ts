// User Service Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phoneNumber?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: string;
  phoneNumber?: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
  userName: string;
  userId: number;
}

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface FollowersResponse {
  followers: User[];
  count: number;
}

export interface FollowingResponse {
  following: User[];
  count: number;
}

// Content Service Types
export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  averageRating: number;
  isLiked?: boolean;
  userRating?: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface Comment {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  text: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

export interface RatePostRequest {
  ratingValue: number; // 1-5
}

export interface LikeResponse {
  isLiked: boolean;
  likesCount: number;
}

export interface RatingResponse {
  averageRating: number;
  userRating?: number;
  totalRatings: number;
}

export interface BookmarkResponse {
  isBookmarked: boolean;
  bookmarkCount: number;
}

export interface LikesResponse {
  likes: User[];
  count: number;
}

// Query Parameters
export interface PostsQuery {
  category?: string;
  sort?: 'newest' | 'oldest' | 'popular' | 'trending';
  page?: number;
  limit?: number;
}

export interface SearchQuery {
  query: string;
  category?: string;
  page?: number;
  limit?: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}