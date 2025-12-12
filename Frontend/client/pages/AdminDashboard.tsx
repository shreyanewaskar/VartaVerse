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
  TrendingUp,
  Book,
  Tv,
  MessageSquare,
  Shield,
  Calendar,
  MoreVertical,
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

interface MetricCard {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

const metricCards: MetricCard[] = [
  { id: "users", label: "Total Users", value: 12450, icon: <Users className="w-6 h-6" />, color: "from-media-pearl-aqua to-media-frozen-water", trend: 12 },
  { id: "posts", label: "Active Posts", value: 8934, icon: <FileText className="w-6 h-6" />, color: "from-media-powder-blush to-media-pearl-aqua", trend: 8 },
  { id: "reports", label: "Pending Reports", value: 23, icon: <AlertTriangle className="w-6 h-6" />, color: "from-media-powder-blush to-media-berry-crush", trend: -5 },
  { id: "media", label: "Total Media", value: 5678, icon: <Film className="w-6 h-6" />, color: "from-media-berry-crush to-media-dark-raspberry", trend: 15 },
  { id: "books", label: "Books", value: 2341, icon: <Book className="w-6 h-6" />, color: "from-media-pearl-aqua to-media-powder-blush" },
  { id: "signups", label: "New Signups (Weekly)", value: 342, icon: <TrendingUp className="w-6 h-6" />, color: "from-media-frozen-water to-media-pearl-aqua", trend: 23 },
];

interface ActivityItem {
  id: string;
  type: "report" | "signup" | "post";
  title: string;
  user?: string;
  timestamp: string;
  status?: "pending" | "resolved";
}

const recentActivity: ActivityItem[] = [
  { id: "1", type: "report", title: "Inappropriate content flagged", user: "user123", timestamp: "2 hours ago", status: "pending" },
  { id: "2", type: "signup", title: "New user registered", user: "newuser456", timestamp: "3 hours ago" },
  { id: "3", type: "post", title: "New review posted", user: "reviewer789", timestamp: "5 hours ago" },
  { id: "4", type: "report", title: "Spam detected", user: "user321", timestamp: "6 hours ago", status: "pending" },
  { id: "5", type: "signup", title: "New user registered", user: "member654", timestamp: "8 hours ago" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchFocused, setSearchFocused] = useState(false);

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
                  if (item.id === "media") {
                    navigate("/admin/media");
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
                    placeholder="Search users or media..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white/60 backdrop-blur border border-[#93e1d8]/40 focus:outline-none focus:border-[#93e1d8] focus:ring-2 focus:ring-[#93e1d8]/30 smooth-all text-sm text-[#861657]"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Quick Actions */}
                <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ffa69e] to-[#93e1d8] text-white text-sm font-semibold hover:shadow-lg smooth-all">
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>

                {/* Notification Bell */}
                <button className="relative p-2 rounded-full hover:bg-white/40 smooth-all group">
                  <Bell className="w-5 h-5 text-[#861657] group-hover:text-[#aa4465] smooth-all" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-[#ffa69e] rounded-full pulse-badge" />
                </button>

                {/* Admin Avatar */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-white/40 smooth-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#93e1d8] to-[#ffa69e] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>
                  {/* Dropdown would go here */}
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {metricCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 smooth-all border border-[#ddfff7] group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("p-3 rounded-xl bg-gradient-to-br", card.color)}>
                      <div className="text-white">{card.icon}</div>
                    </div>
                    {card.trend && (
                      <span className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-full",
                        card.trend > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                      )}>
                        {card.trend > 0 ? "+" : ""}{card.trend}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#861657]/60 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-[#861657]">{card.value.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* User Growth Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ddfff7]">
                <h3 className="text-lg font-bold text-[#861657] mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-[#ddfff7] to-[#93e1d8]/20 rounded-xl">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-[#ffa69e] mx-auto mb-2" />
                    <p className="text-[#861657]/60 text-sm">Chart visualization</p>
                    <p className="text-xs text-[#861657]/40 mt-1">Line chart with Powder Blush line</p>
                  </div>
                </div>
              </div>

              {/* Post Activity Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ddfff7]">
                <h3 className="text-lg font-bold text-[#861657] mb-4">Post / Review Activity</h3>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-[#93e1d8]/20 to-[#aa4465]/10 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-[#93e1d8] mx-auto mb-2" />
                    <p className="text-[#861657]/60 text-sm">Chart visualization</p>
                    <p className="text-xs text-[#861657]/40 mt-1">Bar chart with Pearl Aqua / Berry Crush bars</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Media & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Media Chart */}
              <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-md border border-[#ddfff7]">
                <h3 className="text-lg font-bold text-[#861657] mb-4">Top Media</h3>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-[#ddfff7] to-[#ffa69e]/20 rounded-xl">
                  <div className="text-center">
                    <Film className="w-12 h-12 text-[#aa4465] mx-auto mb-2" />
                    <p className="text-[#861657]/60 text-sm">Chart visualization</p>
                    <p className="text-xs text-[#861657]/40 mt-1">Donut chart with gradient</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-[#ddfff7]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#861657]">Recent Activity</h3>
                  <button className="text-sm text-[#93e1d8] hover:text-[#aa4465] smooth-all">View All</button>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 rounded-xl bg-[#ddfff7]/50 hover:bg-[#ddfff7] smooth-all border border-[#93e1d8]/20 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={cn(
                            "p-2 rounded-lg",
                            activity.type === "report" && "bg-[#ffa69e]/20",
                            activity.type === "signup" && "bg-[#93e1d8]/20",
                            activity.type === "post" && "bg-[#aa4465]/20"
                          )}>
                            {activity.type === "report" && <AlertTriangle className="w-4 h-4 text-[#ffa69e]" />}
                            {activity.type === "signup" && <User className="w-4 h-4 text-[#93e1d8]" />}
                            {activity.type === "post" && <FileText className="w-4 h-4 text-[#aa4465]" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#861657]">{activity.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {activity.user && (
                                <span className="text-xs text-[#861657]/60">@{activity.user}</span>
                              )}
                              <span className="text-xs text-[#861657]/40">•</span>
                              <span className="text-xs text-[#861657]/60">{activity.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.status === "pending" && (
                            <span className="px-2 py-1 rounded-full bg-[#ffa69e]/20 text-[#ffa69e] text-xs font-semibold">
                              Pending
                            </span>
                          )}
                          <button className="p-2 rounded-lg hover:bg-white/60 smooth-all text-[#861657]/60">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {activity.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1.5 rounded-lg bg-[#93e1d8] text-white text-xs font-semibold hover:bg-[#93e1d8]/80 smooth-all">
                            View
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-[#ffa69e] text-white text-xs font-semibold hover:bg-[#ffa69e]/80 smooth-all">
                            Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-[#ffa69e] to-[#93e1d8] text-white shadow-2xl shadow-[#ffa69e]/50 hover:scale-110 smooth-all flex items-center justify-center group"
        aria-label="Quick Actions"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 smooth-all" />
      </button>

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

