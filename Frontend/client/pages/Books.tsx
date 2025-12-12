import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import MediaCard from "@/components/MediaCard";
import { contentApi } from "@/lib/content-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type SortBy = "popular" | "toprated" | "newreleases" | "alphabetical";

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
    title: "Format",
    options: [
      { id: "hardcover", label: "Hardcover" },
      { id: "paperback", label: "Paperback" },
      { id: "ebook", label: "E-Book" },
      { id: "audiobook", label: "Audiobook" },
    ],
  },
  {
    title: "Author",
    options: [
      { id: "kingauthor", label: "Stephen King" },
      { id: "austinauthor", label: "Jane Austen" },
      { id: "martian", label: "Andy Weir" },
      { id: "collinsauthor", label: "Suzanne Collins" },
      { id: "rowlingauthor", label: "J.K. Rowling" },
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
        const response = await contentApi.getPosts({ category: 'book' });
        const bookPosts = response.posts.map(post => {
          try {
            const content = JSON.parse(post.content);
            return {
              id: post.postId,
              title: post.title,
              author: content.author || 'Unknown Author',
              genre: content.genre || 'Fiction',
              year: parseInt(content.year) || 2024,
              rating: 4.0,
              description: content.description || ''
            };
          } catch {
            return {
              id: post.postId,
              title: post.title,
              author: 'Unknown Author',
              genre: 'Fiction',
              year: 2024,
              rating: 4.0,
              description: post.content
            };
          }
        });
        setBookPosts(bookPosts);
      } catch (error) {
        console.error('Failed to load book posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadBookPosts();
  }, []);

  const allBooksWithCreated = [...createdBooks, ...bookPosts, ...allBooks];
  const filteredBooks = allBooksWithCreated.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loadingPosts ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/70 text-lg">Loading books...</p>
                </div>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <MediaCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    year={book.year}
                    rating={book.rating}
                    genre={book.genre}
                    type="book"
                    size="medium"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-media-dark-raspberry/50 text-lg">
                    No books found matching your search.
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
