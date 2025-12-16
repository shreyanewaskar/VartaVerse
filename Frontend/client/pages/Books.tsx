import { useState, useEffect } from "react";
import { Search, Plus, X, Bookmark } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import MediaCard from "@/components/MediaCard";
import { contentApi } from "@/lib/content-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type SortBy = "popular" | "toprated" | "newreleases" | "alphabetical" | "bookmarks";

const bookFilters = [
  {
    title: "Genre",
    options: [
      { id: "fiction", label: "Fiction" },
      { id: "mystery", label: "Mystery" },
      { id: "scifi", label: "Sci-Fi" },
      { id: "romance", label: "Romance" },
      { id: "drama", label: "Drama" },
      { id: "selfhelp", label: "Self-Help" },
    ],
  },
  {
    title: "Publication Year",
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

const allBooks = [
  { id: "b1", title: "The Midnight Library", year: 2020, rating: 4.8, genre: "Fiction" },
  { id: "b2", title: "Project Hail Mary", year: 2021, rating: 4.9, genre: "Sci-Fi" },
  { id: "b3", title: "Dune", year: 1965, rating: 4.7, genre: "Sci-Fi" },
  { id: "b4", title: "Atomic Habits", year: 2018, rating: 4.8, genre: "Self-Help" },
  { id: "b5", title: "The Silent Patient", year: 2019, rating: 4.8, genre: "Mystery" },
  { id: "b6", title: "Lessons in Chemistry", year: 2022, rating: 4.7, genre: "Fiction" },
  { id: "b7", title: "The Midnight Gamer", year: 2023, rating: 4.6, genre: "Mystery" },
  { id: "b8", title: "One Piece of Truth", year: 2022, rating: 4.5, genre: "Drama" },
  { id: "b9", title: "The Iron Widow", year: 2023, rating: 4.8, genre: "Sci-Fi" },
  { id: "b10", title: "Circe", year: 2018, rating: 4.7, genre: "Fiction" },
  { id: "b11", title: "The Haunting of Maddy Clare", year: 2006, rating: 4.6, genre: "Mystery" },
  { id: "b12", title: "Six of Crows", year: 2015, rating: 4.8, genre: "Fantasy" },
  { id: "b13", title: "Piranesi", year: 2020, rating: 4.7, genre: "Fiction" },
  { id: "b14", title: "Verity", year: 2018, rating: 4.7, genre: "Thriller" },
  { id: "b15", title: "The Song of Achilles", year: 2011, rating: 4.8, genre: "Romance" },
  { id: "b16", title: "A Deadly Education", year: 2021, rating: 4.6, genre: "Fantasy" },
];

export default function Books() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooks, setCreatedBooks] = useState<any[]>([]);
  const [bookPosts, setBookPosts] = useState<any[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
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

  const handleCreatePost = async () => {
    if (!title.trim() || !author.trim() || !description.trim() || !user?.id) return;
    
    try {
      setIsSubmitting(true);
      const bookContent = JSON.stringify({
        author: author.trim(),
        description: description.trim(),
        genre: genre.trim() || "Fiction",
        year: year.trim() || "2024"
      });
      
      await contentApi.createPost({
        title: title.trim(),
        content: bookContent,
        category: "book"
      });
      
      // Add to local state for immediate display
      const newBook = {
        id: `book-${Date.now()}`,
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        genre: genre.trim() || "Fiction",
        year: parseInt(year) || 2024,
        rating: 4.0
      };
      setCreatedBooks(prev => [newBook, ...prev]);
      setAllBooks(prev => [newBook, ...prev]);
      
      toast({ title: "Book post created successfully!" });
      // Reload posts to get the latest from backend
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setTitle("");
      setAuthor("");
      setDescription("");
      setGenre("");
      setYear("");
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({ title: "Failed to create post", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load book posts from backend
  useEffect(() => {
    const loadBookPosts = async () => {
      try {
        setLoadingPosts(true);
        
        if (sortBy === 'bookmarks') {
          // First API: Get all posts
          const response = await contentApi.getPosts();
          const allPosts = response.posts || [];
          
          const bookmarkedBooks = [];
          // Filter for book category and check likes
          for (const post of allPosts) {
            if (post.category === 'book') {
              try {
                // Second API: Get likes count for each book post
                const likesResponse = await contentApi.getLikes(post.postId);
                if (likesResponse.count > 0) {
                  try {
                    const content = JSON.parse(post.content);
                    bookmarkedBooks.push({
                      id: post.postId,
                      title: post.title,
                      author: content.author || 'Unknown Author',
                      genre: content.genre || 'Fiction',
                      year: parseInt(content.year) || 2024,
                      rating: 4.0,
                      description: content.description || ''
                    });
                  } catch {
                    bookmarkedBooks.push({
                      id: post.postId,
                      title: post.title,
                      author: 'Unknown Author',
                      genre: 'Fiction',
                      year: 2024,
                      rating: 4.0,
                      description: post.content
                    });
                  }
                }
              } catch (err) {
                console.error('Failed to get likes for book post:', post.postId);
              }
            }
          }
          
          setBookPosts(bookmarkedBooks);
          setAllBooks(bookmarkedBooks);
          setFilteredBooks(bookmarkedBooks);
        } else {
          const response = await contentApi.getPosts({ category: 'book' });
          const bookPosts = await Promise.all(
            response.posts.map(async (post) => {
              try {
                const content = JSON.parse(post.content);
                const avgRating = await contentApi.getAverageRating(post.id?.toString() || post.postId?.toString()).catch(() => 0);
                return {
                  id: post.postId,
                  title: post.title,
                  author: content.author || 'Unknown Author',
                  genre: content.genre || 'Fiction',
                  year: parseInt(content.year) || 2024,
                  rating: avgRating,
                  description: content.description || ''
                };
              } catch {
                const avgRating = await contentApi.getAverageRating(post.id?.toString() || post.postId?.toString()).catch(() => 0);
                return {
                  id: post.postId,
                  title: post.title,
                  author: 'Unknown Author',
                  genre: 'Fiction',
                  year: 2024,
                  rating: avgRating,
                  description: post.content
                };
              }
            })
          );
          setBookPosts(bookPosts);
          const allBooksData = [...createdBooks, ...bookPosts];
          setAllBooks(allBooksData);
          setFilteredBooks(allBooksData);
        }
      } catch (error) {
        console.error('Failed to load book posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadBookPosts();
  }, [sortBy]);

  // Filter books based on selected filters and search term
  useEffect(() => {
    let filtered = [...allBooks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sidebar filters
    Object.entries(selectedFilters).forEach(([category, options]) => {
      if (options.length > 0) {
        filtered = filtered.filter(book => {
          if (category === 'Genre') {
            const bookGenre = (book.genre || 'fiction').toLowerCase();
            return options.some(option => bookGenre.includes(option.toLowerCase()));
          }
          
          if (category === 'Publication Year') {
            const bookYear = book.year?.toString() || '2024';
            return options.includes(bookYear);
          }
          
          if (category === 'User Score') {
            const rating = book.rating || 0;
            return options.some(option => {
              const minRating = parseInt(option.replace('plus', ''));
              return rating >= minRating;
            });
          }
          
          return true;
        });
      }
    });

    setFilteredBooks(filtered);
  }, [allBooks, selectedFilters, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-media-dark-raspberry mb-6">
            Discover Books
          </h1>

          {/* Search Bar and Create Button */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
              <input
                type="text"
                placeholder="Search books..."
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
              Create Book Post
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            filters={bookFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* Main Grid */}
          <div className="flex-1 space-y-6 animate-slide-up">
            {/* Sorting Tabs */}
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
                onClick={async () => {
                  try {
                    const bookmarkedBooks = await contentApi.getBookmarkedPosts({ category: 'book' });
                    setFilteredBooks(bookmarkedBooks.posts || []);
                    toast({ title: "Showing bookmarked books" });
                  } catch (error) {
                    console.error('Failed to load bookmarked books:', error);
                    toast({ title: "Failed to load bookmarked books", variant: "destructive" });
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                View Bookmarks
              </button>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loadingPosts ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/70 text-lg">Loading books...</p>
                </div>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div key={book.id} className="relative group">
                    <MediaCard
                      id={book.id}
                      title={book.title}
                      year={book.year}
                      rating={book.rating}
                      genre={book.genre}
                      type="book"
                      size="medium"
                    />
                    <button
                      onClick={async () => {
                        try {
                          await contentApi.bookmarkPost(book.id.toString());
                          toast({ title: "Book bookmarked successfully!" });
                        } catch (error) {
                          console.error('Failed to bookmark:', error);
                          toast({ title: "Failed to bookmark book", variant: "destructive" });
                        }
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      title="Bookmark this book"
                    >
                      <svg className="w-4 h-4 text-media-dark-raspberry" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/50 text-lg">
                    {sortBy === 'bookmarks' ? 'No bookmarked books found.' : 'No books found matching your search.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Book Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-media-dark-raspberry">Create Book Post</h3>
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
                  Book Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter book title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  placeholder="Enter author name..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Enter book description..."
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
                    placeholder="Fiction"
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
                  disabled={!title.trim() || !author.trim() || !description.trim() || isSubmitting}
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
