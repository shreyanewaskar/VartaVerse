import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import MediaCard from "@/components/MediaCard";
import { fetchMovies, fetchDefaultMovies } from "@/lib/movieApi";

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
    title: "Platform",
    options: [
      { id: "netflix", label: "Netflix" },
      { id: "amazon", label: "Amazon Prime" },
      { id: "hulu", label: "Hulu" },
      { id: "disney", label: "Disney+" },
      { id: "cinema", label: "Cinema" },
    ],
  },
  {
    title: "User Score",
    options: [
      { id: "9plus", label: "9.0+ Stars" },
      { id: "8plus", label: "8.0+ Stars" },
      { id: "7plus", label: "7.0+ Stars" },
      { id: "6plus", label: "6.0+ Stars" },
    ],
  },
];



export default function Movies() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Load default movies on component mount
  useEffect(() => {
    const loadDefaultMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchDefaultMovies();
        setMovies(data);
      } catch (err) {
        console.error('Default movies error:', err);
      }
      setLoading(false);
    };
    loadDefaultMovies();
  }, []);

  // Search movies when user types
  useEffect(() => {
    if (!searchTerm) {
      // Load default movies when search is cleared
      const loadDefaultMovies = async () => {
        setLoading(true);
        try {
          const data = await fetchDefaultMovies();
          setMovies(data);
        } catch (err) {
          console.error('Default movies error:', err);
        }
        setLoading(false);
      };
      loadDefaultMovies();
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchMovies(searchTerm);
        setMovies(data);
      } catch (err) {
        console.error('Search error:', err);
        setMovies([]);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

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

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/70 text-lg">Searching...</p>
                </div>
              ) : movies.length > 0 ? (
                movies.map((movie) => (
                  <MediaCard
                    key={movie.imdbID}
                    id={movie.imdbID}
                    title={movie.Title}
                    year={movie.Year}
                    rating={"N/A"}
                    genre={movie.Type}
                    type="movie"
                    size="medium"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/50 text-lg">No movies found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
