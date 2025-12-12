import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import MediaCard from "@/components/MediaCard";
import { contentApi } from "@/lib/content-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type SortBy = "popular" | "toprated" | "newreleases" | "alphabetical";

const showFilters = [
  {
    title: "Genre",
    options: [
      { id: "drama", label: "Drama" },
      { id: "scifi", label: "Sci-Fi" },
      { id: "comedy", label: "Comedy" },
      { id: "action", label: "Action" },
      { id: "mystery", label: "Mystery" },
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
    title: "Platform",
    options: [
      { id: "netflix", label: "Netflix" },
      { id: "hbo", label: "HBO Max" },
      { id: "apple", label: "Apple TV+" },
      { id: "disney", label: "Disney+" },
      { id: "amazon", label: "Amazon Prime" },
    ],
  },
  {
    title: "Status",
    options: [
      { id: "ongoing", label: "Ongoing" },
      { id: "completed", label: "Completed" },
      { id: "upcoming", label: "Upcoming" },
    ],
  },
];

const allShows = [
  { id: "s1", title: "Stranger Things", year: 2016, rating: 4.7, genre: "Sci-Fi" },
  { id: "s2", title: "The Crown", year: 2016, rating: 4.6, genre: "Drama" },
  { id: "s3", title: "Breaking Bad", year: 2008, rating: 4.9, genre: "Drama" },
  { id: "s4", title: "The Mandalorian", year: 2019, rating: 4.7, genre: "Sci-Fi" },
  { id: "s5", title: "Wednesday", year: 2022, rating: 4.7, genre: "Comedy" },
  { id: "s6", title: "Squid Game", year: 2021, rating: 4.8, genre: "Drama" },
  { id: "s7", title: "The Office", year: 2005, rating: 4.8, genre: "Comedy" },
  { id: "s8", title: "Game of Thrones", year: 2011, rating: 4.5, genre: "Drama" },
  { id: "s9", title: "Westworld", year: 2016, rating: 4.6, genre: "Sci-Fi" },
  { id: "s10", title: "The Boys", year: 2019, rating: 4.7, genre: "Action" },
  { id: "s11", title: "True Detective", year: 2014, rating: 4.7, genre: "Mystery" },
  { id: "s12", title: "Chernobyl", year: 2019, rating: 4.8, genre: "Drama" },
  { id: "s13", title: "Dark", year: 2017, rating: 4.8, genre: "Sci-Fi" },
  { id: "s14", title: "Succession", year: 2018, rating: 4.8, genre: "Drama" },
  { id: "s15", title: "The White Lotus", year: 2021, rating: 4.7, genre: "Mystery" },
  { id: "s16", title: "Mindhunter", year: 2017, rating: 4.7, genre: "Drama" },
];

export default function Shows() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdShows, setCreatedShows] = useState<any[]>([]);
  const [showPosts, setShowPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
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

  // Load show posts from backend
  useEffect(() => {
    const loadShowPosts = async () => {
      try {
        setLoadingPosts(true);
        const response = await contentApi.getPosts({ category: 'show' });
        const showPosts = response.posts.map(post => {
          try {
            const content = JSON.parse(post.content);
            return {
              id: post.postId,
              title: post.title,
              description: content.description || '',
              genre: content.genre || 'Drama',
              year: parseInt(content.year) || 2024,
              rating: 4.0
            };
          } catch {
            return {
              id: post.postId,
              title: post.title,
              description: post.content,
              genre: 'Drama',
              year: 2024,
              rating: 4.0
            };
          }
        });
        setShowPosts(showPosts);
      } catch (error) {
        console.error('Failed to load show posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadShowPosts();
  }, []);

  const allShowsWithCreated = [...createdShows, ...showPosts, ...allShows];
  const filteredShows = allShowsWithCreated.filter((show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePost = async () => {
    if (!title.trim() || !description.trim() || !user?.id) return;
    
    try {
      setIsSubmitting(true);
      const showContent = JSON.stringify({
        description: description.trim(),
        genre: genre.trim() || "Drama",
        year: year.trim() || "2024"
      });
      
      await contentApi.createPost({
        title: title.trim(),
        content: showContent,
        category: "show"
      });
      
      // Add to local state for immediate display
      const newShow = {
        id: `show-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        genre: genre.trim() || "Drama",
        year: parseInt(year) || 2024,
        rating: 4.0
      };
      setCreatedShows(prev => [newShow, ...prev]);
      
      toast({ title: "Show post created successfully!" });
      setTitle("");
      setDescription("");
      setGenre("");
      setYear("");
      setShowCreateModal(false);
      // Reload posts to get the latest from backend
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({ title: "Failed to create post", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-media-dark-raspberry mb-6">
            Discover Shows
          </h1>

          {/* Search Bar and Create Button */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
              <input
                type="text"
                placeholder="Search shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all text-lg"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-4 bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-white rounded-2xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Show Post
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            filters={showFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* Main Grid */}
          <div className="flex-1 space-y-6 animate-slide-up">
            {/* Sorting Tabs */}
            <div className="flex gap-4 pb-4 border-b border-media-pearl-aqua/20">
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

            {/* Shows Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loadingPosts ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/70 text-lg">Loading shows...</p>
                </div>
              ) : filteredShows.length > 0 ? (
                filteredShows.map((show) => (
                  <MediaCard
                    key={show.id}
                    id={show.id}
                    title={show.title}
                    year={show.year}
                    rating={show.rating}
                    genre={show.genre}
                    type="show"
                    size="medium"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/50 text-lg">
                    No shows found matching your search.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Show Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-media-dark-raspberry">Create Show Post</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                  Show Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter show title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Enter show description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Genre
                  </label>
                  <input
                    type="text"
                    placeholder="Drama"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!title.trim() || !description.trim() || isSubmitting}
                  className="flex-1 px-4 py-2 bg-media-pearl-aqua text-white rounded-lg hover:bg-media-berry-crush disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
