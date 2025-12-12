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
  Shield,
  Ban,
  UserCheck,
  Grid3x3,
  List,
  Filter,
  Calendar,
  Mail,
  MoreVertical,
  Download,
  TrendingUp,
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

interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "suspended" | "banned";
  createdDate: string;
  posts: number;
  reviews: number;
}

const mockUsers: UserItem[] = [
  { id: "1", name: "Alex Chen", email: "alex@example.com", avatar: "AC", role: "user", status: "active", createdDate: "2024-01-15", posts: 23, reviews: 45 },
  { id: "2", name: "Jordan Lee", email: "jordan@example.com", avatar: "JL", role: "moderator", status: "active", createdDate: "2024-02-20", posts: 67, reviews: 89 },
  { id: "3", name: "Sam Rivera", email: "sam@example.com", avatar: "SR", role: "user", status: "suspended", createdDate: "2024-03-10", posts: 12, reviews: 8 },
  { id: "4", name: "Taylor Kim", email: "taylor@example.com", avatar: "TK", role: "user", status: "active", createdDate: "2024-04-05", posts: 34, reviews: 56 },
  { id: "5", name: "Morgan Park", email: "morgan@example.com", avatar: "MP", role: "admin", status: "active", createdDate: "2024-01-01", posts: 156, reviews: 234 },
  { id: "6", name: "Casey Wong", email: "casey@example.com", avatar: "CW", role: "user", status: "banned", createdDate: "2024-05-12", posts: 5, reviews: 2 },
  { id: "7", name: "Riley Smith", email: "riley@example.com", avatar: "RS", role: "user", status: "active", createdDate: "2024-06-18", posts: 45, reviews: 67 },
  { id: "8", name: "Quinn Johnson", email: "quinn@example.com", avatar: "QJ", role: "moderator", status: "active", createdDate: "2024-02-28", posts: 89, reviews: 123 },
];

const userStats = {
  total: 12450,
  active: 11890,
  suspended: 420,
  banned: 140,
  newSignupsWeekly: 342,
  newSignupsMonthly: 1456,
  mostActive: [
    { name: "Morgan Park", activity: 390, type: "posts & reviews" },
    { name: "Quinn Johnson", activity: 212, type: "posts & reviews" },
    { name: "Jordan Lee", activity: 156, type: "posts & reviews" },
    { name: "Riley Smith", activity: 112, type: "posts & reviews" },
    { name: "Taylor Kim", activity: 90, type: "posts & reviews" },
  ],
};

