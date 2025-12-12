import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/lib/user-api";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  Film,
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
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  bio?: string;
}

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

export default function AdminUsers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await userApi.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({ title: "Failed to load users", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    
    try {
      await userApi.deleteUserById(userId);
      toast({ title: "User deleted successfully" });
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({ title: "Failed to delete user", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                    placeholder="Search users..."
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

          {/* Users Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#ddfff7]">
              <h2 className="text-2xl font-bold text-[#861657] mb-6">All Users</h2>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93e1d8] mx-auto"></div>
                  <p className="text-[#861657]/60 mt-4">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#93e1d8]/30">
                        <th className="text-left py-3 px-4 text-[#861657] font-semibold">Name</th>
                        <th className="text-left py-3 px-4 text-[#861657] font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-[#861657] font-semibold">Role</th>
                        <th className="text-left py-3 px-4 text-[#861657] font-semibold">Phone</th>
                        <th className="text-left py-3 px-4 text-[#861657] font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-[#93e1d8]/10 hover:bg-[#ddfff7]/30">
                          <td className="py-3 px-4 text-[#861657]">{user.name}</td>
                          <td className="py-3 px-4 text-[#861657]/70">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full bg-[#93e1d8]/20 text-[#861657] text-xs font-semibold">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#861657]/70">{user.phoneNumber || '-'}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-all"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-[#93e1d8] mx-auto mb-2" />
                      <p className="text-[#861657]/60">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
