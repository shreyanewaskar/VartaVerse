import { useState, useEffect } from "react";
import { Search, Plus, MoreVertical, Edit3, Trash2 } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import MediaCard from "@/components/MediaCard";
import CreateMoviePostModal from "@/components/CreateMoviePostModal";
import EditPostModal from "@/components/EditPostModal";
import { contentApi } from "@/lib/content-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type SortBy = "popular" | "toprated" | "newreleases" | "alphabetical";

const movieFilters = [
  {
    title: "Genre",
    options: [
      { id: "action", label: "Action" },
      { id: "drama", label: "Drama" },
      { id: "comedy", label: "Comedy" },
      { id: "scifi", label: "Sci-Fi" },
      { id: "romance", label: "Romance" },
      { id: "horror", label: "Horror" },
    ],
  },
  {
    title: "Release Year",
    options: [
      { id: "2024", label: "2024" },
      { id: "2023", label: "2023" },
      { id: "2022", label: "2022" },
      { id: "2021", label: "2021" },
      { id: "2020", label: "2020" },
    ],
  },
  {
    title: "User Score",
    options: [
      { id: "4plus", label: "4.0+ Stars" },
      { id: "3plus", label: "3.0+ Stars" },
      { id: "2plus", label: "2.0+ Stars" },
      { id: "1plus", label: "1.0+ Stars" },
    ],
  },
];



export default function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [movies, setMovies] = useState<any[]>([]);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFilterChange = (category: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (!updated[category]) {
        updated[category] = [];
      }
      if (checked) {
        updated[category].push(optionId);
      } else {
        updated[category] = updated[category].filter((id) => id !== optionId);
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const loadMovies = async () => {
    setLoading(true);
    try {
      const response = await contentApi.getPosts({ category: 'movie' });
      const moviePosts = response.posts || [];
      
      // Fetch average ratings for all movies
      const moviesWithRatings = await Promise.all(
        moviePosts.map(async (movie) => {
          try {
            const avgRating = await contentApi.getAverageRating(movie.id?.toString() || movie.postId?.toString());
            return { ...movie, averageRating: avgRating };
          } catch (error) {
            return { ...movie, averageRating: movie.averageRating || 0 };
          }
        })
      );
      
      setAllMovies(moviesWithRatings);
      setMovies(moviesWithRatings);
    } catch (err) {
      console.error('Failed to load movies:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMovies();
  }, [sortBy]);

  // Filter movies based on selected filters and search term
  useEffect(() => {
    let filtered = [...allMovies];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sidebar filters
    Object.entries(selectedFilters).forEach(([category, options]) => {
      if (options.length > 0) {
        filtered = filtered.filter(movie => {
          let content;
          try {
            content = JSON.parse(movie.content || '{}');
          } catch {
            content = {};
          }

          if (category === 'Genre') {
            const movieGenre = (content.genre || 'drama').toLowerCase();
            return options.some(option => movieGenre.includes(option.toLowerCase()));
          }
          
          if (category === 'Release Year') {
            const movieYear = content.year || '2024';
            return options.includes(movieYear);
          }
          
          if (category === 'User Score') {
            const rating = movie.averageRating || 0;
            return options.some(option => {
              const minRating = parseInt(option.replace('plus', ''));
              return rating >= minRating;
            });
          }
          
          return true;
        });
      }
    });

    setMovies(filtered);
  }, [allMovies, selectedFilters, searchTerm]);

  const handlePostCreated = () => {
    loadMovies();
  };
  
  const handleEditPost = (post: any) => {
    setEditingPost(post);
  };
  
  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await contentApi.deletePost(postId);
      setAllMovies(prev => prev.filter(post => (post.id || post.postId) !== postId));
      setMovies(prev => prev.filter(post => (post.id || post.postId) !== postId));
      toast({ title: 'Post deleted successfully' });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({ title: 'Failed to delete post', variant: 'destructive' });
    }
  };
  
  const handlePostUpdated = () => {
    loadMovies();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-media-dark-raspberry mb-6">
            Discover Movies
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all text-lg"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            filters={movieFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* Main Grid */}
          <div className="flex-1 space-y-6 animate-slide-up">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center pb-4 border-b border-media-pearl-aqua/20">
              <div className="flex gap-4">
                {(["popular", "toprated", "newreleases", "alphabetical"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setSortBy(tab)}
                      className={`px-4 py-2 font-semibold capitalize relative smooth-all ${
                        sortBy === tab
                          ? "text-media-dark-raspberry"
                          : "text-media-dark-raspberry/50 hover:text-media-dark-raspberry"
                      }`}
                    >
                      {tab === "toprated" ? "Top Rated" : tab === "newreleases" ? "New Releases" : tab}
                      {sortBy === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua rounded-full" />
                      )}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-media-berry-crush to-media-dark-raspberry text-white rounded-lg hover:shadow-lg hover:scale-105 smooth-all"
              >
                <Plus className="w-4 h-4" />
                Create Movie Post
              </button>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/70 text-lg">Loading movies...</p>
                </div>
              ) : movies.length > 0 ? (
                movies.map((movie) => {
                  let content;
                  try {
                    content = JSON.parse(movie.content);
                  } catch {
                    content = { year: '2024', genre: 'Drama' };
                  }
                  const postId = movie.postId || movie.id;
                  const isOwner = user?.id === movie.userId;
                  
                  return (
                    <div key={postId} className="relative group">
                      <MediaCard
                        id={postId}
                        title={movie.title}
                        year={content.year || '2024'}
                        rating={movie.averageRating || 0}
                        genre={content.genre || 'Drama'}
                        type="movie"
                        size="medium"
                      />
                      
                      {/* Edit/Delete Menu for Owner */}
                      {isOwner && (
                        <div className="absolute right-2 top-2 z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowPostMenu(showPostMenu === postId ? null : postId);
                            }}
                            className="rounded-full bg-white/80 p-2 text-media-dark-raspberry transition hover:bg-white hover:shadow-md opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {showPostMenu === postId && (
                            <div className="absolute right-0 top-12 z-20 min-w-[120px] rounded-xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleEditPost(movie);
                                  setShowPostMenu(null);
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-media-dark-raspberry transition hover:bg-media-pearl-aqua/20 flex items-center gap-2"
                              >
                                <Edit3 className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeletePost(postId);
                                  setShowPostMenu(null);
                                }}
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/50 text-lg">
                    No movies found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Movie Post Modal */}
      <CreateMoviePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={handlePostCreated}
      />
      
      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onPostUpdated={handlePostUpdated}
      />
      
      {/* Click outside to close menu */}
      {showPostMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowPostMenu(null)}
        />
      )}
    </div>
  );
}
