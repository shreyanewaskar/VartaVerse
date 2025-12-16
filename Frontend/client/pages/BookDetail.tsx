import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, BookOpen, MessageCircle, Send, User, Heart, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { contentApi } from "@/lib/content-api";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentUsers, setCommentUsers] = useState<Record<string, string>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const { user } = useAuth();

  const displayedRating = hoveredStar ?? userRating;

  useEffect(() => {
    const loadBook = async () => {
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
          const bookData = {
            id: post.postId,
            title: post.title,
            author: content.author || 'Unknown Author',
            description: content.description || '',
            genre: content.genre || 'Fiction',
            year: parseInt(content.year) || 2024,
            rating: post.averageRating || 0,
            userId: post.userId
          };
          setBook(bookData);
          setUserRating(userRating || 0);
          setEditTitle(post.title);
          setEditDescription(content.description || '');
        } catch {
          const bookData = {
            id: post.postId,
            title: post.title,
            author: 'Unknown Author',
            description: post.content,
            genre: 'Fiction',
            year: 2024,
            rating: post.averageRating || 0,
            userId: post.userId
          };
          setBook(bookData);
          setUserRating(userRating || 0);
          setEditTitle(post.title);
          setEditDescription(post.content);
        }
        
        const commentsData = commentsResponse.comments || [];
        setComments(commentsData);
        
        // Fetch usernames for all comments
        const userIds = [...new Set(commentsData.map((comment: any) => comment.userId).filter(Boolean))];
        if (userIds.length > 0) {
          try {
            const userPromises = userIds.map((userId: string) => 
              userApi.getUserById(userId).catch(() => ({ name: 'Anonymous' }))
            );
            const users = await Promise.all(userPromises);
            const userMap: Record<string, string> = {};
            userIds.forEach((userId: string, index: number) => {
              userMap[userId] = users[index]?.name || 'Anonymous';
            });
            setCommentUsers(userMap);
          } catch (err) {
            console.error('Failed to fetch usernames:', err);
          }
        }
      } catch (err) {
        console.error('Failed to load book:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleLike = async () => {
    if (!id || likeLoading) return;
    
    setLikeLoading(true);
    try {
      await contentApi.toggleLike(id);
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed like" : "Liked book");
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error("Failed to update like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleEditBook = async () => {
    if (!id || !editTitle.trim() || !editDescription.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setEditLoading(true);
      
      const updateData = {
        title: editTitle.trim(),
        content: JSON.stringify({
          author: book.author,
          description: editDescription.trim(),
          genre: book.genre,
          year: book.year.toString()
        }),
        category: "book"
      };
      
      await contentApi.updatePost(id, updateData);
      toast.success("Book updated successfully");
      setIsEditing(false);
      
      setBook(prev => ({
        ...prev,
        title: editTitle.trim(),
        description: editDescription.trim()
      }));
    } catch (error) {
      console.error('Failed to update book:', error);
      toast.error("Failed to update book");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await contentApi.deletePost(id);
        toast.success("Book deleted successfully");
        navigate("/books");
      } catch (error) {
        console.error('Failed to delete book:', error);
        toast.error("Failed to delete book");
      }
    }
  };

  const isOwner = user?.id === book?.userId;

  const handleRateBook = async (rating: number) => {
    if (!user) {
      toast.error("Please login to rate books");
      return;
    }

    if (!id) return;

    try {
      setIsRatingLoading(true);
      await contentApi.ratePost(id, { ratingValue: rating });
      setUserRating(rating);
      setBook(prev => ({ ...prev, rating: rating }));
      toast.success(`Rated ${rating} stars!`);
    } catch (error) {
      console.error('Failed to rate book:', error);
      toast.error("Failed to submit rating");
    } finally {
      setIsRatingLoading(false);
    }
  };

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
        <p className="text-media-dark-raspberry text-xl">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30 flex items-center justify-center">
        <p className="text-media-dark-raspberry text-xl">Book not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/books")}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-white/70 hover:bg-white/90 text-media-dark-raspberry transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </button>

        {/* Book Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3">
              <div className="w-full h-96 md:h-full bg-gradient-to-br from-media-powder-blush to-media-pearl-aqua flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-white" />
              </div>
            </div>

            {/* Book Info */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-center justify-between mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-3xl font-bold text-media-dark-raspberry border-2 border-media-pearl-aqua rounded-lg px-3 py-1 focus:outline-none focus:border-media-berry-crush flex-1 mr-4"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-media-dark-raspberry">
                    {book.title}
                  </h1>
                )}
                
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
                          <span>Edit Book</span>
                        </button>
                        <div className="h-px bg-gradient-to-r from-transparent via-media-pearl-aqua/20 to-transparent mx-2"></div>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            handleDeleteBook();
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 w-full text-left transition-all duration-200"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                            <Trash2 className="w-4 h-4 text-white" />
                          </div>
                          <span>Delete Book</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-media-dark-raspberry/70">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {book.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {book.year}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-media-powder-blush text-media-powder-blush" />
                  {book.rating.toFixed(1)}/5
                </div>
                <span className="px-2 py-1 rounded-full bg-media-pearl-aqua/20 text-media-dark-raspberry text-xs font-semibold">
                  {book.genre}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-media-dark-raspberry mb-3">Rate this Book</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => handleRateBook(star)}
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
                  <h3 className="font-semibold text-media-dark-raspberry mb-2">Author</h3>
                  <p className="text-media-dark-raspberry/80">{book.author}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-media-dark-raspberry mb-2">Genre</h3>
                  <p className="text-media-dark-raspberry/80">{book.genre}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-media-dark-raspberry mb-2">Description</h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-media-pearl-aqua rounded-lg focus:outline-none focus:border-media-berry-crush resize-none h-32"
                        placeholder="Book description..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditBook}
                          disabled={editLoading}
                          className="px-4 py-2 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {editLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditTitle(book.title);
                            setEditDescription(book.description);
                          }}
                          className="px-4 py-2 border-2 border-media-pearl-aqua text-media-dark-raspberry rounded-lg hover:bg-media-pearl-aqua/10 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-media-dark-raspberry/80 leading-relaxed">
                      {book.description || 'No description available.'}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isLiked 
                        ? "bg-media-berry-crush text-white" 
                        : "bg-white border-2 border-media-berry-crush text-media-berry-crush hover:bg-media-berry-crush hover:text-white"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    {isLiked ? "Liked" : "Like Book"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 p-6 border-t border-media-pearl-aqua/20">
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
  );
}