import { useState, useEffect } from "react";
import { Search, Plus, Bookmark } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import MediaCard from "@/components/MediaCard";
import CreateMoviePostModal from "@/components/CreateMoviePostModal";
import { contentApi } from "@/lib/content-api";

type SortBy = "popular" | "toprated" | "newreleases" | "alphabetical" | "bookmarks";

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
      if (sortBy === 'bookmarks') {
        // First API: Get movies by category
        const movieResponse = await contentApi.getPosts({ category: 'movie' });
        const moviePosts = movieResponse.posts || [];
        console.log(`Found ${moviePosts.length} movies`);
        
        // Second API: Get all likes with category book
        const bookResponse = await contentApi.getPosts({ category: 'book' });
        const bookPosts = bookResponse.posts || [];
        console.log(`Found ${bookPosts.length} books`);
        
        const bookmarkedMovies = [];
        let hasLikedBooks = false;
        
        for (const book of bookPosts) {
          try {
            const likesResponse = await contentApi.getLikes(book.postId);
            console.log(`Book ${book.title} (ID: ${book.postId}) has ${likesResponse.count} likes`);
            if (likesResponse.count > 0) {
              hasLikedBooks = true;
            }
          } catch (err) {
            console.error('Failed to get likes for book post:', book.postId);
          }
        }
        
        // If any book has likes, show all movies
        if (hasLikedBooks) {
          bookmarkedMovies.push(...moviePosts);
        }
        
        console.log(`Showing ${bookmarkedMovies.length} bookmarked movies (hasLikedBooks: ${hasLikedBooks})`);
        setAllMovies(bookmarkedMovies);
        setMovies(bookmarkedMovies);
      } else {
        const response = await contentApi.getPosts({ category: 'movie' });
        const moviePosts = response.posts || [];
        setAllMovies(moviePosts);
        setMovies(moviePosts);
      }
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
                {(["popular", "toprated", "newreleases", "alphabetical", "bookmarks"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setSortBy(tab)}
                      className={`px-4 py-2 font-semibold capitalize relative smooth-all flex items-center gap-2 ${
                        sortBy === tab
                          ? "text-media-dark-raspberry"
                          : "text-media-dark-raspberry/50 hover:text-media-dark-raspberry"
                      }`}
                    >
                      {tab === "bookmarks" && <Bookmark className="w-4 h-4" />}
                      {tab === "toprated" ? "Top Rated" : tab === "newreleases" ? "New Releases" : tab === "bookmarks" ? "Bookmarks" : tab}
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
                  return (
                    <MediaCard
                      key={movie.postId}
                      id={movie.postId}
                      title={movie.title}
                      year={content.year || '2024'}
                      rating={movie.averageRating || 0}
                      genre={content.genre || 'Drama'}
                      type="movie"
                      size="medium"
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/50 text-lg">
                    {sortBy === 'bookmarks' ? 'No bookmarked movies found.' : 'No movies found.'}
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
    </div>
  );
}
