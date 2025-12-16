import { useState, useEffect } from "react";
import { Heart, MessageCircle, Star, MoreHorizontal, Edit, Trash2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { contentApi } from "@/lib/content-api";
import { userApi } from "@/lib/user-api";
import { TokenManager } from "@/lib/api-client";
import { Post } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

function PostCard({ post, onPostDeleted, followingUsers, onFollowChange }: { 
  post: Post; 
  onPostDeleted?: () => void;
  followingUsers: Record<string, boolean>;
  onFollowChange: (userId: string, isFollowing: boolean) => void;
}) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [authorName, setAuthorName] = useState('Loading...');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isAuthenticated) {
        try {
          const token = TokenManager.getToken();
          if (token) {
            const response = await fetch('http://localhost:8083/users/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.ok) {
              const userData = await response.json();
              setCurrentUserId(userData.id?.toString());
            }
          }
        } catch (error) {
          console.error('Failed to fetch current user:', error);
        }
      }
    };
    
    fetchCurrentUser();
  }, [isAuthenticated]);
  
  const isOwner = currentUserId && post.userId && currentUserId === post.userId.toString();
  const following = followingUsers[post.userId?.toString() || ''] || false;
  
  // Debug logging
  console.log('Ownership check:', {
    currentUserId,
    postUserId: post.userId,
    postUserIdString: post.userId?.toString(),
    isOwner,
    showMenu
  });

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (post.userId) {
        try {
          const userData = await userApi.getUserById(post.userId.toString());
          setAuthorName(userData.name || userData.email || 'Anonymous');
        } catch (error) {
          console.error('Failed to fetch user name:', error);
          setAuthorName('Anonymous');
        }
      }
    };
    
    const checkLikeStatus = async () => {
      if (isAuthenticated && post.id) {
        try {
          const response = await fetch(`http://localhost:8082/posts/${post.id}/liked`, {
            headers: {
              'Authorization': `Bearer ${TokenManager.getToken()}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const isLiked = await response.json();
            setLiked(isLiked);
          }
        } catch (error) {
          console.error('Failed to check like status:', error);
        }
      }
    };
    
    const fetchCommentCount = async () => {
      if (post.id) {
        try {
          const response = await fetch(`http://localhost:8082/posts/${post.id}/comments/count`);
          if (response.ok) {
            const count = await response.json();
            setCommentsCount(count);
          }
        } catch (error) {
          console.error('Failed to fetch comment count:', error);
        }
      }
    };
    
    fetchAuthorName();
    checkLikeStatus();
    fetchCommentCount();
    
    // Set initial edit content
    setEditContent(parsedContent.text || post.content || '');
  }, [post.userId, post.content, post.id, isAuthenticated]);

  // Parse content to extract image and text
  let parsedContent = { text: post.content, imageUrl: null };
  try {
    const parsed = JSON.parse(post.content);
    if (parsed.text || parsed.imageUrl) {
      parsedContent = parsed;
    } else if (parsed.description && parsed.imageUrl) {
      // Movie content format
      parsedContent = { text: parsed.description, imageUrl: parsed.imageUrl };
    }
  } catch {
    // Content is plain text
    parsedContent = { text: post.content, imageUrl: null };
  }

  const imageData = parsedContent.imageUrl ? localStorage.getItem(parsedContent.imageUrl) : null;

  // Transform backend data to UI format
  const displayPost = {
    ...post,
    author: authorName,
    avatar: authorName[0] || 'A',
    color: 'from-media-berry-crush to-media-dark-raspberry',
    timestamp: new Date(post.createdAt || Date.now()).toLocaleDateString(),
    description: parsedContent.text,
    imageUrl: imageData,
    rating: post.averageRating || 0,
    tags: [],
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast({ title: "Please login to follow users", variant: "destructive" });
      return;
    }
    if (!post.userId) {
      toast({ title: "Invalid user ID", variant: "destructive" });
      return;
    }
    try {
      if (following) {
        await userApi.unfollowUser(post.userId.toString());
        toast({ title: "User unfollowed" });
      } else {
        await userApi.followUser(post.userId.toString());
        toast({ title: "User followed" });
      }
      onFollowChange(post.userId.toString(), !following);
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
      toast({ title: "Failed to update follow status", variant: "destructive" });
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({ title: "Please login to like posts", variant: "destructive" });
      return;
    }
    if (!post.id) {
      console.error('Post ID is missing:', post);
      toast({ title: "Invalid post ID", variant: "destructive" });
      return;
    }
    try {
      console.log('Liking post:', post.id);
      await contentApi.toggleLike(post.id.toString());
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
      toast({ title: liked ? "Post unliked" : "Post liked" });
    } catch (error) {
      console.error('Failed to like post:', error);
      toast({ title: "Failed to like post", variant: "destructive" });
    }
  };

  const handleComment = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const commentsResponse = await contentApi.getComments(post.id.toString());
        const commentsData = commentsResponse.comments || [];
        
        // Fetch usernames for comment authors
        const commentUserPromises = commentsData.map(async (comment: any) => {
          try {
            const userData = await userApi.getUserById(comment.userId?.toString());
            return {
              id: comment.commentId || comment.id,
              author: userData.name || userData.email || 'Anonymous',
              avatar: (userData.name || userData.email || 'A')[0],
              content: comment.text || comment.content,
              timestamp: new Date(comment.createdAt || Date.now()).toLocaleDateString(),
              userId: comment.userId
            };
          } catch {
            return {
              id: comment.commentId || comment.id,
              author: 'Anonymous',
              avatar: 'A',
              content: comment.text || comment.content,
              timestamp: new Date(comment.createdAt || Date.now()).toLocaleDateString(),
              userId: comment.userId
            };
          }
        });
        
        const commentsWithAuthors = await Promise.all(commentUserPromises);
        setComments(commentsWithAuthors);
        
        // Check follow status for comment authors
        if (isAuthenticated) {
          const commentUserIds = [...new Set(commentsData.map((c: any) => c.userId?.toString()).filter(Boolean))];
          if (commentUserIds.length > 0) {
            const followPromises = commentUserIds.map(async (userId) => {
              try {
                const isFollowing = await userApi.isFollowing(userId);
                return { userId, isFollowing };
              } catch {
                return { userId, isFollowing: false };
              }
            });
            
            const followResults = await Promise.all(followPromises);
            const commentFollowMap: Record<string, boolean> = {};
            followResults.forEach(({ userId, isFollowing }) => {
              commentFollowMap[userId] = isFollowing;
            });
            
            Object.entries(commentFollowMap).forEach(([userId, isFollowing]) => {
              onFollowChange(userId, isFollowing);
            });
          }
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: "Please login to comment", variant: "destructive" });
      return;
    }
    if (!post.id) {
      toast({ title: "Invalid post ID", variant: "destructive" });
      return;
    }
    if (commentText.trim()) {
      try {
        await contentApi.addComment(post.id.toString(), { text: commentText.trim() });
        setCommentsCount(prev => prev + 1);
        setCommentText("");
        
        // Add the new comment to the list with current user info
        const newCommentWithAuthor = {
          id: Date.now().toString(),
          author: user?.name || user?.email || 'You',
          avatar: (user?.name || user?.email || 'Y')[0],
          content: commentText.trim(),
          timestamp: new Date().toLocaleDateString(),
          userId: user?.id
        };
        setComments(prev => [...prev, newCommentWithAuthor]);
        
        toast({ title: "Comment added successfully" });
      } catch (error) {
        console.error('Failed to add comment:', error);
        toast({ title: "Failed to add comment", variant: "destructive" });
      }
    }
  };

  const handleDeletePost = async () => {
    if (!isAuthenticated || !post.id) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await contentApi.deletePost(post.id.toString());
        toast({ title: "Post deleted successfully" });
        onPostDeleted?.();
      } catch (error) {
        console.error('Failed to delete post:', error);
        toast({ title: "Failed to delete post", variant: "destructive" });
      }
    }
  };

  const handleEditPost = async () => {
    if (!isAuthenticated || !post.id) return;
    
    if (!editTitle.trim() || !editContent.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    try {
      setEditLoading(true);
      
      let updateContent = editContent.trim();
      
      // If post has image, preserve it
      if (parsedContent.imageUrl) {
        const contentData = {
          text: editContent.trim(),
          imageUrl: parsedContent.imageUrl
        };
        updateContent = JSON.stringify(contentData);
      }
      
      const updateData = {
        title: editTitle.trim(),
        content: updateContent,
        category: post.category
      };
      
      await contentApi.updatePost(post.id.toString(), updateData);
      toast({ title: "Post updated successfully" });
      setIsEditing(false);
      onPostDeleted?.(); // Refresh posts
    } catch (error) {
      console.error('Failed to update post:', error);
      toast({ title: "Failed to update post", variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(post.title || '');
    setEditContent(parsedContent.text || post.content || '');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 smooth-all animate-slide-up mb-6">
      {/* Header */}
      <div className="p-4 border-b border-media-frozen-water">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${displayPost.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
              {displayPost.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-media-dark-raspberry">{displayPost.author}</h3>
              <p className="text-xs text-media-berry-crush/60">{displayPost.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOwner && (
              <button 
                onClick={handleFollow}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 smooth-all transition-all",
                  following
                    ? "bg-media-frozen-water text-media-dark-raspberry border-2 border-media-pearl-aqua"
                    : "bg-gradient-to-r from-media-berry-crush to-media-dark-raspberry text-white"
                )}
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-lg hover:bg-media-frozen-water smooth-all"
              >
                <MoreHorizontal className="w-4 h-4 text-media-dark-raspberry" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-media-pearl-aqua/30 z-20 min-w-[160px] overflow-hidden backdrop-blur-sm">
                  {isOwner ? (
                    <>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-media-dark-raspberry hover:bg-gradient-to-r hover:from-media-pearl-aqua/10 hover:to-media-powder-blush/10 w-full text-left transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush flex items-center justify-center">
                          <Edit className="w-4 h-4 text-white" />
                        </div>
                        <span>Edit Post</span>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-media-pearl-aqua/20 to-transparent mx-2"></div>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleDeletePost();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 w-full text-left transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-white" />
                        </div>
                        <span>Delete Post</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          toast({ title: "Report functionality coming soon" });
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-media-dark-raspberry hover:bg-gradient-to-r hover:from-media-pearl-aqua/10 hover:to-media-powder-blush/10 w-full text-left transition-all duration-200"
                      >
                        <span>Report Post</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          toast({ title: "Hide functionality coming soon" });
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-media-dark-raspberry hover:bg-gradient-to-r hover:from-media-pearl-aqua/10 hover:to-media-powder-blush/10 w-full text-left transition-all duration-200"
                      >
                        <span>Hide Post</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-2 border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none rounded-lg text-lg font-bold text-media-dark-raspberry"
              placeholder="Post title..."
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-4 py-3 border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none rounded-lg text-sm text-media-dark-raspberry resize-none h-32"
              placeholder="Post content..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditPost}
                disabled={editLoading}
                className="px-4 py-2 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {editLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border-2 border-media-pearl-aqua text-media-dark-raspberry rounded-lg hover:bg-media-pearl-aqua/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-media-dark-raspberry mb-2">{displayPost.title}</h2>
            <p className="text-media-dark-raspberry/70 text-sm mb-4 leading-relaxed">{displayPost.description}</p>

            {/* Image */}
            {displayPost.imageUrl && (
              <div className="mb-4">
                <img
                  src={displayPost.imageUrl}
                  alt={displayPost.title}
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
            )}
          </>
        )}

        {/* Category Badge */}
        <div className="mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-media-pearl-aqua to-media-powder-blush text-media-dark-raspberry">
            {displayPost.category}
          </span>
        </div>





        {/* Stats */}
        <div className="flex gap-4 text-sm text-media-berry-crush/70 mb-4 pb-4 border-b border-media-frozen-water">
          <span className="font-medium">{likesCount} likes</span>
          <span className="font-medium">{commentsCount} comments</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-media-frozen-water smooth-all group"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all",
                liked
                  ? "fill-media-powder-blush text-media-powder-blush"
                  : "text-media-dark-raspberry group-hover:text-media-powder-blush"
              )}
            />
            <span className={cn("text-sm font-medium", liked ? "text-media-powder-blush" : "text-media-dark-raspberry")}>
              Like
            </span>
          </button>
          <button 
            onClick={handleComment}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg smooth-all group transition-all",
              showComments 
                ? "bg-media-pearl-aqua/20" 
                : "hover:bg-media-frozen-water"
            )}
          >
            <MessageCircle className={cn(
              "w-5 h-5 transition-all",
              showComments 
                ? "text-media-pearl-aqua" 
                : "text-media-dark-raspberry group-hover:text-media-pearl-aqua"
            )} />
            <span className={cn(
              "text-sm font-medium transition-all",
              showComments 
                ? "text-media-pearl-aqua" 
                : "text-media-dark-raspberry group-hover:text-media-pearl-aqua"
            )}>
              Comment
            </span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-media-frozen-water">
            <div className="space-y-4">
              {/* Comment Form */}
              {isAuthenticated && (
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 rounded-lg border border-media-frozen-water focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua text-sm text-media-dark-raspberry"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-media-pearl-aqua to-media-berry-crush text-white text-sm font-semibold hover:shadow-lg smooth-all"
                  >
                    Post
                  </button>
                </form>
              )}

              {/* Comments List */}
              {loadingComments ? (
                <div className="text-center py-4">
                  <span className="text-sm text-media-dark-raspberry/50">Loading comments...</span>
                </div>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {comments.length > 0 ? (
                    comments.map((comment) => {
                      const commentUserId = comment.userId?.toString();
                      const isFollowingCommenter = commentUserId ? followingUsers[commentUserId] : false;
                      const isCommentOwner = user?.id === comment.userId;
                      
                      return (
                        <div key={comment.id || comment.commentId} className="flex gap-3 p-3 bg-media-frozen-water/20 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-media-powder-blush to-media-berry-crush flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {comment.author?.[0] || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-media-dark-raspberry">{comment.author}</p>
                              {!isCommentOwner && commentUserId && (
                                <button
                                  onClick={async () => {
                                    try {
                                      if (isFollowingCommenter) {
                                        await userApi.unfollowUser(commentUserId);
                                      } else {
                                        await userApi.followUser(commentUserId);
                                      }
                                      onFollowChange(commentUserId, !isFollowingCommenter);
                                    } catch (error) {
                                      console.error('Failed to follow/unfollow commenter:', error);
                                    }
                                  }}
                                  className={cn(
                                    "px-2 py-1 rounded text-xs font-medium transition-all",
                                    isFollowingCommenter
                                      ? "bg-media-frozen-water text-media-dark-raspberry border border-media-pearl-aqua"
                                      : "bg-gradient-to-r from-media-berry-crush to-media-dark-raspberry text-white"
                                  )}
                                >
                                  {isFollowingCommenter ? "Following" : "Follow"}
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-media-dark-raspberry/70 mt-1">{comment.text || comment.content}</p>
                            <p className="text-xs text-media-dark-raspberry/50 mt-2">{comment.timestamp}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <span className="text-sm text-media-dark-raspberry/50">No comments yet</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MainFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [followingUsers, setFollowingUsers] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setPosts([]);
    setPage(1);
    loadPosts(1);
  }, []);

  const loadPosts = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const response = await contentApi.getPosts({ category: 'general', page: pageNum, limit: 10 });
      
      // Convert post IDs to strings and sort by creation date (newest first)
      const postsWithIds = (response.posts || []).map(post => {
        const postId = post.id || post.postId;
        return {
          ...post,
          id: postId ? String(postId) : undefined
        };
      }).filter(post => post.id) // Remove posts without IDs
        .sort((a, b) => {
          const getTimestamp = (post: any) => {
            const dateStr = post.createdAt || post.created_at || post.updatedAt;
            if (!dateStr) return 0;
            const timestamp = new Date(dateStr).getTime();
            return isNaN(timestamp) ? 0 : timestamp;
          };
          
          const timeA = getTimestamp(a);
          const timeB = getTimestamp(b);
          
          // Sort oldest first (ascending order)
          return timeA - timeB;
        });
      
      if (pageNum === 1) {
        setPosts(postsWithIds);
      } else {
        setPosts(prev => [...prev, ...postsWithIds]);
      }
      setHasMore((response.posts?.length || 0) === 10);
      
      // Check follow status for all unique users
      if (isAuthenticated) {
        const userIds = [...new Set(postsWithIds.map(post => post.userId?.toString()).filter(Boolean))];
        
        const followPromises = userIds.map(async (userId) => {
          try {
            const isFollowing = await userApi.isFollowing(userId);
            return { userId, isFollowing };
          } catch (error) {
            return { userId, isFollowing: false };
          }
        });
        
        const followResults = await Promise.all(followPromises);
        const followMap: Record<string, boolean> = {};
        followResults.forEach(({ userId, isFollowing }) => {
          followMap[userId] = isFollowing;
        });
        
        if (pageNum === 1) {
          setFollowingUsers(followMap);
        } else {
          setFollowingUsers(prev => ({ ...prev, ...followMap }));
        }
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast({ title: "Failed to load posts", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage);
  };

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    setFollowingUsers(prev => ({ ...prev, [userId]: isFollowing }));
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-media-berry-crush mx-auto mb-4"></div>
          <p className="text-media-dark-raspberry/70">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onPostDeleted={() => loadPosts(1)}
              followingUsers={followingUsers}
              onFollowChange={handleFollowChange}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-media-dark-raspberry/70">No posts available</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && posts.length > 0 && (
        <div className="text-center mt-8 mb-12">
          <button 
            onClick={handleLoadMore}
            disabled={isLoading}
            className={cn(
              "px-6 py-3 rounded-xl bg-gradient-to-r from-media-pearl-aqua to-media-berry-crush text-media-dark-raspberry font-semibold hover:shadow-lg hover:scale-105 smooth-all transition-all",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? "Loading..." : "Load More Posts"}
          </button>
        </div>
      )}
    </div>
  );
}
