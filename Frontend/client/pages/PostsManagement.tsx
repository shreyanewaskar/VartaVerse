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
  Heart,
  MessageCircle,
  Calendar,
  MoreVertical,
  Download,
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

interface PostItem {
  id: string;
  creator: string;
  creatorAvatar: string;
  mediaTitle: string;
  type: "post" | "review";
  content: string;
  status: "approved" | "pending" | "reported";
  likes: number;
  comments: number;
  dateCreated: string;
}

const mockPosts: PostItem[] = [
  { id: "1", creator: "user123", creatorAvatar: "U", mediaTitle: "Dune: Part Two", type: "review", content: "Absolutely mind-blowing! The cinematography and storytelling...", status: "approved", likes: 342, comments: 28, dateCreated: "2 days ago" },
  { id: "2", creator: "filmfan", creatorAvatar: "F", mediaTitle: "The Midnight Library", type: "post", content: "Just finished reading this incredible book. It made me rethink...", status: "approved", likes: 189, comments: 15, dateCreated: "3 days ago" },
  { id: "3", creator: "serieslover", creatorAvatar: "S", mediaTitle: "Stranger Things", type: "review", content: "The new season is absolutely incredible! The plot twists...", status: "pending", likes: 567, comments: 42, dateCreated: "1 day ago" },
  { id: "4", creator: "bookworm", creatorAvatar: "B", mediaTitle: "Project Hail Mary", type: "review", content: "This book completely blew my mind. The science is fascinating...", status: "approved", likes: 234, comments: 19, dateCreated: "4 days ago" },
  { id: "5", creator: "dramaqueen", creatorAvatar: "D", mediaTitle: "The Crown", type: "post", content: "Watching this show is like stepping into a time machine...", status: "reported", likes: 123, comments: 8, dateCreated: "5 days ago" },
  { id: "6", creator: "cinemaphile", creatorAvatar: "C", mediaTitle: "Oppenheimer", type: "review", content: "A masterpiece of filmmaking. The performances are...", status: "approved", likes: 456, comments: 34, dateCreated: "6 days ago" },
  { id: "7", creator: "selfhelp", creatorAvatar: "SH", mediaTitle: "Atomic Habits", type: "post", content: "This book changed my life. The practical advice is...", status: "pending", likes: 278, comments: 22, dateCreated: "2 days ago" },
  { id: "8", creator: "tvfan", creatorAvatar: "TV", mediaTitle: "Breaking Bad", type: "review", content: "The best TV show ever made. Every episode is perfection...", status: "approved", likes: 789, comments: 67, dateCreated: "1 week ago" },
];

const recentReports = [
  { id: "r1", postId: "5", creator: "dramaqueen", reason: "Inappropriate content", timestamp: "2 hours ago", status: "pending" },
  { id: "r2", postId: "3", creator: "serieslover", reason: "Spam", timestamp: "5 hours ago", status: "pending" },
  { id: "r3", postId: "7", creator: "selfhelp", reason: "Misleading information", timestamp: "1 day ago", status: "resolved" },
];

