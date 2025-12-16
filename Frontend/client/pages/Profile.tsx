import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/lib/user-api";
import { contentApi } from "@/lib/content-api";
import { useToast } from "@/hooks/use-toast";
import EditProfileModal from "@/components/EditProfileModal";
import EditPostModal from "@/components/EditPostModal";
import {
  Bell,
  Search,
  Sun,
  Moon,
  ArrowLeft,
  Edit3,
  Image as ImageIcon,
  Settings,
  Heart,
  MessageCircle,
  Bookmark,
  Plus,
  BookOpen,
  Sparkles,
  Star,
  Camera,
  Mail,
  Link as LinkIcon,
  Instagram,
  Twitter,
  LogOut,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  description: string;
  image?: string;
  emoji?: string;
  likes: number;
  comments: number;
  date: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
}

interface Memory {
  id: string;
  title: string;
  image: string;
  date: string;
}

const posts: Post[] = [
  {
    id: "p1",
    title: "Midnight Reading Session",
    description: "There's something magical about reading under fairy lights ✨",
    emoji: "📖",
    likes: 128,
    comments: 24,
    date: "2 days ago",
  },
  {
    id: "p2",
    title: "Found This Gem Today",
    description: "The Secret Garden never fails to transport me to another world 🌿",
    emoji: "🌿",
    likes: 89,
    comments: 12,
    date: "5 days ago",
  },
  {
    id: "p3",
    title: "Book Haul Alert",
    description: "My latest additions to the collection 📚",
    emoji: "📚",
    likes: 156,
    comments: 31,
    date: "1 week ago",
  },
  {
    id: "p4",
    title: "Cozy Corner Setup",
    description: "Perfect reading nook with all my favorites nearby 💫",
    emoji: "💫",
    likes: 203,
    comments: 45,
    date: "1 week ago",
  },
  {
    id: "p5",
    title: "Quote of the Day",
    description: "\"The more that you read, the more things you will know.\" - Dr. Seuss",
    emoji: "💭",
    likes: 94,
    comments: 18,
    date: "2 weeks ago",
  },
  {
    id: "p6",
    title: "Nostalgic Moment",
    description: "Re-reading childhood favorites hits different 🎈",
    emoji: "🎈",
    likes: 167,
    comments: 28,
    date: "2 weeks ago",
  },
];

const bookshelf: Book[] = [
  { id: "b1", title: "The Secret Garden", author: "Frances Hodgson Burnett", cover: "🌿", rating: 4.8 },
  { id: "b2", title: "Anne of Green Gables", author: "L.M. Montgomery", cover: "📖", rating: 4.9 },
  { id: "b3", title: "Little Women", author: "Louisa May Alcott", cover: "👭", rating: 4.8 },
  { id: "b4", title: "Matilda", author: "Roald Dahl", cover: "📚", rating: 4.9 },
  { id: "b5", title: "The Hobbit", author: "J.R.R. Tolkien", cover: "💍", rating: 4.8 },
  { id: "b6", title: "Charlotte's Web", author: "E.B. White", cover: "🕷️", rating: 4.7 },
];

const memories: Memory[] = [
  { id: "m1", title: "First Library Visit", image: "📚", date: "2020" },
  { id: "m2", title: "Book Club Meeting", image: "☕", date: "2021" },
  { id: "m3", title: "Reading Under Stars", image: "⭐", date: "2022" },
  { id: "m4", title: "Found Rare Edition", image: "💎", date: "2023" },
];

