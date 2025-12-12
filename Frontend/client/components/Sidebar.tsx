import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Compass, Film, Tv, BookOpen, Bookmark, Settings, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, href: "/feed" },
  { id: "explore", label: "Explore", icon: <Compass className="w-5 h-5" />, href: "/explore" },
  { id: "movies", label: "Movies", icon: <Film className="w-5 h-5" />, href: "/movies" },
  { id: "shows", label: "Shows", icon: <Tv className="w-5 h-5" />, href: "/shows" },
  { id: "books", label: "Books", icon: <BookOpen className="w-5 h-5" />, href: "/books" },
  { id: "nostalgic-books", label: "Nostalgic Reads", icon: <Sparkles className="w-5 h-5" />, href: "/nostalgic-books" },
  { id: "bookmarks", label: "Bookmarks", icon: <Bookmark className="w-5 h-5" />, href: "/bookmarks" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Determine active item from current location
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/feed") return "home";
    if (path === "/explore") return "explore";
    if (path === "/movies") return "movies";
    if (path === "/shows") return "shows";
    if (path === "/books") return "books";
    if (path === "/nostalgic-books") return "nostalgic-books";
    if (path === "/bookmarks") return "bookmarks";
    return "home";
  };

  const activeItem = getActiveItem();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 bg-gradient-to-b from-media-pearl-aqua to-media-frozen-water border-r border-media-pearl-aqua/20 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Button */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/50 smooth-all text-media-dark-raspberry"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300",
              activeItem === item.id
                ? "bg-white/60 text-media-berry-crush shadow-lg glow-accent"
                : "text-media-dark-raspberry hover:bg-white/40 hover:shadow-md"
            )}
          >
            {item.icon}
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Settings Button */}
      <div className="p-4 border-t border-media-pearl-aqua/30">
        <Link to="/settings" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-media-dark-raspberry hover:bg-white/40 hover:shadow-md smooth-all">
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
