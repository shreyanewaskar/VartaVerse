import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Bookmark,
  Grid3x3,
  List,
  Eye,
  X,
  Folder,
  Star,
  ChevronDown,
  Film,
  Tv,
  BookOpen,
  FileText,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkItem {
  id: string;
  type: "post" | "book" | "movie" | "show";
  title: string;
  subtitle?: string;
  description: string;
  cover: string;
  rating?: number;
  savedDate: string;
  folder?: string;
  viewCount?: number;
}

const bookmarks: BookmarkItem[] = [
  {
    id: "bm1",
    type: "book",
    title: "The Secret Garden",
    subtitle: "Frances Hodgson Burnett",
    description: "A timeless tale of magic, friendship, and the healing power of nature.",
    cover: "🌿",
    rating: 4.8,
    savedDate: "2 days ago",
    folder: "Favorites",
    viewCount: 12,
  },
  {
    id: "bm2",
    type: "post",
    title: "Midnight Reading Session",
    description: "There's something magical about reading under fairy lights ✨",
    cover: "📖",
    savedDate: "3 days ago",
    folder: "To Read",
    viewCount: 8,
  },
  {
    id: "bm3",
    type: "movie",
    title: "The Little Prince",
    subtitle: "Mark Osborne",
    description: "A beautiful animated adaptation of the classic story.",
    cover: "⭐",
    rating: 4.9,
    savedDate: "1 week ago",
    folder: "Watch Later",
    viewCount: 5,
  },
  {
    id: "bm4",
    type: "show",
    title: "Anne with an E",
    subtitle: "Moira Walley-Beckett",
    description: "A coming-of-age story about an orphan girl.",
    cover: "📺",
    savedDate: "1 week ago",
    folder: "Watch Later",
    viewCount: 15,
  },
  {
    id: "bm5",
    type: "book",
    title: "Little Women",
    subtitle: "Louisa May Alcott",
    description: "The heartwarming story of four sisters growing up during the Civil War.",
    cover: "👭",
    rating: 4.8,
    savedDate: "2 weeks ago",
    folder: "Favorites",
    viewCount: 20,
  },
  {
    id: "bm6",
    type: "post",
    title: "Cozy Corner Setup",
    description: "Perfect reading nook with all my favorites nearby 💫",
    cover: "💫",
    savedDate: "2 weeks ago",
    folder: "My Collections",
    viewCount: 10,
  },
  {
    id: "bm7",
    type: "movie",
    title: "Pride and Prejudice",
    subtitle: "Joe Wright",
    description: "Elizabeth Bennet and Mr. Darcy's timeless love story.",
    cover: "💐",
    rating: 4.7,
    savedDate: "3 weeks ago",
    folder: "Favorites",
    viewCount: 18,
  },
  {
    id: "bm8",
    type: "show",
    title: "The Crown",
    subtitle: "Peter Morgan",
    description: "Follow the reign of Queen Elizabeth II.",
    cover: "👑",
    savedDate: "1 month ago",
    folder: "Watch Later",
    viewCount: 7,
  },
];

const folders = [
  { id: "f1", name: "Favorites", icon: "⭐", count: 3 },
  { id: "f2", name: "To Read", icon: "📚", count: 2 },
  { id: "f3", name: "Watch Later", icon: "📺", count: 3 },
  { id: "f4", name: "My Collections", icon: "📁", count: 1 },
];

const categories = ["All", "Posts", "Books", "Movies", "Shows"];
const sortOptions = ["Newest Saved", "Oldest Saved", "Type", "Most Viewed", "Highest Rated"];

const getTypeIcon = (type: BookmarkItem["type"]) => {
  switch (type) {
    case "book":
      return <BookOpen className="h-4 w-4" />;
    case "movie":
      return <Film className="h-4 w-4" />;
    case "show":
      return <Tv className="h-4 w-4" />;
    case "post":
      return <FileText className="h-4 w-4" />;
  }
};