export default function UserManagement() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "moderator" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "banned">("all");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredUsers = mockUsers.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || item.role === roleFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#93e1d8]/20 text-[#93e1d8]";
      case "suspended":
        return "bg-[#ffa69e]/20 text-[#ffa69e]";
      case "banned":
        return "bg-[#aa4465]/20 text-[#aa4465]";
      default:
        return "";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-[#aa4465] to-[#861657] text-white";
      case "moderator":
        return "bg-[#93e1d8]/20 text-[#93e1d8]";
      case "user":
        return "bg-[#ddfff7] text-[#861657]";
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
        <div className="absolute top-20 left-10 text-2xl opacity-10 animate-pulse">👤</div>
        <div className="absolute top-40 right-20 text-xl opacity-10 animate-pulse" style={{ animationDelay: "0.5s" }}>⭐</div>
        <div className="absolute bottom-40 left-1/4 text-lg opacity-10 animate-pulse" style={{ animationDelay: "1s" }}>✨</div>
        <div className="absolute bottom-20 right-1/3 text-xl opacity-10 animate-pulse" style={{ animationDelay: "1.5s" }}>👥</div>
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
                  } else if (item.id === "posts") {
                    navigate("/admin/posts");
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
                    placeholder="Search by name, email, or role..."
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
                  <span>Add User</span>
                </button>
                <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-[#93e1d8] text-[#861657] text-sm font-semibold hover:bg-[#93e1d8]/20 smooth-all">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
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
                <h1 className="text-4xl font-bold text-[#aa4465] mb-2">User Management</h1>
                <p className="text-[#861657]/70 text-lg">
                  View, manage, and moderate all registered users
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
                    
                    {/* Role Filter */}
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-lg border border-[#93e1d8]/40 bg-white text-[#861657] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all hover:border-[#93e1d8]"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-lg border border-[#93e1d8]/40 bg-white text-[#861657] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all hover:border-[#93e1d8]"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>

                    {/* Sort */}
                    <select className="px-4 py-2 rounded-lg border border-[#93e1d8]/40 bg-white text-[#861657] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all hover:border-[#93e1d8]">
                      <option>Newest First</option>
                      <option>Oldest First</option>
                      <option>Most Active</option>
                      <option>Alphabetical</option>
                    </select>
                  </div>

                  {/* View Toggle & Batch Actions */}
                  <div className="flex items-center gap-3">
                    {selectedItems.length > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ffa69e] to-[#93e1d8] text-white">
                        <span className="text-sm font-semibold">{selectedItems.length} selected</span>
                        <button className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 smooth-all text-xs font-semibold">
                          Suspend
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
                {/* Users List */}
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
                                  checked={selectedItems.length === filteredUsers.length && filteredUsers.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedItems(filteredUsers.map(u => u.id));
                                    } else {
                                      setSelectedItems([]);
                                    }
                                  }}
                                  className="rounded accent-[#93e1d8]"
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Avatar</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Email</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Role</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Created</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-[#861657] uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#ddfff7]">
                            {filteredUsers.map((item) => (
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
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center text-white text-sm font-bold">
                                    {item.avatar}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-semibold text-[#861657]">{item.name}</div>
                                  <div className="text-xs text-[#861657]/60">{item.posts} posts, {item.reviews} reviews</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1 text-sm text-[#861657]">
                                    <Mail className="w-4 h-4 text-[#861657]/40" />
                                    <span>{item.email}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize", getRoleColor(item.role))}>
                                    {item.role}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize", getStatusColor(item.status))}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1 text-sm text-[#861657]/60">
                                    <Calendar className="w-4 h-4" />
                                    <span>{item.createdDate}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <button className="p-1.5 rounded-lg hover:bg-[#93e1d8]/20 text-[#861657] smooth-all" title="View Profile">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 rounded-lg hover:bg-[#93e1d8]/20 text-[#861657] smooth-all" title="Edit">
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    {item.status === "active" && (
                                      <button className="p-1.5 rounded-lg hover:bg-[#ffa69e]/20 text-[#ffa69e] smooth-all" title="Suspend">
                                        <Ban className="w-4 h-4" />
                                      </button>
                                    )}
                                    <button className="p-1.5 rounded-lg hover:bg-[#aa4465]/20 text-[#aa4465] smooth-all" title="Delete">
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
                        <div className="text-sm text-[#861657]/60">Showing 1-8 of {filteredUsers.length} users</div>
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
                      {filteredUsers.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-4 shadow-md border border-[#ddfff7] hover:shadow-xl hover:-translate-y-1 smooth-all group"
                        >
                          {/* Avatar & Name */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center text-white font-bold">
                              {item.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-[#861657]">{item.name}</div>
                              <div className="text-xs text-[#861657]/60">{item.posts} posts, {item.reviews} reviews</div>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-2 text-sm text-[#861657]/70 mb-3">
                            <Mail className="w-4 h-4 text-[#861657]/40" />
                            <span className="truncate">{item.email}</span>
                          </div>

                          {/* Role & Status */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize", getRoleColor(item.role))}>
                              {item.role}
                            </span>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-semibold capitalize", getStatusColor(item.status))}>
                              {item.status}
                            </span>
                          </div>

                          {/* Created Date */}
                          <div className="flex items-center gap-1 text-xs text-[#861657]/60 mb-3 pb-3 border-b border-[#ddfff7]">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {item.createdDate}</span>
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
                            {item.status === "active" && (
                              <button className="px-3 py-1.5 rounded-lg bg-[#ffa69e]/20 text-[#ffa69e] text-xs font-semibold hover:bg-[#ffa69e] hover:text-white smooth-all">
                                <Ban className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats Panel */}
                {viewMode === "table" && (
                  <div className="lg:col-span-1 space-y-4">
                    {/* User Stats */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">User Stats</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <span className="text-sm text-[#861657]">Total Users</span>
                          <span className="font-bold text-[#861657]">{userStats.total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#93e1d8]/20">
                          <span className="text-sm text-[#861657]">Active</span>
                          <span className="font-bold text-[#93e1d8]">{userStats.active.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffa69e]/20">
                          <span className="text-sm text-[#861657]">Suspended</span>
                          <span className="font-bold text-[#ffa69e]">{userStats.suspended}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#aa4465]/20">
                          <span className="text-sm text-[#861657]">Banned</span>
                          <span className="font-bold text-[#aa4465]">{userStats.banned}</span>
                        </div>
                      </div>
                    </div>

                    {/* New Signups */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">New Signups</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#93e1d8]" />
                            <span className="text-sm text-[#861657]">This Week</span>
                          </div>
                          <span className="font-bold text-[#861657]">{userStats.newSignupsWeekly}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ddfff7]/50">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#ffa69e]" />
                            <span className="text-sm text-[#861657]">This Month</span>
                          </div>
                          <span className="font-bold text-[#861657]">{userStats.newSignupsMonthly.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Most Active Users */}
                    <div className="bg-white rounded-2xl p-5 shadow-md border border-[#ddfff7]">
                      <h3 className="text-lg font-bold text-[#861657] mb-4">Most Active</h3>
                      <div className="space-y-2">
                        {userStats.mostActive.map((user, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#ddfff7]/50 smooth-all">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffa69e] to-[#93e1d8] flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <div className="text-sm font-semibold text-[#861657]">{user.name}</div>
                                <div className="text-xs text-[#861657]/60">{user.activity} {user.type}</div>
                              </div>
                            </div>
                          </div>
                        ))}
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


