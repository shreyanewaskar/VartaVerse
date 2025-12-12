import { useState, useEffect } from "react";
import { Heart, MessageCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { contentApi } from "@/lib/content-api";
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

function PostCard({ post }: { post: Post }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  // Transform backend data to UI format
  const displayPost = {
    ...post,
    author: post.author?.name || 'Anonymous',
    avatar: post.author?.name?.[0] || 'A',
    color: 'from-media-berry-crush to-media-dark-raspberry',
    timestamp: new Date(post.createdAt || Date.now()).toLocaleDateString(),
    description: post.content,
    rating: post.averageRating || 0,
    tags: [],
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0
  };

  const handleFollow = () => {
    setFollowing(!following);
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
        toast({ title: "Comment added successfully" });
      } catch (error) {
        console.error('Failed to add comment:', error);
        toast({ title: "Failed to add comment - check backend logs", variant: "destructive" });
      }
    }
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
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-media-dark-raspberry mb-2">{displayPost.title}</h2>
        <p className="text-media-dark-raspberry/70 text-sm mb-4 leading-relaxed">{displayPost.description}</p>

        {/* Category Badge */}
        <div className="mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-media-pearl-aqua to-media-powder-blush text-media-dark-raspberry">
            {displayPost.category}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={`star-${post.id}-${i}`}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(displayPost.rating)
                    ? "fill-media-powder-blush text-media-powder-blush"
                    : "text-media-frozen-water"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-media-dark-raspberry">{displayPost.rating}</span>
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
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-media-powder-blush to-media-berry-crush flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {comment.author?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-media-dark-raspberry">{comment.author}</p>
                          <p className="text-sm text-media-dark-raspberry/70">{comment.content}</p>
                          <p className="text-xs text-media-dark-raspberry/50 mt-1">{comment.timestamp}</p>
                        </div>
                      </div>
                    ))
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
  const { toast } = useToast();

  useEffect(() => {
    setPosts([]);
    setPage(1);
    loadPosts(1);
  }, []);

  const loadPosts = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      console.log('Loading posts...');
      const response = await contentApi.getPosts({ page: pageNum, limit: 10 });
      console.log('Raw posts from backend:', response.posts);
      
      // Convert post IDs to strings (backend returns numbers)
      const postsWithIds = (response.posts || []).map(post => {
        const postId = post.id || post.postId;
        console.log('Post data:', { id: postId, title: post.title });
        return {
          ...post,
          id: postId ? String(postId) : undefined
        };
      }).filter(post => post.id); // Remove posts without IDs
      
      console.log('Posts with valid IDs:', postsWithIds);
      
      if (pageNum === 1) {
        setPosts(postsWithIds);
      } else {
        setPosts(prev => [...prev, ...postsWithIds]);
      }
      setHasMore((response.posts?.length || 0) === 10);
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
      <div className="space-y-0">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
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
