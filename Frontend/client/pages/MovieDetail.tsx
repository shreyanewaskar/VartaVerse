import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Film, MessageCircle, Send, Bookmark, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { contentApi } from "@/lib/content-api";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentUsers, setCommentUsers] = useState<{[key: string]: string}>({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [post, commentsResponse] = await Promise.all([
          contentApi.getPost(id),
          contentApi.getComments(id)
        ]);
        
        try {
          const content = JSON.parse(post.content);
          const imageUrl = content.imageUrl ? localStorage.getItem(content.imageUrl) : null;
          const movieData = {
            id: post.postId,
            title: post.title,
            director: content.director || 'Unknown Director',
            description: content.description || '',
            genre: content.genre || 'Drama',
            year: parseInt(content.year) || 2024,
            rating: 4.0,
            imageUrl: imageUrl,
            userId: post.userId
          };
          setMovie(movieData);
          setEditTitle(post.title);
          setEditDescription(content.description || '');
        } catch {
          const movieData = {
            id: post.postId,
            title: post.title,
            director: 'Unknown Director',
            description: post.content,
            genre: 'Drama',
            year: 2024,
            rating: 4.0,
            imageUrl: null,
            userId: post.userId
          };
          setMovie(movieData);
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
        console.error('Failed to load movie:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const handleBookmark = async () => {
    if (!id || bookmarkLoading) return;
    
    setBookmarkLoading(true);
    try {
      await contentApi.toggleLike(id);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleEditMovie = async () => {
    if (!id || !editTitle.trim() || !editDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setEditLoading(true);
      
      const updateData = {
        title: editTitle.trim(),
        content: JSON.stringify({
          director: movie.director,
          genre: movie.genre,
          year: movie.year.toString(),
          description: editDescription.trim(),
          imageUrl: movie.imageUrl ? Object.keys(localStorage).find(key => localStorage.getItem(key) === movie.imageUrl) : null
        }),
        category: "movie"
      };
      
      await contentApi.updatePost(id, updateData);
      toast.success("Movie updated successfully");
      setIsEditing(false);
      
      setMovie(prev => ({
        ...prev,
        title: editTitle.trim(),
        description: editDescription.trim()
      }));
    } catch (error) {
      console.error('Failed to update movie:', error);
      toast.error("Failed to update movie");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteMovie = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await contentApi.deletePost(id);
        toast.success("Movie deleted successfully");
        navigate("/movies");
      } catch (error) {
        console.error('Failed to delete movie:', error);
        toast.error("Failed to delete movie");
      }
    }
  };

  const isOwner = user?.id === movie?.userId;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30 flex items-center justify-center">
        <p className="text-media-dark-raspberry text-xl">Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30 flex items-center justify-center">
        <p className="text-media-dark-raspberry text-xl">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-white/70 hover:bg-white/90 text-media-dark-raspberry transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Movies
        </button>

        {/* Movie Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Movie Poster */}
            {movie.imageUrl && (
              <div className="md:w-1/3">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="w-full h-96 md:h-full object-cover"
                />
              </div>
            )}
            
            {/* Movie Info */}
            <div className={`${movie.imageUrl ? 'md:w-2/3' : 'w-full'} p-8`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {!movie.imageUrl && (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center">
                      <Film className="w-8 h-8 text-white" />
                    </div>
                  )}
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
                        {movie.title}
                      </h1>
                    )}
                    <div className="flex items-center gap-4 text-sm text-media-dark-raspberry/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {movie.year}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {movie.rating}/5
                      </div>
                      <span className="px-2 py-1 rounded-full bg-media-pearl-aqua/20 text-media-dark-raspberry text-xs font-semibold">
                        {movie.genre}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className={`p-3 rounded-full transition-all ${
                      isBookmarked 
                        ? "bg-media-berry-crush text-white" 
                        : "bg-white border-2 border-media-berry-crush text-media-berry-crush hover:bg-media-berry-crush hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-6 h-6 ${isBookmarked ? "fill-current" : ""}`} />
                  </button>
                  
                  {isOwner && (
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
                            <span>Edit Movie</span>
                          </button>
                          <div className="h-px bg-gradient-to-r from-transparent via-media-pearl-aqua/20 to-transparent mx-2"></div>
                          <button
                            onClick={() => {
                              setShowMenu(false);
                              handleDeleteMovie();
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 w-full text-left transition-all duration-200"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                              <Trash2 className="w-4 h-4 text-white" />
                            </div>
                            <span>Delete Movie</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-media-dark-raspberry mb-3">Director</h3>
                <p className="text-media-dark-raspberry/80">{movie.director}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-media-dark-raspberry mb-3">Description</h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-media-pearl-aqua rounded-lg focus:outline-none focus:border-media-berry-crush resize-none h-32"
                      placeholder="Movie description..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditMovie}
                        disabled={editLoading}
                        className="px-4 py-2 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {editLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditTitle(movie.title);
                          setEditDescription(movie.description);
                        }}
                        className="px-4 py-2 border-2 border-media-pearl-aqua text-media-dark-raspberry rounded-lg hover:bg-media-pearl-aqua/10 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-media-dark-raspberry/80 leading-relaxed">
                    {movie.description || 'No description available.'}
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
    </div>
  );
}