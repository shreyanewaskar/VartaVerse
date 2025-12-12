import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Film,
  BookOpen,
  FileText,
  AlertTriangle,
  BarChart3,
  Tag,
  Settings,
  Search,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Grid3x3,
  List,
  Filter,
  Star,
  MoreVertical,
  Book,
  Tv,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { id: "media", label: "Media", icon: <Film className="w-5 h-5" /> },
  { id: "posts", label: "Posts & Reviews", icon: <FileText className="w-5 h-5" /> },
  { id: "reports", label: "Reports", icon: <AlertTriangle className="w-5 h-5" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { id: "categories", label: "Categories & Tags", icon: <Tag className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

interface MediaItem {
  id: string;
  title: string;
  creator: string;
  type: "book" | "movie" | "show";
  genre: string[];
  rating: number;
  likes: number;
  status: "approved" | "pending" | "reported";
  cover?: string;
}

const mockMedia: MediaItem[] = [
  { id: "1", title: "The Midnight Library", creator: "user123", type: "book", genre: ["Fiction", "Philosophy"], rating: 4.8, likes: 1245, status: "approved" },
  { id: "2", title: "Dune: Part Two", creator: "filmfan", type: "movie", genre: ["Sci-Fi", "Action"], rating: 4.7, likes: 3421, status: "approved" },
  { id: "3", title: "Stranger Things", creator: "serieslover", type: "show", genre: ["Sci-Fi", "Horror"], rating: 4.9, likes: 5678, status: "approved" },
  { id: "4", title: "Project Hail Mary", creator: "bookworm", type: "book", genre: ["Sci-Fi"], rating: 4.9, likes: 2341, status: "pending" },
  { id: "5", title: "The Crown", creator: "dramaqueen", type: "show", genre: ["Drama", "History"], rating: 4.6, likes: 2890, status: "approved" },
  { id: "6", title: "Oppenheimer", creator: "cinemaphile", type: "movie", genre: ["Drama", "Biography"], rating: 4.8, likes: 4123, status: "reported" },
  { id: "7", title: "Atomic Habits", creator: "selfhelp", type: "book", genre: ["Self-Help"], rating: 4.7, likes: 1890, status: "approved" },
  { id: "8", title: "Breaking Bad", creator: "tvfan", type: "show", genre: ["Drama", "Crime"], rating: 4.9, likes: 6789, status: "approved" },
];

const quickStats = {
  totalBooks: 2341,
  totalMovies: 1890,
  totalShows: 1447,
  pendingApproval: 23,
  mostPopular: [
    { title: "Breaking Bad", type: "show", likes: 6789 },
    { title: "Stranger Things", type: "show", likes: 5678 },
    { title: "Dune: Part Two", type: "movie", likes: 3421 },
    { title: "Oppenheimer", type: "movie", likes: 4123 },
    { title: "The Midnight Library", type: "book", likes: 1245 },
  ],
};

export default function MediaManagement() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "book" | "movie" | "show">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "reported">("all");
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredMedia = mockMedia.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-[#93e1d8]/20 text-[#93e1d8]";
      case "pending":
        return "bg-[#ffa69e]/20 text-[#ffa69e]";
      case "reported":
        return "bg-[#aa4465]/20 text-[#aa4465]";
      default:
        return "";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <Book className="w-4 h-4" />;
      case "movie":
        return <Film className="w-4 h-4" />;
      case "show":
        return <Tv className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ddfff7] via-[#93e1d8]/30 to-white">
      {/* Floating Background Motifs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-2xl opacity-10 animate-pulse">⭐</div>
        <div className="absolute top-40 right-20 text-xl opacity-10 animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>
        <div className="absolute bottom-40 left-1/4 text-lg opacity-10 animate-pulse" style={{ animationDelay: "1s" }}>🎬</div>
        <div className="absolute bottom-20 right-1/3 text-xl opacity-10 animate-pulse" style={{ animationDelay: "1.5s" }}>📚</div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside
          className={cn(
            "sticky top-0 h-screen bg-[#93e1d8]/80 backdrop-blur-sm border-r border-[#93e1d8]/30 transition-all duration-300 flex flex-col",
            sidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#93e1d8]/30 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#aa4465] to-[#861657] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-[#861657]">Admin</span>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/40 smooth-all text-[#861657]"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "dashboard") {
                    navigate("/admin/dashboard");
                  } else if (item.id === "posts") {
                    navigate("/admin/posts");
                  } else if (item.id === "users") {
                    navigate("/admin/users");
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 smooth-all",
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#ffa69e] to-[#93e1d8] text-white shadow-lg"
                    : "text-[#861657] hover:bg-white/40 hover:text-[#aa4465] hover:shadow-md"
                )}
              >
                <span className={cn(activeTab === item.id && "text-white")}>{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 backdrop-blur-md bg-white/60 border-b border-[#93e1d8]/30 shadow-sm">
            <div className="flex items-center justify-between h-16 px-6">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#aa4465] to-[#861657] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                {!sidebarCollapsed && (
                  <span className="font-bold text-[#861657] hidden md:inline">VartaVerse Admin</span>
                )}
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div
                  className={cn(
                    "w-full relative",
                    searchFocused && "glow-primary"
                  )}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93e1d8] opacity-60" />
                  <input
                    type="text"
                    placeholder="Search media by title, creator, genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white/60 backdrop-blur border border-[#93e1d8]/40 focus:outline-none focus:border-[#93e1d8] focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all text-sm text-[#861657]"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ffa69e] to-[#93e1d8] text-white text-sm font-semibold hover:shadow-lg smooth-all">
                  <Plus className="w-4 h-4" />
                  <span>Add Media</span>
                </button>
                <button className="relative p-2 rounded-full hover:bg-white/40 smooth-all group">
                  <Bell className="w-5 h-5 text-[#861657] group-hover:text-[#aa4465] smooth-all" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-[#ffa69e] rounded-full pulse-badge" />
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-white/40 smooth-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-[#aa4465] mb-2">Media Management</h1>
                <p className="text-[#861657]/70 text-lg">
                  View, edit, and manage all user-created Books, Movies, and Shows
                </p>
              </div>

              {/* Filters and View Toggle */}
              <div className="bg-white rounded-2xl p-4 shadow-md border border-[#ddfff7] mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#861657]/60" />
                      <span className="text-sm font-medium text-[#861657]">Filters:</span>
                    </div>
                    
                    {/* Type Filter */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-lg border border-[#93e1d8]/40 bg-white text-[#861657] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all hover:border-[#93e1d8]"
                    >
                      <option value="all">All Types</option>
                      <option value="book">Books</option>
                      <option value="movie">Movies</option>
                      <option value="show">Shows</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-lg border border-[#93e1d8]/40 bg-white text-[#861657] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all hover:border-[#93e1d8]"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="reported">Reported</option>
                    </select>

                    {/* Sort */}
                    <select className="px-4 py-2 rounded-lg border border-[#93e1d8]/40 bg-white text-[#861657] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all hover:border-[#93e1d8]">
                      <option>Latest</option>
                      <option>Most Liked</option>
                      <option>Top Rated</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center gap-2 bg-[#ddfff7]/50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("table")}
                      className={cn(
                        "p-2 rounded-lg smooth-all",
                        viewMode === "table"
                          ? "bg-white text-[#aa4465] shadow-md"
                          : "text-[#861657]/60 hover:text-[#861657]"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 rounded-lg smooth-all",
                        viewMode === "grid"
                          ? "bg-white text-[#aa4465] shadow-md"
                          : "text-[#861657]/60 hover:text-[#861657]"
                      )}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Media List */}
                <div className={cn("lg:col-span-3", viewMode === "grid" && "lg:col-span-4")}>
                  {viewMode === "table" ? (
                    /* Table View */
                    <div className="bg-white rounded-2xl shadow-md border border-[#ddfff7] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#ddfff7]/50 border-b border-[#93e1d8]/30">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Cover</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Title</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Creator</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Genre</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Rating</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#ddfff7]">
                            {filteredMedia.map((item) => (
                              <tr
                                key={item.id}
                                className="hover:bg-[#93e1d8]/10 smooth-all group"
                              >
                                <td className="px-4 py-3">
                                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center text-white text-xs font-bold">
                                    {getTypeIcon(item.type)}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-semibold text-[#861657]">{item.title}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm text-[#861657]/70">@{item.creator}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1 text-sm text-[#861657]">
                                    {getTypeIcon(item.type)}
                                    <span className="capitalize">{item.type}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {item.genre.slice(0, 2).map((g, i) => (
                                      <span key={i} className="px-2 py-0.5 rounded-full bg-[#93e1d8]/20 text-[#93e1d8] text-xs">
                                        {g}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-[#ffa69e] text-[#ffa69e]" />
                                    <span className="text-sm font-semibold text-[#861657]">{item.rating}</span>
                                    <span className="text-xs text-[#861657]/60">({item.likes})</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize", getStatusColor(item.status))}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button className="p-1.5 rounded-lg hover:bg-[#93e1d8]/20 text-[#861657] smooth-all" title="View">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded-lg hover:bg-[#93e1d8]/20 text-[#861657] smooth-all" title="Edit">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    {item.status === "pending" && (
                                      <button className="p-1.5 rounded-lg hover:bg-[#93e1d8]/20 text-[#93e1d8] smooth-all" title="Approve">
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button className="p-1.5 rounded-lg hover:bg-[#ffa69e]/20 text-[#ffa69e] smooth-all" title="Delete">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination */}
                      <div className="px-4 py-3 border-t border-[#ddfff7] flex items-center justify-between">
                        <div className="text-sm text-[#861657]/60">Showing 1-8 of {filteredMedia.length} media</div>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 rounded-lg border border-[#93e1d8]/40 text-[#861657] hover:bg-[#93e1d8]/20 smooth-all">Previous</button>
                          <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#ffa69e] to-[#93e1d8] text-white">1</button>
                          <button className="px-3 py-1 rounded-lg border border-[#93e1d8]/40 text-[#861657] hover:bg-[#93e1d8]/20 smooth-all">Next</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMedia.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-4 shadow-md border border-[#ddfff7] hover:shadow-xl hover:-translate-y-1 smooth-all group"
                        >
                          {/* Cover */}
                          <div className="w-full h-48 rounded-xl bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center mb-3 relative overflow-hidden">
                            <div className="text-white text-4xl">{getTypeIcon(item.type)}</div>
                            <div className="absolute top-2 right-2">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize text-white", getStatusColor(item.status))}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="space-y-2">
                            <h3 className="font-bold text-[#861657] line-clamp-1">{item.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-[#861657]/60">
                              {getTypeIcon(item.type)}
                              <span className="capitalize">{item.type}</span>
                              <span>•</span>
                              <span>@{item.creator}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.genre.slice(0, 2).map((g, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-[#93e1d8]/20 text-[#93e1d8] text-xs">
                                  {g}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[#ffa69e] text-[#ffa69e]" />
                              <span className="text-sm font-semibold text-[#861657]">{item.rating}</span>
                              <span className="text-xs text-[#861657]/60">({item.likes} likes)</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-[#ddfff7] opacity-0 group-hover:opacity-100 smooth-all">
                              <button className="flex-1 px-3 py-1.5 rounded-lg bg-[#93e1d8]/20 text-[#93e1d8] text-xs font-semibold hover:bg-[#93e1d8] hover:text-white smooth-all flex items-center justify-center gap-1">
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                              <button className="flex-1 px-3 py-1.5 rounded-lg bg-[#93e1d8]/20 text-[#93e1d8] text-xs font-semibold hover:bg-[#93e1d8] hover:text-white smooth-all flex items-center justify-center gap-1">
                                <Edit className="w-3 h-3" />
                                Edit
                              </button>
                              {item.status === "pending" && (
                                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ffa69e] to-[#93e1d8] text-white text-xs font-semibold hover:shadow-lg smooth-all">
                                  <CheckCircle className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats Panel */}
                {viewMode === "table" && (
                  <div className="lg:col-span-1 space-y-4">
                    {/* Stats Cards */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <div className="flex items-center gap-2">
                            <Book className="w-5 h-5 text-[#93e1d8]" />
                            <span className="text-sm text-[#861657]">Books</span>
                          </div>
                          <span className="font-bold text-[#861657]">{quickStats.totalBooks.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <div className="flex items-center gap-2">
                            <Film className="w-5 h-5 text-[#ffa69e]" />
                            <span className="text-sm text-[#861657]">Movies</span>
                          </div>
                          <span className="font-bold text-[#861657]">{quickStats.totalMovies.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <div className="flex items-center gap-2">
                            <Tv className="w-5 h-5 text-[#aa4465]" />
                            <span className="text-sm text-[#861657]">Shows</span>
                          </div>
                          <span className="font-bold text-[#861657]">{quickStats.totalShows.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffa69e]/20 border border-[#ffa69e]/30">
                          <span className="text-sm text-[#861657]">Pending</span>
                          <span className="font-bold text-[#ffa69e]">{quickStats.pendingApproval}</span>
                        </div>
                      </div>
                    </div>

                    {/* Most Popular */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">Most Popular</h3>
                      <div className="space-y-2">
                        {quickStats.mostPopular.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#ddfff7]/50 smooth-all">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffa69e] to-[#93e1d8] flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <div className="text-sm font-semibold text-[#861657]">{item.title}</div>
                                <div className="text-xs text-[#861657]/60 capitalize">{item.type}</div>
                              </div>
                            </div>
                            <span className="text-xs text-[#861657]/60">{item.likes.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Distribution Chart */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">Media Distribution</h3>
                      <div className="h-48 flex items-center justify-center bg-gradient-to-br from-[#ddfff7] to-[#93e1d8]/20 rounded-xl">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-[#ffa69e] mx-auto mb-2" />
                          <p className="text-[#861657]/60 text-sm">Chart visualization</p>
                          <p className="text-xs text-[#861657]/40 mt-1">Pie/Donut chart</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#ddfff7]/50 border-t border-[#93e1d8]/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[#861657]/60">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#aa4465] smooth-all">About</a>
            <a href="#" className="hover:text-[#aa4465] smooth-all">Contact</a>
            <a href="#" className="hover:text-[#aa4465] smooth-all">Terms</a>
            <a href="#" className="hover:text-[#aa4465] smooth-all">Privacy</a>
          </div>
          <p className="text-xs">© 2024 VartaVerse Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