const tabs = ["Posts", "Bookshelf", "Nostalgic Reads", "Saved Moments", "Reviews", "Your Collections"];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [themeMode, setThemeMode] = useState<"day" | "night">("day");
  const [activeTab, setActiveTab] = useState("Posts");
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = user?.name ? getUserInitials(user.name) : 'U';
  const displayName = user?.name || 'User';
  
  // Load profile photo from localStorage on component mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem(`profile_photo_${user?.id}`);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, [user?.id]);

  // Fetch user data and posts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingStats(true);
        setLoadingPosts(true);
        
        // Get current user info from User Service (8083)
        const currentUser = await userApi.getMe();
        
        // Fetch user stats and all posts, then filter by current user
        const [followersData, followingData, allPostsData] = await Promise.all([
          userApi.getFollowers(currentUser.id.toString()),
          userApi.getFollowing(currentUser.id.toString()),
          contentApi.getPosts({})
        ]);
        
        // Filter posts by current user ID
        const currentUserPosts = (allPostsData.posts || []).filter(
          post => post.userId === currentUser.id
        );
        
        setFollowersCount(followersData.count);
        setFollowingCount(followingData.count);
        setUserPosts(currentUserPosts);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast({
          title: 'Failed to load user data',
          variant: 'destructive'
        });
      } finally {
        setIsLoadingStats(false);
        setLoadingPosts(false);
      }
    };

    fetchUserData();
  }, [user?.id, toast]);
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoData = event.target?.result as string;
        setProfilePhoto(photoData);
        // Store in localStorage with user ID
        localStorage.setItem(`profile_photo_${user?.id}`, photoData);
        toast({ title: 'Profile photo updated successfully!' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await contentApi.deletePost(postId);
      setUserPosts(prev => prev.filter(post => (post.id || post.postId) !== postId));
      toast({
        title: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: 'Failed to delete post',
        variant: 'destructive'
      });
    }
  };

  const handleEditPost = (post: any) => {
    console.log('Editing post:', post);
    setEditingPost(post);
  };

  const handlePostUpdated = () => {
    // Refresh posts after update
    if (user?.id) {
      const fetchUserData = async () => {
        try {
          const currentUser = await userApi.getMe();
          const allPostsData = await contentApi.getPosts({});
          const currentUserPosts = (allPostsData.posts || []).filter(
            post => post.userId === currentUser.id
          );
          setUserPosts(currentUserPosts);
        } catch (error) {
          console.error('Failed to refresh posts:', error);
        }
      };
      fetchUserData();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua text-media-dark-raspberry">
      {/* Floating Background Motifs */}
      <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-media-pearl-aqua/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-20 h-64 w-64 rounded-full bg-media-powder-blush/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-media-pearl-aqua/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]" />
      
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute top-32 left-8 text-4xl opacity-10">✨</div>
      <div className="pointer-events-none absolute top-64 right-16 text-3xl opacity-10">💫</div>
      <div className="pointer-events-none absolute bottom-32 left-1/3 text-4xl opacity-10">✈️</div>
      <div className="pointer-events-none absolute top-1/2 right-1/4 text-3xl opacity-10">💕</div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 lg:py-8">
        {/* Header / Navbar */}
        <header className="sticky top-4 z-20">
          <div className="glass flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-5 py-3 shadow-2xl shadow-media-frozen-water/60">
            <div className="flex items-center gap-3 text-lg font-black text-media-berry-crush">
              <button
                onClick={() => navigate("/feed")}
                className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-media-pearl-aqua/30 hover:shadow-md hover:shadow-media-pearl-aqua/50"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <span>VartaVerse</span>
              <span className="text-sm font-semibold text-media-dark-raspberry/70">/ Profile</span>
            </div>

            <div className="flex flex-1 items-center gap-4 pl-6">
              <div className="relative hidden flex-1 items-center md:flex">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-media-dark-raspberry/50" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  className="h-10 w-full rounded-full border border-white/60 bg-white/60 px-9 text-sm text-media-dark-raspberry placeholder:text-media-dark-raspberry/40 focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/40"
                />
              </div>

              <button className="rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua p-2 text-white shadow-lg shadow-media-powder-blush/40 transition hover:scale-105">
                <Plus className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate("/notifications")}
                className="relative rounded-full bg-white/70 p-2 text-media-berry-crush transition hover:shadow-lg hover:shadow-media-pearl-aqua/60"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="pulse-badge absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-media-powder-blush" />
              </button>

              <button
                onClick={() => setThemeMode((prev) => (prev === "day" ? "night" : "day"))}
                className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:shadow-lg hover:shadow-media-powder-blush/50"
                aria-label="Toggle theme"
              >
                {themeMode === "day" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-media-dark-raspberry">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="h-8 w-8 rounded-full bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush text-sm font-bold text-white flex items-center justify-center">
                    {userInitials}
                  </span>
                )}
                <span>{displayName}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Profile Hero Section */}
        <section className="relative overflow-hidden rounded-[32px] border-2 border-media-powder-blush/30 bg-gradient-to-br from-media-powder-blush/40 via-white to-media-frozen-water/60 p-8 shadow-[0_25px_70px_rgba(255,166,158,0.35)]">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-media-powder-blush to-media-pearl-aqua blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative rounded-full border-4 border-media-powder-blush bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush p-1 shadow-2xl transition-transform group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,166,158,0.6)]">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center text-4xl font-bold text-white">
                    {userInitials}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Bio */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-4xl font-bold text-media-berry-crush lg:text-5xl">{displayName}</h1>
                <p className="mt-1 text-lg text-media-dark-raspberry/70">@{user?.email?.split('@')[0] || 'user'}</p>
              </div>
              <p className="max-w-2xl text-base italic text-media-dark-raspberry/80">
                Reader ✦ Dreamer ✦ Collecting moments, not things.
              </p>
            </div>

            {/* Edit Options */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-5 py-2.5 text-sm font-semibold text-media-dark-raspberry shadow-lg shadow-media-pearl-aqua/40 transition hover:bg-media-pearl-aqua/20 hover:scale-105"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
              <label className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-5 py-2.5 text-sm font-semibold text-media-dark-raspberry shadow-lg shadow-media-pearl-aqua/40 transition hover:bg-media-pearl-aqua/20 hover:scale-105 cursor-pointer">
                <ImageIcon className="h-4 w-4" />
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <button 
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-5 py-2.5 text-sm font-semibold text-media-dark-raspberry shadow-lg shadow-media-pearl-aqua/40 transition hover:bg-media-pearl-aqua/20 hover:scale-105"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border-2 border-media-powder-blush bg-gradient-to-r from-media-powder-blush/20 to-media-powder-blush/10 px-5 py-2.5 text-sm font-semibold text-media-dark-raspberry shadow-lg shadow-media-powder-blush/40 transition hover:bg-gradient-to-r hover:from-media-powder-blush hover:to-media-powder-blush/80 hover:text-white hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="glass rounded-2xl border border-white/50 bg-white/40 p-6 shadow-lg">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="group cursor-pointer text-center">
              <p className="text-3xl font-bold text-media-berry-crush transition-all group-hover:scale-110">
                {loadingPosts ? '...' : userPosts.length}
              </p>
              <p className="mt-1 text-sm text-media-dark-raspberry/70 group-hover:text-media-powder-blush transition-colors">
                Posts
              </p>
              <div className="mx-auto mt-2 h-0.5 w-0 rounded-full bg-media-powder-blush transition-all group-hover:w-12" />
            </div>
            <div className="group cursor-pointer text-center">
              <p className="text-3xl font-bold text-media-berry-crush transition-all group-hover:scale-110">
                {isLoadingStats ? '...' : followingCount}
              </p>
              <p className="mt-1 text-sm text-media-dark-raspberry/70 group-hover:text-media-powder-blush transition-colors">
                Following
              </p>
              <div className="mx-auto mt-2 h-0.5 w-0 rounded-full bg-media-powder-blush transition-all group-hover:w-12" />
            </div>
            <div className="group cursor-pointer text-center">
              <p className="text-3xl font-bold text-media-berry-crush transition-all group-hover:scale-110">
                {isLoadingStats ? '...' : followersCount}
              </p>
              <p className="mt-1 text-sm text-media-dark-raspberry/70 group-hover:text-media-powder-blush transition-colors">
                Followers
              </p>
              <div className="mx-auto mt-2 h-0.5 w-0 rounded-full bg-media-powder-blush transition-all group-hover:w-12" />
            </div>
            <div className="group cursor-pointer text-center">
              <p className="text-3xl font-bold text-media-berry-crush transition-all group-hover:scale-110">42</p>
              <p className="mt-1 text-sm text-media-dark-raspberry/70 group-hover:text-media-powder-blush transition-colors">
                Bookshelf Items
              </p>
              <div className="mx-auto mt-2 h-0.5 w-0 rounded-full bg-media-powder-blush transition-all group-hover:w-12" />
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="flex flex-wrap items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300",
                activeTab === tab
                  ? "bg-white/70 text-media-dark-raspberry shadow-lg shadow-media-pearl-aqua/40"
                  : "bg-white/40 text-media-dark-raspberry/70 hover:bg-white/60 hover:shadow-md hover:shadow-media-pearl-aqua/30"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-media-pearl-aqua to-media-powder-blush" />
              )}
            </button>
          ))}
        </section>

        {/* Content Sections */}
        {activeTab === "Posts" && (
          <section>
            {loadingPosts ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-media-berry-crush mx-auto mb-4"></div>
                <p className="text-media-dark-raspberry/70">Loading your posts...</p>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userPosts.map((post) => {
                  const postId = post.id || post.postId;
                  let content;
                  try {
                    content = JSON.parse(post.content || '{}');
                  } catch {
                    content = {};
                  }
                  
                  return (
                    <div
                      key={postId}
                      onMouseEnter={() => setHoveredPost(postId)}
                      onMouseLeave={() => setHoveredPost(null)}
                      className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white p-6 shadow-lg shadow-media-frozen-water/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-media-pearl-aqua/50"
                    >
                      {/* Post Menu */}
                      <div className="absolute right-4 top-4 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPostMenu(showPostMenu === postId ? null : postId);
                          }}
                          className="rounded-full bg-white/80 p-2 text-media-dark-raspberry transition hover:bg-white hover:shadow-md"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showPostMenu === postId && (
                          <div className="absolute right-0 top-12 z-20 min-w-[120px] rounded-xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Edit button clicked for post:', post);
                                handleEditPost(post);
                                setShowPostMenu(null);
                              }}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-media-dark-raspberry transition hover:bg-media-pearl-aqua/20 flex items-center gap-2"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(postId);
                                setShowPostMenu(null);
                              }}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-6xl shadow-inner">
                        {post.category === 'movie' ? '🎬' : post.category === 'book' ? '📚' : post.category === 'show' ? '📺' : '📝'}
                      </div>
                      <h3 className="text-lg font-bold text-media-berry-crush">{post.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-media-dark-raspberry/70">
                        {content.description || post.content || 'No description available'}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-media-dark-raspberry/60">
                        <span>{post.likesCount || 0} likes</span>
                        <span>{post.commentsCount || 0} comments</span>
                        <span>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      {hoveredPost === postId && (
                        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl bg-white/95 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert("Liked!"); }}
                            className="rounded-full bg-media-frozen-water p-3 text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
                          >
                            <Heart className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); alert("Comment feature coming soon!"); }}
                            className="rounded-full bg-media-frozen-water p-3 text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate("/bookmarks"); }}
                            className="rounded-full bg-media-frozen-water p-3 text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
                          >
                            <Bookmark className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-media-dark-raspberry mb-2">No posts yet</h3>
                <p className="text-media-dark-raspberry/60 mb-6">Start sharing your thoughts and experiences!</p>
                <button 
                  onClick={() => navigate("/feed")}
                  className="px-6 py-3 bg-gradient-to-r from-media-berry-crush to-media-dark-raspberry text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                >
                  Create Your First Post
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "Bookshelf" && (
          <section>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookshelf.map((book) => (
                <div
                  key={book.id}
                  className="group overflow-hidden rounded-2xl border border-white/80 bg-white p-6 shadow-lg shadow-media-frozen-water/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-media-pearl-aqua/50"
                >
                  <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-5xl shadow-inner">
                    {book.cover}
                  </div>
                  <h3 className="text-lg font-bold text-media-dark-raspberry">{book.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-media-berry-crush">{book.author}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= book.rating
                            ? "fill-media-powder-blush text-media-powder-blush"
                            : "text-media-berry-crush/20"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-xs font-semibold text-media-dark-raspberry/60">{book.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Nostalgic Reads" && (
          <section>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookshelf.slice(0, 3).map((book) => (
                <div
                  key={book.id}
                  className="group overflow-hidden rounded-2xl border border-white/80 bg-white p-6 shadow-lg shadow-media-frozen-water/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-media-pearl-aqua/50"
                >
                  <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-5xl shadow-inner">
                    {book.cover}
                  </div>
                  <h3 className="text-lg font-bold text-media-dark-raspberry">{book.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-media-berry-crush">{book.author}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Saved Moments" && (
          <section>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className="group relative overflow-hidden rounded-2xl border-4 border-media-powder-blush/40 bg-white p-4 shadow-lg transition-all duration-300 hover:-rotate-1 hover:shadow-xl hover:shadow-media-powder-blush/50"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="mb-3 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/30 to-media-powder-blush/30 text-5xl shadow-inner">
                    {memory.image}
                  </div>
                  <h3 className="text-lg font-semibold italic text-media-dark-raspberry" style={{ fontFamily: 'cursive' }}>{memory.title}</h3>
                  <p className="mt-1 text-xs text-media-dark-raspberry/60">{memory.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Reviews" && (
          <section>
            <div className="space-y-6">
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-white/80 bg-white p-6 shadow-lg shadow-media-frozen-water/40"
                >
                  <h3 className="text-xl font-bold text-media-berry-crush">{post.title}</h3>
                  <p className="mt-2 text-media-dark-raspberry/80">{post.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-media-dark-raspberry/60">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Your Collections" && (
          <section>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookshelf.map((book) => (
                <div
                  key={book.id}
                  className="group overflow-hidden rounded-2xl border border-white/80 bg-white p-6 shadow-lg shadow-media-frozen-water/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-media-pearl-aqua/50"
                >
                  <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-5xl shadow-inner">
                    {book.cover}
                  </div>
                  <h3 className="text-lg font-bold text-media-dark-raspberry">{book.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-media-berry-crush">{book.author}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="glass rounded-2xl border border-white/50 bg-white/40 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-media-berry-crush">About</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-media-dark-raspberry/60">
                  Interests
                </h3>
                <p className="text-media-dark-raspberry">Reading, Writing, Photography, Vintage Books</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-media-dark-raspberry/60">
                  Favorite Genres
                </h3>
                <p className="text-media-dark-raspberry">Classics, Fantasy, Mystery, Coming-of-Age</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-media-dark-raspberry/60">
                  Favorite Nostalgic Books
                </h3>
                <p className="text-media-dark-raspberry">The Secret Garden, Anne of Green Gables, Little Women</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-media-dark-raspberry/60">
                  Connect
                </h3>
                <div className="flex items-center gap-3">
                  <button className="rounded-full bg-media-frozen-water p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="rounded-full bg-media-frozen-water p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
                    <Instagram className="h-4 w-4" />
                  </button>
                  <button className="rounded-full bg-media-frozen-water p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="rounded-full bg-media-frozen-water p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Footer */}
        <section className="rounded-[28px] border border-media-pearl-aqua/40 bg-gradient-to-r from-media-frozen-water via-white to-media-powder-blush/30 p-10 shadow-[0_20px_60px_rgba(255,166,158,0.25)]">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h2 className="text-3xl font-bold text-media-dark-raspberry">
              Let your story shine in every corner of VartaVerse.
            </h2>
            <button 
              onClick={() => navigate("/feed")}
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-media-powder-blush/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_25px_70px_rgba(255,166,158,0.6)]"
            >
              <Plus className="h-5 w-5" />
              Create New Post
            </button>
          </div>
        </section>

        {/* Edit Profile Modal */}
        <EditProfileModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdated={() => {
            // Refresh user stats when profile is updated
            if (user?.id) {
              Promise.all([
                userApi.getFollowers(user.id),
                userApi.getFollowing(user.id)
              ]).then(([followersData, followingData]) => {
                setFollowersCount(followersData.count);
                setFollowingCount(followingData.count);
              }).catch(console.error);
            }
          }}
        />

        {/* Edit Post Modal */}
        <EditPostModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          post={editingPost}
          onPostUpdated={handlePostUpdated}
        />
      </div>
      
      {/* Click outside to close menu */}
      {showPostMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowPostMenu(null)}
        />
      )}
    </div>
  );
}
