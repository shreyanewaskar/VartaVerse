import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-media-pearl-aqua/30 shadow-md">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => navigate("/feed")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center transform group-hover:scale-110 smooth-all shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="hidden sm:inline font-bold text-media-dark-raspberry group-hover:text-media-berry-crush smooth-all">
                VartaVerse
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <div
              className={cn(
                "w-full relative",
                searchFocused && "glow-primary"
              )}
            >
              <input
                type="text"
                placeholder="Search media, reviews..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full px-4 py-2 pl-10 rounded-full bg-white/60 backdrop-blur border border-media-pearl-aqua/40 focus:outline-none focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/30 smooth-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-media-pearl-aqua opacity-60" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Notification Bell */}
            <button 
              onClick={() => navigate("/notifications")}
              className="relative p-2 rounded-full hover:bg-media-pearl-aqua/20 smooth-all group"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 text-media-dark-raspberry group-hover:text-media-berry-crush smooth-all" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-media-powder-blush rounded-full pulse-badge" />
            </button>

            {/* Profile Avatar */}
            <button 
              onClick={() => navigate("/profile")}
              className="relative p-2 rounded-full hover:glow-primary smooth-all group"
              aria-label="Go to profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-media-berry-crush opacity-0 group-hover:opacity-100 smooth-all" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-media-pearl-aqua/20 smooth-all group"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-media-powder-blush group-hover:text-media-dark-raspberry smooth-all" />
              ) : (
                <Moon className="w-5 h-5 text-media-dark-raspberry group-hover:text-media-berry-crush smooth-all" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
