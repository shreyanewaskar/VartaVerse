import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, BookOpen, MessageCircle, Send, User } from "lucide-react";
import { contentApi } from "@/lib/content-api";
import { userApi } from "@/lib/user-api";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentUsers, setCommentUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [post, commentsResponse] = await Promise.all([
          contentApi.getPost(id),
          contentApi.getComments(id)
        ]);
        
        try {
          const content = JSON.parse(post.content);
          setBook({
            id: post.postId,
            title: post.title,
            author: content.author || 'Unknown Author',
            description: content.description || '',
            genre: content.genre || 'Fiction',
            year: parseInt(content.year) || 2024,
            rating: 4.0
          });
        } catch {
          setBook({
            id: post.postId,
            title: post.title,
            author: 'Unknown Author',
            description: post.content,
            genre: 'Fiction',
            year: 2024,
            rating: 4.0
          });
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
              <h1 className="text-3xl font-bold text-media-dark-raspberry mb-4">
                {book.title}
              </h1>

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
                  <Star className="w-4 h-4" />
                  {book.rating}/5
                </div>
                <span className="px-2 py-1 rounded-full bg-media-pearl-aqua/20 text-media-dark-raspberry text-xs font-semibold">
                  {book.genre}
                </span>
              </div>

              <div className="space-y-4">
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
                  <p className="text-media-dark-raspberry/80 leading-relaxed">
                    {book.description || 'No description available.'}
                  </p>
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