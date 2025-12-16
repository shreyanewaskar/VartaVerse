import { Star, Eye, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import { contentApi } from "@/lib/content-api";
import { toast } from "sonner";

interface MovieCardProps {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string;
  size?: "small" | "medium" | "large";
  isBookmarked?: boolean;
  onBookmarkChange?: (id: string, isBookmarked: boolean) => void;
}

const sizeClasses = {
  small: "w-32 h-48",
  medium: "w-40 h-56",
  large: "w-48 h-64",
};

const genreColors: Record<string, string> = {
  action: "from-media-powder-blush to-media-berry-crush",
  drama: "from-media-pearl-aqua to-media-berry-crush",
  comedy: "from-media-pearl-aqua to-media-powder-blush",
  scifi: "from-media-berry-crush to-media-powder-blush",
  romance: "from-media-powder-blush to-media-pearl-aqua",
  horror: "from-media-dark-raspberry to-media-berry-crush",
};

export default function MovieCard({
  id,
  title,
  year,
  rating,
  genre,
  size = "medium",
  isBookmarked = false,
  onBookmarkChange,
}: MovieCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);
  const colorGradient = genreColors[genre.toLowerCase()] || genreColors.drama;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    try {
      await contentApi.toggleLike(id);
      const newBookmarked = !bookmarked;
      setBookmarked(newBookmarked);
      onBookmarkChange?.(id, newBookmarked);
      toast.success(newBookmarked ? "Added to bookmarks" : "Removed from bookmarks");
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      toast.error("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/movie/${id}`}
      className={cn(
        sizeClasses[size],
        "relative group rounded-2xl overflow-hidden cursor-pointer animate-fade-in smooth-all hover:shadow-xl hover:-translate-y-2 block"
      )}
    >
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          colorGradient
        )}
      />

      {/* Image Overlay Effect */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 smooth-all" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
        {/* Top: Bookmark and Genre Tag */}
        <div className="flex justify-between items-start">
          <button
            onClick={handleBookmark}
            disabled={loading}
            className={cn(
              "pointer-events-auto p-1.5 rounded-full smooth-all opacity-0 group-hover:opacity-100",
              bookmarked 
                ? "bg-media-berry-crush text-white" 
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <Bookmark className={cn("w-4 h-4", bookmarked && "fill-current")} />
          </button>
          <span className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-full bg-media-powder-blush text-white capitalize"
          )}>
            {genre}
          </span>
        </div>

        {/* Bottom: Title, Rating, Year */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-sm line-clamp-2 drop-shadow-lg">
            {title}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(rating)
                    ? "fill-media-powder-blush text-media-powder-blush"
                    : "text-white/30"
                )}
              />
            ))}
            <span className="text-xs text-white font-semibold ml-1">
              {rating}
            </span>
          </div>

          <p className="text-xs text-white/70">{year}</p>
        </div>
      </div>

      {/* Hover "View Details" Button */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 smooth-all pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-media-pearl-aqua text-white font-semibold smooth-all">
          <Eye className="w-4 h-4" />
          View Details
        </div>
      </div>
    </Link>
  );
}