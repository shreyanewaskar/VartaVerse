import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import TrendingCarousel from "@/components/TrendingCarousel";
import MainFeed from "@/components/MainFeed";
import { contentApi } from "@/lib/content-api";

type FilterTab = "all" | "trending" | "new" | "reviews";

export default function Explore() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
  const [trendingShows, setTrendingShows] = useState<any[]>([]);
  const [newPosts, setNewPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{movies: any[], books: any[], shows: any[]}>({ movies: [], books: [], shows: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        // Fetch movies with ratings
        const moviesResponse = await contentApi.getPosts({ category: 'movie', limit: 6 });
        const movies = await Promise.all(
          (moviesResponse.posts || []).map(async (post, index) => {
            let content;
            try {
              content = JSON.parse(post.content);
            } catch {
              content = { year: '2024' };
            }
            
            let avgRating = 0;
            try {
              avgRating = await contentApi.getAverageRating(post.id?.toString() || post.postId?.toString());
            } catch {
              avgRating = post.averageRating || 0;
            }
            
            return {
              id: post.id || post.postId,
              title: post.title,
              rank: index + 1,
              rating: avgRating,
              year: content.year || 2024,
              thumbnail: "🎬",
              type: "movie" as const
            };
          })
        );
        
        // Fetch books with ratings
        const booksResponse = await contentApi.getPosts({ category: 'book', limit: 6 });
        const books = await Promise.all(
          (booksResponse.posts || []).map(async (post, index) => {
            let content;
            try {
              content = JSON.parse(post.content);
            } catch {
              content = { year: '2024' };
            }
            
            let avgRating = 0;
            try {
              avgRating = await contentApi.getAverageRating(post.id?.toString() || post.postId?.toString());
            } catch {
              avgRating = post.averageRating || 0;
            }
            
            return {
              id: post.id || post.postId,
              title: post.title,
              rank: index + 1,
              rating: avgRating,
              year: content.year || 2024,
              thumbnail: "📚",
              type: "book" as const
            };
          })
        );
        
        // Fetch shows with ratings
        const showsResponse = await contentApi.getPosts({ category: 'show', limit: 6 });
        const shows = await Promise.all(
          (showsResponse.posts || []).map(async (post, index) => {
            let content;
            try {
              content = JSON.parse(post.content);
            } catch {
              content = { year: '2024' };
            }
            
            let avgRating = 0;
            try {
              avgRating = await contentApi.getAverageRating(post.id?.toString() || post.postId?.toString());
            } catch {
              avgRating = post.averageRating || 0;
            }
            
            return {
              id: post.id || post.postId,
              title: post.title,
              rank: index + 1,
              rating: avgRating,
              year: content.year || 2024,
              thumbnail: "📺",
              type: "show" as const
            };
          })
        );
        
        setTrendingMovies(movies);
        setTrendingBooks(books);
        setTrendingShows(shows);
        
        // Load new posts (last 4 days)
        const allPostsResponse = await contentApi.getPosts({ category: 'general', limit: 50 });
        const currentDate = new Date();
        const fourDaysAgo = new Date(currentDate.getTime() - (4 * 24 * 60 * 60 * 1000));
        
        const recentPosts = (allPostsResponse.posts || []).filter(post => {
          const createdAt = new Date(post.createdAt || post.created_at);
          return createdAt >= fourDaysAgo;
        }).map(post => ({
          ...post,
          id: post.id || post.postId
        }));
        
        setNewPosts(recentPosts);
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults({ movies: [], books: [], shows: [] });
      return;
    }

    setIsSearching(true);
    
    const searchQuery = query.toLowerCase();
    
    // Filter movies locally
    const filteredMovies = trendingMovies.filter(movie => 
      movie.title.toLowerCase().includes(searchQuery)
    );
    
    // Filter books locally
    const filteredBooks = trendingBooks.filter(book => 
      book.title.toLowerCase().includes(searchQuery)
    );
    
    // Filter shows locally
    const filteredShows = trendingShows.filter(show => 
      show.title.toLowerCase().includes(searchQuery)
    );
    
    setSearchResults({ 
      movies: filteredMovies, 
      books: filteredBooks, 
      shows: filteredShows 
    });
    
    setIsSearching(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, trendingMovies, trendingBooks, trendingShows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-media-dark-raspberry mb-6">
            Explore VartaVerse
          </h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
            <input
              type="text"
              placeholder="Search movies, books, shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all text-lg"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-6 overflow-x-auto pb-2 border-b border-media-pearl-aqua/20 animate-slide-up">
          {(["all", "trending", "new", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize relative whitespace-nowrap smooth-all ${
                activeTab === tab
                  ? "text-media-dark-raspberry"
                  : "text-media-dark-raspberry/50 hover:text-media-dark-raspberry"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {searchTerm ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-media-dark-raspberry">
              Search Results for "{searchTerm}"
            </h2>
            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-media-berry-crush mx-auto mb-4"></div>
                <p className="text-media-dark-raspberry/70">Searching...</p>
              </div>
            ) : (searchResults.movies.length > 0 || searchResults.books.length > 0 || searchResults.shows.length > 0) ? (
              <div className="space-y-8">
                {searchResults.movies.length > 0 && (
                  <TrendingCarousel title="Movies" items={searchResults.movies} />
                )}
                {searchResults.books.length > 0 && (
                  <TrendingCarousel title="Books" items={searchResults.books} />
                )}
                {searchResults.shows.length > 0 && (
                  <TrendingCarousel title="Shows" items={searchResults.shows} />
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-media-dark-raspberry/70">No results found for "{searchTerm}"</p>
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-media-berry-crush mx-auto mb-4"></div>
            <p className="text-media-dark-raspberry/70">Loading content...</p>
          </div>
        ) : activeTab === "new" ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-media-dark-raspberry">
              New Posts (Last 4 Days)
            </h2>
            {newPosts.length > 0 ? (
              <div className="space-y-8">
                {/* New Movies */}
                {(() => {
                  const newMovies = newPosts.filter(post => post.category === 'movie').map((post, index) => ({
                    id: post.id,
                    title: post.title,
                    rank: index + 1,
                    rating: post.ratingAvg || 0,
                    year: new Date(post.createdAt || post.created_at).getFullYear(),
                    thumbnail: "🎬",
                    type: "movie" as const
                  }));
                  return newMovies.length > 0 ? <TrendingCarousel title="New Movies" items={newMovies} /> : null;
                })()}
                
                {/* New Books */}
                {(() => {
                  const newBooks = newPosts.filter(post => post.category === 'book').map((post, index) => ({
                    id: post.id,
                    title: post.title,
                    rank: index + 1,
                    rating: post.ratingAvg || 0,
                    year: new Date(post.createdAt || post.created_at).getFullYear(),
                    thumbnail: "📚",
                    type: "book" as const
                  }));
                  return newBooks.length > 0 ? <TrendingCarousel title="New Books" items={newBooks} /> : null;
                })()}
                
                {/* New Shows */}
                {(() => {
                  const newShows = newPosts.filter(post => post.category === 'show').map((post, index) => ({
                    id: post.id,
                    title: post.title,
                    rank: index + 1,
                    rating: post.ratingAvg || 0,
                    year: new Date(post.createdAt || post.created_at).getFullYear(),
                    thumbnail: "📺",
                    type: "show" as const
                  }));
                  return newShows.length > 0 ? <TrendingCarousel title="New Shows" items={newShows} /> : null;
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-media-dark-raspberry/70">No new posts from the last 4 days</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <TrendingCarousel title="Trending Movies Now" items={trendingMovies} />
            <TrendingCarousel title="Popular Books This Week" items={trendingBooks} />
            <TrendingCarousel title="New Shows to Binge" items={trendingShows} />
          </div>
        )}

        {/* Personalized Feed Section */}
        <div className="space-y-6 animate-slide-up">
          <h2 className="text-2xl font-bold text-media-dark-raspberry">
            Popular Reviews & Discussions
          </h2>
          <MainFeed />
        </div>
      </div>
    </div>
  );
}