export default function Bookmarks() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Newest Saved");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BookmarkItem | null>(null);
  const [showFolders, setShowFolders] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = bookmarks.filter((item) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(query) ||
        item.subtitle?.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.folder?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Folder filter
    if (selectedFolder) {
      const folder = folders.find((f) => f.id === selectedFolder);
      if (folder && item.folder !== folder.name) return false;
    }
    
    // Category filter
    if (activeCategory === "All") return true;
    return item.type === activeCategory.toLowerCase().slice(0, -1) as BookmarkItem["type"];
  });

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case "Newest Saved":
        return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
      case "Oldest Saved":
        return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
      case "Type":
        return a.type.localeCompare(b.type);
      case "Most Viewed":
        return (b.viewCount || 0) - (a.viewCount || 0);
      case "Highest Rated":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const groupedBookmarks = {
    "Saved This Week": sortedBookmarks.filter((item) => item.savedDate.includes("day") || item.savedDate.includes("week")),
    "Most Viewed by You": [...sortedBookmarks].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3),
    "Your Top Bookmarks": sortedBookmarks.filter((item) => item.rating && item.rating >= 4.7),
    "Books You Liked": sortedBookmarks.filter((item) => item.type === "book" && item.rating && item.rating >= 4.5),
    "Movies You Saved Recently": sortedBookmarks.filter((item) => item.type === "movie"),
  };

  const removeBookmark = (id: string) => {
    // In a real app, this would update state/API
    console.log("Remove bookmark:", id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua text-media-dark-raspberry">
      {/* Floating Background Motifs */}
      <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-media-pearl-aqua/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-20 h-64 w-64 rounded-full bg-media-powder-blush/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-media-pearl-aqua/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]" />

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute top-32 left-8 text-3xl opacity-10">📑</div>
      <div className="pointer-events-none absolute top-64 right-16 text-3xl opacity-10">✨</div>
      <div className="pointer-events-none absolute bottom-32 left-1/3 text-3xl opacity-10">📌</div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:py-8">
        {/* Header / Navbar */}
        <header className="sticky top-4 z-20">
          <div className="glass flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-5 py-3 shadow-2xl shadow-media-frozen-water/60">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-media-pearl-aqua/30 hover:shadow-md hover:shadow-media-pearl-aqua/50"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-media-berry-crush">Bookmarks</h1>
              <span className="rounded-full bg-media-pearl-aqua/60 px-2.5 py-0.5 text-xs font-bold text-white">
                {sortedBookmarks.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-4 py-2 text-sm font-semibold text-media-dark-raspberry shadow-md transition hover:bg-media-pearl-aqua/20"
                >
                  Sort: {sortBy}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-12 z-20 min-w-[180px] rounded-xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-media-dark-raspberry transition hover:bg-media-pearl-aqua/20",
                          sortBy === option && "bg-media-pearl-aqua/30"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => alert("More options coming soon!")}
                className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-media-pearl-aqua/30 hover:shadow-md"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-media-dark-raspberry/50" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/50 bg-white/70 py-3 pl-12 pr-4 text-sm font-medium text-media-dark-raspberry placeholder-media-dark-raspberry/50 shadow-md transition focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-media-dark-raspberry/50 hover:bg-media-pearl-aqua/20 hover:text-media-dark-raspberry"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                  activeCategory === category
                    ? "bg-white/70 text-media-dark-raspberry shadow-lg shadow-media-pearl-aqua/40"
                    : "bg-white/40 text-media-dark-raspberry/70 hover:bg-white/60 hover:shadow-md hover:shadow-media-pearl-aqua/30"
                )}
              >
                {category}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua" />
                )}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 p-1 shadow-md">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-full p-2 transition",
                viewMode === "grid"
                  ? "bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-white shadow-lg"
                  : "text-media-dark-raspberry hover:bg-media-pearl-aqua/20"
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-full p-2 transition",
                viewMode === "list"
                  ? "bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-white shadow-lg"
                  : "text-media-dark-raspberry hover:bg-media-pearl-aqua/20"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bookmark Folders */}
        {showFolders && (
          <div className="flex flex-wrap items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setSelectedFolder(null)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 bg-white/70 px-4 py-2.5 text-sm font-semibold transition-all",
                selectedFolder === null
                  ? "border-media-pearl-aqua shadow-lg shadow-media-pearl-aqua/40"
                  : "border-white/60 text-media-dark-raspberry hover:border-media-pearl-aqua/60 hover:shadow-md"
              )}
            >
              <span>📁</span>
              All Items
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={cn(
                  "group flex items-center gap-2 rounded-xl border-2 bg-white/70 px-4 py-2.5 text-sm font-semibold transition-all",
                  selectedFolder === folder.id
                    ? "border-media-pearl-aqua shadow-lg shadow-media-pearl-aqua/40"
                    : "border-white/60 text-media-dark-raspberry hover:border-media-pearl-aqua/60 hover:shadow-md hover:shadow-media-pearl-aqua/30"
                )}
              >
                <span className="text-lg">{folder.icon}</span>
                <span>{folder.name}</span>
                <span className="rounded-full bg-media-powder-blush px-2 py-0.5 text-xs font-bold text-white">
                  {folder.count}
                </span>
              </button>
            ))}
            <button 
              onClick={() => alert("New folder feature coming soon!")}
              className="flex items-center gap-2 rounded-xl border-2 border-dashed border-media-pearl-aqua/60 bg-white/40 px-4 py-2.5 text-sm font-semibold text-media-dark-raspberry transition hover:bg-white/60 hover:border-media-pearl-aqua"
            >
              <Plus className="h-4 w-4" />
              New Folder
            </button>
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-media-dark-raspberry/70">
            <Search className="h-4 w-4" />
            <span>
              {sortedBookmarks.length} result{sortedBookmarks.length !== 1 ? 's' : ''} for "{searchQuery}"
            </span>
            {sortedBookmarks.length > 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-media-pearl-aqua hover:text-media-berry-crush"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {sortedBookmarks.length === 0 ? (
          /* Empty State */
          <div className="glass flex flex-col items-center justify-center rounded-3xl border border-white/50 bg-white/40 p-16 shadow-lg">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-5xl shadow-inner">
              📑
            </div>
            <h2 className="mb-2 text-2xl font-bold text-media-berry-crush">
              {searchQuery ? 'No results found' : 'No bookmarks yet.'}
            </h2>
            <p className="mb-6 text-center text-media-dark-raspberry/70">
              {searchQuery 
                ? `No bookmarks match "${searchQuery}". Try a different search term.`
                : 'Save posts, books, movies, or shows to revisit anytime.'
              }
            </p>
            <button
              onClick={() => navigate("/feed")}
              className="rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua px-6 py-3 text-sm font-bold text-white shadow-lg shadow-media-powder-blush/40 transition hover:scale-105"
            >
              Explore Content
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Smart Auto-Grouping */}
            {Object.entries(groupedBookmarks).map(([groupName, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={groupName} className="space-y-4">
                  <h3 className="text-lg font-bold text-media-berry-crush">{groupName}</h3>
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {items.map((item) => (
                        <BookmarkCard
                          key={item.id}
                          item={item}
                          viewMode="grid"
                          onHover={() => setHoveredItem(item.id)}
                          onHoverLeave={() => setHoveredItem(null)}
                          isHovered={hoveredItem === item.id}
                          onClick={() => setSelectedItem(item)}
                          onRemove={() => removeBookmark(item.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <BookmarkCard
                          key={item.id}
                          item={item}
                          viewMode="list"
                          onHover={() => setHoveredItem(item.id)}
                          onHoverLeave={() => setHoveredItem(null)}
                          isHovered={hoveredItem === item.id}
                          onClick={() => setSelectedItem(item)}
                          onRemove={() => removeBookmark(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Preview Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="glass relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/50 bg-white/90 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-32 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-media-pearl-aqua/60 to-media-powder-blush/60 text-5xl shadow-lg">
                    {selectedItem.cover}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-media-berry-crush">{selectedItem.title}</h2>
                    {selectedItem.subtitle && (
                      <p className="mt-1 text-lg text-media-dark-raspberry/70">{selectedItem.subtitle}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-media-pearl-aqua/60 px-3 py-1 text-xs font-semibold text-white">
                        {getTypeIcon(selectedItem.type)}
                        <span className="ml-1 capitalize">{selectedItem.type}</span>
                      </span>
                      {selectedItem.rating && (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-4 w-4",
                                star <= selectedItem.rating!
                                  ? "fill-media-powder-blush text-media-powder-blush"
                                  : "text-media-berry-crush/20"
                              )}
                            />
                          ))}
                          <span className="ml-1 text-sm font-semibold text-media-dark-raspberry/70">
                            {selectedItem.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-base leading-relaxed text-media-dark-raspberry/80">{selectedItem.description}</p>

                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={() => {
                      setSelectedItem(null);
                      navigate(`/media/m1`);
                    }}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua px-6 py-3 text-sm font-bold text-white shadow-lg shadow-media-powder-blush/40 transition hover:scale-105"
                  >
                    <Eye className="h-4 w-4" />
                    Open Full Content
                  </button>
                  <button 
                    onClick={() => alert("Add to folder feature coming soon!")}
                    className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-5 py-2.5 text-sm font-semibold text-media-dark-raspberry transition hover:bg-media-pearl-aqua/20"
                  >
                    <Folder className="h-4 w-4" />
                    Add to Folder
                  </button>
                  <button
                    onClick={() => {
                      removeBookmark(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-5 py-2.5 text-sm font-semibold text-media-dark-raspberry transition hover:bg-media-powder-blush/20"
                  >
                    <Bookmark className="h-4 w-4" />
                    Remove Bookmark
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BookmarkCardProps {
  item: BookmarkItem;
  viewMode: "grid" | "list";
  onHover: () => void;
  onHoverLeave: () => void;
  isHovered: boolean;
  onClick: () => void;
  onRemove: () => void;
}

function BookmarkCard({ item, viewMode, onHover, onHoverLeave, isHovered, onClick, onRemove }: BookmarkCardProps) {
  if (viewMode === "list") {
    return (
      <div
        onMouseEnter={onHover}
        onMouseLeave={onHoverLeave}
        onClick={onClick}
        className="group relative flex items-center gap-4 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-media-pearl-aqua/50"
      >
        <div className="flex h-20 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-3xl shadow-inner">
          {item.cover}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-media-berry-crush">{item.title}</h3>
          {item.subtitle && <p className="text-sm text-media-dark-raspberry/70">{item.subtitle}</p>}
          <p className="mt-1 line-clamp-1 text-sm text-media-dark-raspberry/60">{item.description}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-media-dark-raspberry/50">
            <span className="rounded-full bg-media-pearl-aqua/60 px-2 py-0.5 text-white">
              {getTypeIcon(item.type)}
              <span className="ml-1 capitalize">{item.type}</span>
            </span>
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-media-powder-blush text-media-powder-blush" />
                <span>{item.rating}</span>
              </div>
            )}
            <span>{item.savedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 fill-media-powder-blush text-media-powder-blush" />
          {isHovered && (
            <div className="flex items-center gap-2 animate-fade-in">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="rounded-full bg-media-frozen-water p-2 text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onHoverLeave}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-media-pearl-aqua/50"
    >
      <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-5xl shadow-inner">
        {item.cover}
      </div>
      <div className="absolute right-3 top-3">
        <Bookmark className="h-5 w-5 fill-media-powder-blush text-media-powder-blush drop-shadow-md" />
      </div>
      <h3 className="mb-1 font-bold text-media-berry-crush">{item.title}</h3>
      {item.subtitle && <p className="mb-2 text-sm text-media-dark-raspberry/70">{item.subtitle}</p>}
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-media-pearl-aqua/60 px-2 py-0.5 text-xs font-semibold text-white">
          {getTypeIcon(item.type)}
          <span className="ml-1 capitalize">{item.type}</span>
        </span>
        {item.rating && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-3 w-3",
                  star <= item.rating!
                    ? "fill-media-powder-blush text-media-powder-blush"
                    : "text-media-berry-crush/20"
                )}
              />
            ))}
          </div>
        )}
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-media-dark-raspberry/70">{item.description}</p>
      <p className="text-xs italic text-media-powder-blush">{item.savedDate}</p>

      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-media-pearl-aqua/90 to-media-powder-blush/90 p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-media-dark-raspberry shadow-lg transition hover:scale-105"
          >
            <Eye className="mr-2 inline h-4 w-4" />
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-media-dark-raspberry transition hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
