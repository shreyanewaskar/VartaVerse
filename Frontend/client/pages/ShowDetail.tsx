import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Tv, MessageCircle, Send, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { contentApi } from "@/lib/content-api";
import { userApi } from "@/lib/user-api";
import { TokenManager } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentUsers, setCommentUsers] = useState<{[key: string]: string}>({});
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [showImage, setShowImage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const displayedRating = hoveredStar ?? userRating;

  useEffect(() => {
    const loadShow = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [post, commentsResponse] = await Promise.all([
          contentApi.getPost(id),
          contentApi.getComments(id)
        ]);
        
        // Fetch user rating separately if authenticated
        let userRating = 0;
        if (user) {
          try {
            userRating = await contentApi.getUserRating(id);
          } catch (error) {
            console.log('Could not fetch user rating:', error);
            userRating = 0;
          }
        }
        
        try {
          const content = JSON.parse(post.content);
          const showData = {
            id: post.postId,
            title: post.title,
            description: content.description || '',
            genre: content.genre || 'Drama',
            year: parseInt(content.year) || 2024,
            rating: post.averageRating || 0,
            userId: post.userId
          };
          setShow(showData);
          setUserRating(userRating || 0);
          setEditTitle(post.title);
          setEditDescription(content.description || '');
          
          // Load image from localStorage if available
          if (content.imageUrl) {
            const imageData = localStorage.getItem(content.imageUrl);
            if (imageData) {
              setShowImage(imageData);
            }
          }
        } catch {
          const showData = {
            id: post.postId,
            title: post.title,
            description: post.content,
            genre: 'Drama',
            year: 2024,
            rating: post.averageRating || 0,
            userId: post.userId
          };
          setShow(showData);
          setUserRating(userRating || 0);
          setEditTitle(post.title);
          setEditDescription(post.content);
        }
        
        const commentsData = commentsResponse.comments || [];
        setComments(commentsData);
        
        // Fetch usernames for all comments
        const userPromises = commentsData.map(async (comment: any) => {
          if (comment.userId) {
            try {
              const userData = await userApi.getUserById(comment.userId.toString());
              return { userId: comment.userId, name: userData.name || userData.email || 'Anonymous' };
            } catch (error) {
              return { userId: comment.userId, name: 'Anonymous' };
            }
          }
          return null;
        });
        
        const userResults = await Promise.all(userPromises);
        const userMap: {[key: string]: string} = {};
        userResults.forEach(result => {
          if (result) {
            userMap[result.userId] = result.name;
          }
        });
        setCommentUsers(userMap);
      } catch (err) {
        console.error('Failed to load show:', err);
      } finally {
        setLoading(false);
      }
    };

    loadShow();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    
    try {
      setSubmittingComment(true);
      const comment = await contentApi.addComment(id, { text: newComment });
      setComments([...comments, comment]);
      setNewComment("");
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditShow = async () => {
    if (!id || !editTitle.trim() || !editDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setEditLoading(true);
      
      const updateData = {
        title: editTitle.trim(),
        content: JSON.stringify({
          description: editDescription.trim(),
          genre: show.genre,
          year: show.year.toString()
        }),
        category: "show"
      };
      
      await contentApi.updatePost(id, updateData);
      toast.success("Show updated successfully");
      setIsEditing(false);
      
      setShow(prev => ({
        ...prev,
        title: editTitle.trim(),
        description: editDescription.trim()
      }));
    } catch (error) {
      console.error('Failed to update show:', error);
      toast.error("Failed to update show");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteShow = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await contentApi.deletePost(id);
        toast.success("Show deleted successfully");
        navigate("/shows");
      } catch (error) {
        console.error('Failed to delete show:', error);
        toast.error("Failed to delete show");
      }
    }
  };

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
  
  const isOwner = currentUserId && show?.userId && currentUserId === show.userId.toString();

  const handleRateShow = async (rating: number) => {
    if (!user) {
      toast.error("Please login to rate shows");
      return;
    }

    if (!id) return;

    try {
      setIsRatingLoading(true);
      await contentApi.ratePost(id, { ratingValue: rating });
      setUserRating(rating);
      setShow(prev => ({ ...prev, rating: rating }));
      toast.success(`Rated ${rating} stars!`);
    } catch (error) {
      console.error('Failed to rate show:', error);
      toast.error("Failed to submit rating");
    } finally {
      setIsRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30 flex items-center justify-center">
        <p className="text-media-dark-raspberry text-xl">Loading show details...</p>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30 flex items-center justify-center">
        <p className="text-media-dark-raspberry text-xl">Show not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/shows")}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-white/70 hover:bg-white/90 text-media-dark-raspberry transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shows
        </button>

        {/* Show Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Show Image */}
          {showImage && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={showImage}
                alt={show.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {isOwner && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-3 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white/50 text-media-dark-raspberry hover:bg-white transition-all shadow-lg"
                  >
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-media-pearl-aqua/30 z-20 min-w-[160px] overflow-hidden">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-media-dark-raspberry hover:bg-gradient-to-r hover:from-media-pearl-aqua/10 hover:to-media-powder-blush/10 w-full text-left transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush flex items-center justify-center">
                          <Edit className="w-4 h-4 text-white" />
                        </div>
                        <span>Edit Show</span>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-media-pearl-aqua/20 to-transparent mx-2"></div>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleDeleteShow();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 w-full text-left transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-white" />
                        </div>
                        <span>Delete Show</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="absolute bottom-6 left-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{show.title}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {show.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {show.rating.toFixed(1)}/5
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
                    {show.genre}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-8">
            {!showImage && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-media-powder-blush to-media-pearl-aqua flex items-center justify-center">
                    <Tv className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-3xl font-bold text-media-dark-raspberry mb-2 border-2 border-media-pearl-aqua rounded-lg px-3 py-1 focus:outline-none focus:border-media-berry-crush"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-media-dark-raspberry mb-2">
                        {show.title}
                      </h1>
                    )}
                    <div className="flex items-center gap-4 text-sm text-media-dark-raspberry/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {show.year}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-media-powder-blush text-media-powder-blush" />
                        {show.rating.toFixed(1)}/5
                      </div>
                      <span className="px-2 py-1 rounded-full bg-media-pearl-aqua/20 text-media-dark-raspberry text-xs font-semibold">
                        {show.genre}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
              
              {isOwner && !showImage && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-3 rounded-full bg-white border-2 border-media-pearl-aqua text-media-dark-raspberry hover:bg-media-pearl-aqua/10 transition-all"
                  >
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-media-pearl-aqua/30 z-20 min-w-[160px] overflow-hidden">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setIsEditing(true);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-media-dark-raspberry hover:bg-gradient-to-r hover:from-media-pearl-aqua/10 hover:to-media-powder-blush/10 w-full text-left transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush flex items-center justify-center">
                          <Edit className="w-4 h-4 text-white" />
                        </div>
                        <span>Edit Show</span>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-media-pearl-aqua/20 to-transparent mx-2"></div>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleDeleteShow();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 w-full text-left transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-white" />
                        </div>
                        <span>Delete Show</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              


            {/* Title for shows with images */}
            {showImage && isEditing && (
              <div className="mb-6">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-3xl font-bold text-media-dark-raspberry mb-2 border-2 border-media-pearl-aqua rounded-lg px-3 py-1 focus:outline-none focus:border-media-berry-crush w-full"
                />
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-media-dark-raspberry mb-3">Rate this Show</h3>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => handleRateShow(star)}
                      disabled={isRatingLoading}
                      className="transition hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= displayedRating
                            ? "fill-media-powder-blush text-media-powder-blush"
                            : "text-media-berry-crush/20"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-media-dark-raspberry">
                    {displayedRating > 0 ? `${displayedRating}/5` : "Click to rate"}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-media-dark-raspberry mb-3">Description</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-media-pearl-aqua rounded-lg focus:outline-none focus:border-media-berry-crush resize-none h-32"
                      placeholder="Show description..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditShow}
                        disabled={editLoading}
                        className="px-4 py-2 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {editLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditTitle(show.title);
                          setEditDescription(show.description);
                        }}
                        className="px-4 py-2 border-2 border-media-pearl-aqua text-media-dark-raspberry rounded-lg hover:bg-media-pearl-aqua/10 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-media-dark-raspberry/80 leading-relaxed">
                    {show.description || 'No description available.'}
                  </p>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 pt-6 border-t border-media-pearl-aqua/20">
              <h3 className="text-xl font-bold text-media-dark-raspberry mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-media-pearl-aqua/40 focus:outline-none focus:border-media-pearl-aqua"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submittingComment}
                  className="px-4 py-2 bg-media-pearl-aqua text-white rounded-lg hover:bg-media-berry-crush transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submittingComment ? 'Posting...' : 'Post'}
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={comment.commentId || index} className="p-3 bg-media-frozen-water/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-media-berry-crush">
                          {commentUsers[comment.userId] || 'Loading...'}
                        </span>
                      </div>
                      <p className="text-media-dark-raspberry">{comment.text || comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-media-dark-raspberry/60 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}