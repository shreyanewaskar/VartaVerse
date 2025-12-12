import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Tv, MessageCircle, Send } from "lucide-react";
import { contentApi } from "@/lib/content-api";

export default function ShowDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const loadShow = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const post = await contentApi.getPost(id);
        
        try {
          const content = JSON.parse(post.content);
          setShow({
            id: post.postId,
            title: post.title,
            description: content.description || '',
            genre: content.genre || 'Drama',
            year: parseInt(content.year) || 2024,
            rating: 4.0
          });
        } catch {
          setShow({
            id: post.postId,
            title: post.title,
            description: post.content,
            genre: 'Drama',
            year: 2024,
            rating: 4.0
          });
        }
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
      await contentApi.addComment(id, { text: newComment });
      setComments([...comments, newComment]);
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
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-media-powder-blush to-media-pearl-aqua flex items-center justify-center">
                <Tv className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-media-dark-raspberry mb-2">
                  {show.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-media-dark-raspberry/70">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {show.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {show.rating}/5
                  </div>
                  <span className="px-2 py-1 rounded-full bg-media-pearl-aqua/20 text-media-dark-raspberry text-xs font-semibold">
                    {show.genre}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-media-dark-raspberry mb-3">Description</h3>
                <p className="text-media-dark-raspberry/80 leading-relaxed">
                  {show.description || 'No description available.'}
                </p>
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
                    <div key={index} className="p-3 bg-media-frozen-water/30 rounded-lg">
                      <p className="text-media-dark-raspberry">{comment}</p>
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