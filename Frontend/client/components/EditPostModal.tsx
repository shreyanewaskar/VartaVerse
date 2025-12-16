import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onPostUpdated: () => void;
}

export default function EditPostModal({ isOpen, onClose, post, onPostUpdated }: EditPostModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Category-specific fields
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [seasons, setSeasons] = useState("");
  const [episodes, setEpisodes] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setCategory(post.category || "");
      
      // Parse content based on category
      try {
        const parsedContent = JSON.parse(post.content || "{}");
        
        if (post.category === 'movie') {
          setDirector(parsedContent.director || "");
          setGenre(parsedContent.genre || "");
          setYear(parsedContent.year || "");
          setDescription(parsedContent.description || "");
        } else if (post.category === 'book') {
          setAuthor(parsedContent.author || "");
          setGenre(parsedContent.genre || "");
          setYear(parsedContent.year || "");
          setPages(parsedContent.pages || "");
          setDescription(parsedContent.description || "");
        } else if (post.category === 'show') {
          setDirector(parsedContent.director || "");
          setGenre(parsedContent.genre || "");
          setYear(parsedContent.year || "");
          setSeasons(parsedContent.seasons || "");
          setEpisodes(parsedContent.episodes || "");
          setDescription(parsedContent.description || "");
        } else {
          setContent(parsedContent.description || parsedContent.text || post.content || "");
        }
      } catch {
        setContent(post.content || "");
      }
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation based on category
    if (!title.trim()) return;
    
    if (category === 'movie' && (!director.trim() || !genre.trim() || !year.trim() || !description.trim())) {
      toast({ title: "Please fill in all movie fields", variant: "destructive" });
      return;
    }
    
    if (category === 'book' && (!author.trim() || !genre.trim() || !year.trim() || !description.trim())) {
      toast({ title: "Please fill in all book fields", variant: "destructive" });
      return;
    }
    
    if (category === 'show' && (!director.trim() || !genre.trim() || !year.trim() || !description.trim())) {
      toast({ title: "Please fill in all show fields", variant: "destructive" });
      return;
    }
    
    if (!['movie', 'book', 'show'].includes(category) && !content.trim()) {
      toast({ title: "Please fill in content", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let postContent;
      
      // Structure content based on category
      if (category === 'movie') {
        postContent = JSON.stringify({
          director: director.trim(),
          genre: genre.trim(),
          year: year.trim(),
          description: description.trim()
        });
      } else if (category === 'book') {
        postContent = JSON.stringify({
          author: author.trim(),
          genre: genre.trim(),
          year: year.trim(),
          pages: pages.trim(),
          description: description.trim()
        });
      } else if (category === 'show') {
        postContent = JSON.stringify({
          director: director.trim(),
          genre: genre.trim(),
          year: year.trim(),
          seasons: seasons.trim(),
          episodes: episodes.trim(),
          description: description.trim()
        });
      } else {
        postContent = JSON.stringify({ description: content.trim() });
      }
      
      const updateData = {
        title: title.trim(),
        content: postContent,
        category
      };

      // Use direct API call to port 8082
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8082/posts/${post.postId || post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      toast({
        title: "Post updated successfully"
      });
      
      onPostUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update post:", error);
      toast({
        title: "Failed to update post",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="glass relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/50 bg-white/90 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-media-berry-crush">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
              placeholder="Enter post title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
              required
            >
              <option value="">Select category</option>
              <option value="movie">Movie</option>
              <option value="book">Book</option>
              <option value="show">Show</option>
              <option value="post">General Post</option>
            </select>
          </div>

          {/* Category-specific fields */}
          {category === 'movie' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Director
                  </label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="Director name..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="Action, Drama, etc..."
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                  placeholder="2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry resize-none"
                  placeholder="Movie description..."
                  required
                />
              </div>
            </>
          )}
          
          {category === 'book' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="Author name..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="Fiction, Mystery, etc..."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Pages
                  </label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry resize-none"
                  placeholder="Book description..."
                  required
                />
              </div>
            </>
          )}
          
          {category === 'show' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Director/Creator
                  </label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="Director/Creator name..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="Drama, Comedy, etc..."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Seasons
                  </label>
                  <input
                    type="text"
                    value={seasons}
                    onChange={(e) => setSeasons(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                    Episodes
                  </label>
                  <input
                    type="text"
                    value={episodes}
                    onChange={(e) => setEpisodes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry"
                    placeholder="24"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry resize-none"
                  placeholder="Show description..."
                  required
                />
              </div>
            </>
          )}
          
          {!['movie', 'book', 'show'].includes(category) && (
            <div>
              <label className="block text-sm font-semibold text-media-dark-raspberry mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none text-media-dark-raspberry resize-none"
                placeholder="Share your thoughts..."
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-media-pearl-aqua bg-white/70 px-6 py-3 text-sm font-semibold text-media-dark-raspberry transition hover:bg-media-pearl-aqua/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua px-6 py-3 text-sm font-bold text-white shadow-lg shadow-media-powder-blush/40 transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}