export default function PostsManagement() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "post" | "review">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "reported">("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredPosts = mockPosts.filter((item) => {
    const matchesSearch = item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mediaTitle.toLowerCase().includes(searchQuery.toLowerCase());
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

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ddfff7] via-[#93e1d8]/30 to-white">
      {/* Floating Background Motifs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-2xl opacity-10 animate-pulse">⭐</div>
        <div className="absolute top-40 right-20 text-xl opacity-10 animate-pulse" style={{ animationDelay: "0.5s" }}>✨</div>
        <div className="absolute bottom-40 left-1/4 text-lg opacity-10 animate-pulse" style={{ animationDelay: "1s" }}>💬</div>
        <div className="absolute bottom-20 right-1/3 text-xl opacity-10 animate-pulse" style={{ animationDelay: "1.5s" }}>📝</div>
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
                  } else if (item.id === "media") {
                    navigate("/admin/media");
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
                    placeholder="Search posts, users, or media..."
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
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
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
                <h1 className="text-4xl font-bold text-[#aa4465] mb-2">Posts & Reviews Management</h1>
                <p className="text-[#861657]/70 text-lg">
                  View, moderate, and manage all user-generated posts and reviews
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
                      <option value="post">Posts</option>
                      <option value="review">Reviews</option>
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
                      <option>Most Reported</option>
                    </select>
                  </div>

                  {/* View Toggle & Batch Actions */}
                  <div className="flex items-center gap-3">
                    {selectedItems.length > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ffa69e] to-[#93e1d8] text-white">
                        <span className="text-sm font-semibold">{selectedItems.length} selected</span>
                        <button className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 smooth-all text-xs font-semibold">
                          Approve
                        </button>
                        <button className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 smooth-all text-xs font-semibold">
                          Delete
                        </button>
                      </div>
                    )}
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Posts List */}
                <div className={cn("lg:col-span-3", viewMode === "grid" && "lg:col-span-4")}>
                  {viewMode === "table" ? (
                    /* Table View */
                    <div className="bg-white rounded-2xl shadow-md border border-[#ddfff7] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#ddfff7]/50 border-b border-[#93e1d8]/30">
                            <tr>
                              <th className="px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.length === filteredPosts.length && filteredPosts.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedItems(filteredPosts.map(p => p.id));
                                    } else {
                                      setSelectedItems([]);
                                    }
                                  }}
                                  className="rounded accent-[#93e1d8]"
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">ID</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Creator</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Media Title</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Engagement</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#ddfff7]">
                            {filteredPosts.map((item) => (
                              <tr
                                key={item.id}
                                className="hover:bg-[#93e1d8]/10 smooth-all group"
                              >
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => toggleSelectItem(item.id)}
                                    className="rounded accent-[#93e1d8]"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm font-mono text-[#861657]/60">#{item.id}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center text-white text-xs font-bold">
                                      {item.creatorAvatar}
                                    </div>
                                    <div className="text-sm text-[#861657]">@{item.creator}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-semibold text-[#861657]">{item.mediaTitle}</div>
                                  <div className="text-xs text-[#861657]/60 line-clamp-1">{item.content}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cn(
                                    "px-2 py-1 rounded-full text-xs font-semibold capitalize",
                                    item.type === "post" ? "bg-[#93e1d8]/20 text-[#93e1d8]" : "bg-[#ffa69e]/20 text-[#ffa69e]"
                                  )}>
                                    {item.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize", getStatusColor(item.status))}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3 text-sm text-[#861657]">
                                    <div className="flex items-center gap-1">
                                      <Heart className="w-4 h-4 text-[#ffa69e]" />
                                      <span>{item.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MessageCircle className="w-4 h-4 text-[#93e1d8]" />
                                      <span>{item.comments}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1 text-sm text-[#861657]/60">
                                    <Calendar className="w-4 h-4" />
                                    <span>{item.dateCreated}</span>
                                  </div>
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
                        <div className="text-sm text-[#861657]/60">Showing 1-8 of {filteredPosts.length} posts</div>
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
                      {filteredPosts.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-4 shadow-md border border-[#ddfff7] hover:shadow-xl hover:-translate-y-1 smooth-all group"
                        >
                          {/* Creator Info */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center text-white text-sm font-bold">
                              {item.creatorAvatar}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-[#861657]">@{item.creator}</div>
                              <div className="text-xs text-[#861657]/60">{item.dateCreated}</div>
                            </div>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize", getStatusColor(item.status))}>
                              {item.status}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="space-y-2 mb-3">
                            <div className="text-sm font-semibold text-[#aa4465]">{item.mediaTitle}</div>
                            <p className="text-sm text-[#861657]/70 line-clamp-2">{item.content}</p>
                            <span className={cn(
                              "inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize",
                              item.type === "post" ? "bg-[#93e1d8]/20 text-[#93e1d8]" : "bg-[#ffa69e]/20 text-[#ffa69e]"
                            )}>
                              {item.type}
                            </span>
                          </div>

                          {/* Engagement */}
                          <div className="flex items-center gap-4 text-sm text-[#861657]/60 mb-3 pb-3 border-b border-[#ddfff7]">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-[#ffa69e]" />
                              <span>{item.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4 text-[#93e1d8]" />
                              <span>{item.comments}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 smooth-all">
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
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity / Reports Panel */}
                {viewMode === "table" && (
                  <div className="lg:col-span-1 space-y-4">
                    {/* Recent Reports */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">Recent Reports</h3>
                      <div className="space-y-3">
                        {recentReports.map((report) => (
                          <div
                            key={report.id}
                            className="p-3 rounded-xl bg-[#ddfff7]/50 hover:bg-[#ddfff7] smooth-all border border-[#93e1d8]/20 hover:shadow-md hover:-translate-y-0.5 transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#861657]">@{report.creator}</div>
                                <div className="text-xs text-[#861657]/60 mt-1">{report.reason}</div>
                              </div>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-semibold",
                                report.status === "pending" ? "bg-[#ffa69e]/20 text-[#ffa69e]" : "bg-[#93e1d8]/20 text-[#93e1d8]"
                              )}>
                                {report.status}
                              </span>
                            </div>
                            <div className="text-xs text-[#861657]/50 mb-2">{report.timestamp}</div>
                            {report.status === "pending" && (
                              <div className="flex gap-2 mt-2">
                                <button className="flex-1 px-2 py-1.5 rounded-lg bg-[#93e1d8] text-white text-xs font-semibold hover:bg-[#93e1d8]/80 smooth-all">
                                  Resolve
                                </button>
                                <button className="flex-1 px-2 py-1.5 rounded-lg bg-[#ffa69e] text-white text-xs font-semibold hover:bg-[#ffa69e]/80 smooth-all">
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <span className="text-sm text-[#861657]">Total Posts</span>
                          <span className="font-bold text-[#861657]">{mockPosts.filter(p => p.type === "post").length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <span className="text-sm text-[#861657]">Total Reviews</span>
                          <span className="font-bold text-[#861657]">{mockPosts.filter(p => p.type === "review").length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffa69e]/20 border border-[#ffa69e]/30">
                          <span className="text-sm text-[#861657]">Pending</span>
                          <span className="font-bold text-[#ffa69e]">{mockPosts.filter(p => p.status === "pending").length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#aa4465]/20 border border-[#aa4465]/30">
                          <span className="text-sm text-[#861657]">Reported</span>
                          <span className="font-bold text-[#aa4465]">{mockPosts.filter(p => p.status === "reported").length}</span>
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
            <a href="#" className="hover:text-[#aa4465] smooth-all">Terms</a>
            <a href="#" className="hover:text-[#aa4465] smooth-all">Privacy</a>
          </div>
          <p className="text-xs">© 2024 VartaVerse Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

