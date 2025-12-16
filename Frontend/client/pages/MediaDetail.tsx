import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Sun,
  Moon,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { contentApi } from "@/lib/content-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MediaData {
  id: string;
  title: string;
  year: number;
  type: "movie" | "show" | "book";
  genre: string;
  rating: number;
  director?: string;
  cast?: string;
  author?: string;
  synopsis: string;
}

interface CommentThread {
  id: string;
  avatar: string;
  name: string;
  badge?: string;
  timestamp: string;
  content: string;
  likes: number;
  replies?: CommentThread[];
}

// Movie data mapping
const movieData: Record<string, { title: string; year: number; rating: number; genre: string }> = {
  m1: { title: "Dune: Part Two", year: 2024, rating: 4.7, genre: "Sci-Fi" },
  m2: { title: "Oppenheimer", year: 2023, rating: 4.8, genre: "Drama" },
  m3: { title: "Killers of the Flower Moon", year: 2023, rating: 4.6, genre: "Drama" },
  m4: { title: "Barbie", year: 2023, rating: 4.5, genre: "Comedy" },
  m5: { title: "Inception", year: 2010, rating: 4.9, genre: "Sci-Fi" },
  m6: { title: "The Matrix", year: 1999, rating: 4.8, genre: "Action" },
  m7: { title: "Interstellar", year: 2014, rating: 4.9, genre: "Sci-Fi" },
  m8: { title: "Parasite", year: 2019, rating: 4.8, genre: "Drama" },
  m9: { title: "Poor Things", year: 2023, rating: 4.5, genre: "Romance" },
  m10: { title: "Knives Out", year: 2019, rating: 4.7, genre: "Comedy" },
  m11: { title: "Avatar", year: 2009, rating: 4.6, genre: "Sci-Fi" },
  m12: { title: "Gladiator", year: 2000, rating: 4.7, genre: "Action" },
  m13: { title: "The Dark Knight", year: 2008, rating: 4.9, genre: "Action" },
  m14: { title: "Titanic", year: 1997, rating: 4.6, genre: "Romance" },
  m15: { title: "Jaws", year: 1975, rating: 4.8, genre: "Horror" },
  m16: { title: "The Shining", year: 1980, rating: 4.7, genre: "Horror" },
};

// Show data mapping
const showData: Record<string, { title: string; year: number; rating: number; genre: string }> = {
  s1: { title: "Stranger Things", year: 2016, rating: 4.7, genre: "Sci-Fi" },
  s2: { title: "The Crown", year: 2016, rating: 4.6, genre: "Drama" },
  s3: { title: "Breaking Bad", year: 2008, rating: 4.9, genre: "Drama" },
  s4: { title: "The Mandalorian", year: 2019, rating: 4.7, genre: "Sci-Fi" },
  s5: { title: "Wednesday", year: 2022, rating: 4.7, genre: "Comedy" },
  s6: { title: "Squid Game", year: 2021, rating: 4.8, genre: "Drama" },
  s7: { title: "The Office", year: 2005, rating: 4.8, genre: "Comedy" },
  s8: { title: "Game of Thrones", year: 2011, rating: 4.5, genre: "Drama" },
  s9: { title: "Westworld", year: 2016, rating: 4.6, genre: "Sci-Fi" },
  s10: { title: "The Boys", year: 2019, rating: 4.7, genre: "Action" },
  s11: { title: "True Detective", year: 2014, rating: 4.7, genre: "Mystery" },
  s12: { title: "Chernobyl", year: 2019, rating: 4.8, genre: "Drama" },
  s13: { title: "Dark", year: 2017, rating: 4.8, genre: "Sci-Fi" },
  s14: { title: "Succession", year: 2018, rating: 4.8, genre: "Drama" },
  s15: { title: "The White Lotus", year: 2021, rating: 4.7, genre: "Mystery" },
  s16: { title: "Mindhunter", year: 2017, rating: 4.7, genre: "Drama" },
};

// Book data mapping
const bookData: Record<string, { title: string; year: number; rating: number; genre: string }> = {
  b1: { title: "The Midnight Library", year: 2020, rating: 4.8, genre: "Fiction" },
  b2: { title: "Project Hail Mary", year: 2021, rating: 4.9, genre: "Sci-Fi" },
  b3: { title: "Dune", year: 1965, rating: 4.7, genre: "Sci-Fi" },
  b4: { title: "Atomic Habits", year: 2018, rating: 4.8, genre: "Self-Help" },
  b5: { title: "The Silent Patient", year: 2019, rating: 4.8, genre: "Mystery" },
  b6: { title: "Lessons in Chemistry", year: 2022, rating: 4.7, genre: "Fiction" },
  b7: { title: "The Midnight Gamer", year: 2023, rating: 4.6, genre: "Mystery" },
  b8: { title: "One Piece of Truth", year: 2022, rating: 4.5, genre: "Drama" },
  b9: { title: "The Iron Widow", year: 2023, rating: 4.8, genre: "Sci-Fi" },
  b10: { title: "Circe", year: 2018, rating: 4.7, genre: "Fiction" },
  b11: { title: "The Haunting of Maddy Clare", year: 2006, rating: 4.6, genre: "Mystery" },
  b12: { title: "Six of Crows", year: 2015, rating: 4.8, genre: "Fantasy" },
  b13: { title: "Piranesi", year: 2020, rating: 4.7, genre: "Fiction" },
  b14: { title: "Verity", year: 2018, rating: 4.7, genre: "Thriller" },
  b15: { title: "The Song of Achilles", year: 2011, rating: 4.8, genre: "Romance" },
  b16: { title: "A Deadly Education", year: 2021, rating: 4.6, genre: "Fantasy" },
};

// Generate mock media details dynamically
const generateMediaDetail = (id: string): MediaData | null => {
  const movie = movieData[id];
  if (movie) {
    return {
      id,
      title: movie.title,
      year: movie.year,
      type: "movie" as const,
      genre: movie.genre,
      rating: movie.rating,
      director: "Various Directors",
      cast: "Various Cast Members",
      synopsis: `${movie.title} is a ${movie.genre.toLowerCase()} ${movie.year >= 2020 ? "recent" : "classic"} film that has captivated audiences with its compelling storytelling and exceptional performances. This ${movie.genre.toLowerCase()} masterpiece continues to resonate with viewers and critics alike.`,
    };
  }

  const show = showData[id];
  if (show) {
    return {
      id,
      title: show.title,
      year: show.year,
      type: "show" as const,
      genre: show.genre,
      rating: show.rating,
      director: "Various Directors",
      cast: "Various Cast Members",
      synopsis: `${show.title} is a ${show.genre.toLowerCase()} series that has garnered critical acclaim and a dedicated fanbase. This ${show.genre.toLowerCase()} show delivers compelling narratives and memorable characters that keep viewers coming back for more.`,
    };
  }

  const book = bookData[id];
  if (book) {
    return {
      id,
      title: book.title,
      year: book.year,
      type: "book" as const,
      genre: book.genre,
      rating: book.rating,
      author: "Various Authors",
      synopsis: `${book.title} is a ${book.genre.toLowerCase()} book that has captured the hearts and minds of readers. This ${book.genre.toLowerCase()} work offers profound insights and an engaging narrative that makes it a must-read for fans of the genre.`,
    };
  }

  return null;
};

const mockMediaDetails: Record<string, MediaData> = {
  m1: {
    id: "m1",
    title: "Neon Skies",
    year: 2025,
    type: "show",
    genre: "Sci-Fi Drama",
    rating: 4.9,
    director: "Mira Vela",
    cast: "Lena Torres, Mika Andrews, Callum Rae",
    synopsis:
      "Set in a floating city, Neon Skies follows a young critic uncovering a conspiracy between reviewers and studios. It's a dreamy exploration of media, memory, and the power of storytelling.",
  },
};

const categoryTags = [
  { label: "Movies", icon: "🔥", gradient: "from-media-powder-blush to-white" },
  { label: "Shows", icon: "🎬", gradient: "from-white to-media-pearl-aqua" },
  { label: "Books", icon: "📚", gradient: "from-media-berry-crush/10 to-white" },
];

const ratingStats = {
  average: 4.9,
  totalRatings: 2387,
  distribution: [
    { label: "5 Stars", percent: 74 },
    { label: "4 Stars", percent: 18 },
    { label: "3 Stars", percent: 6 },
    { label: "2 Stars", percent: 1 },
    { label: "1 Star", percent: 1 },
  ],
};

const commentThreads: CommentThread[] = [
  {
    id: "c1",
    avatar: "AN",
    name: "Alyssa Nguyen",
    badge: "Top Critic",
    timestamp: "2h ago",
    content:
      "The cinematography feels like floating through a pastel dream. I love how they layer the score with those subtle synth notes 💫",
    likes: 128,
    replies: [
      {
        id: "c1-1",
        avatar: "JS",
        name: "Juno Sparks",
        timestamp: "1h ago",
        content: "Right? Episode 5 literally glows. Can't wait for the vinyl!",
        likes: 24,
      },
    ],
  },
  {
    id: "c2",
    avatar: "MK",
    name: "Milo Kang",
    badge: "Reviewer",
    timestamp: "5h ago",
    content:
      "Gave it a second watch last night and the layered commentary on hype culture hits even harder. The dialogue is so poetic.",
    likes: 86,
  },
  {
    id: "c3",
    avatar: "SR",
    name: "Sia Rahman",
    timestamp: "yesterday",
    content:
      "Need an entire spin-off focused on Dahlia's archived reviews. The pastel scrapbook aesthetic is brilliant storytelling.",
    likes: 61,
  },
];

const trendingHighlights = [
  {
    id: "t1",
    title: "Crystal Echoes",
    rating: 4.8,
    blurb: "A dreamy docu-series about synesthesia artists.",
    image: "🎧",
  },
  {
    id: "t2",
    title: "Soft Punchlines",
    rating: 4.7,
    blurb: "Feel-good comedy anthology filmed on Super 8.",
    image: "📼",
  },
];

const recommendedCreators = [
  { id: "rc1", name: "Nova Li", specialty: "Visual Poetry", avatar: "NL" },
  { id: "rc2", name: "Kai Anders", specialty: "Indie Films", avatar: "KA" },
];

const similarPosts = [
  { id: "s1", title: "Moonlit Reviews", type: "Show", vibe: "Dreamcore" },
  { id: "s2", title: "Pastel Noir Diaries", type: "Movie", vibe: "Retro Futurism" },
  { id: "s3", title: "Garden of Panels", type: "Book", vibe: "Graphic Memoir" },
];

export default function MediaDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [media, setMedia] = useState<MediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [themeMode, setThemeMode] = useState<"day" | "night">("day");
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  const displayedRating = hoveredStar ?? userRating;

  useEffect(() => {
    const loadPostData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const post = await contentApi.getPost(id);
        
        // Parse content to get additional details
        let content;
        try {
          content = JSON.parse(post.content);
        } catch {
          content = {};
        }
        
        // Transform post data to MediaData format
        const mediaData: MediaData = {
          id: post.id?.toString() || id,
          title: post.title,
          year: content.year || new Date().getFullYear(),
          type: (post.category as "movie" | "show" | "book") || "movie",
          genre: content.genre || "Drama",
          rating: post.averageRating || 0,
          director: content.director || "Various Directors",
          cast: content.cast || "Various Cast Members",
          author: content.author || "Various Authors",
          synopsis: content.description || post.content || "No description available."
        };
        
        setMedia(mediaData);
        setUserRating(Math.round(mediaData.rating));
      } catch (error) {
        console.error('Failed to load post:', error);
        toast({ title: "Failed to load content", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    loadPostData();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-media-berry-crush mx-auto mb-4"></div>
          <p className="text-media-dark-raspberry/70">Loading content...</p>
        </div>
      </div>
    );
  }
  
  if (!media) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-media-dark-raspberry mb-4">Content Not Found</h1>
          <p className="text-media-dark-raspberry/70 mb-6">The content you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/feed")}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-media-pearl-aqua to-media-berry-crush text-white font-semibold hover:shadow-lg smooth-all"
          >
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  const handleRatePost = async (rating: number) => {
    if (!isAuthenticated) {
      toast({ title: "Please login to rate", variant: "destructive" });
      return;
    }

    try {
      setIsRatingLoading(true);
      await contentApi.ratePost(media.id, { ratingValue: rating });
      setUserRating(rating);
      toast({ title: `Rated ${rating} stars!` });
    } catch (error) {
      console.error('Failed to rate post:', error);
      toast({ title: "Failed to submit rating", variant: "destructive" });
    } finally {
      setIsRatingLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua text-media-dark-raspberry">
      <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-media-pearl-aqua/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-media-powder-blush/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 lg:py-12">
        {/* Frosted Nav */}
        <header className="sticky top-4 z-20">
          <div className="glass flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-5 py-3 shadow-2xl shadow-media-frozen-water/60">
            <div className="flex items-center gap-2 text-lg font-black text-media-berry-crush">
            </div>

            <div className="flex flex-1 items-center gap-4 pl-6">
              <div className="relative hidden flex-1 items-center md:flex">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-media-dark-raspberry/50" />
                <input
                  type="text"
                  placeholder="Search reviews, creators, vibes..."
                  className="h-10 w-full rounded-full border border-white/60 bg-white/60 px-9 text-sm text-media-dark-raspberry placeholder:text-media-dark-raspberry/40 focus:outline-none focus:ring-2 focus:ring-media-powder-blush/40"
                />
              </div>

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
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush text-sm font-bold text-white flex items-center justify-center">
                  MV
                </span>
                <span>Marley Vance</span>
              </div>
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main Column */}
          <article className="space-y-10">
            {/* Post Container */}
            <section className="rounded-[28px] border border-media-pearl-aqua/40 bg-white/90 p-8 shadow-[0_20px_60px_rgba(147,225,216,0.35)] backdrop-blur-xl animate-slide-up">
              {/* Post Header */}
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-media-powder-blush to-media-berry-crush text-2xl font-bold text-white">
                    EV
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-media-berry-crush">Eden Vega</p>
                    <p className="text-sm text-media-dark-raspberry/60">Posted 32 min ago • Critic Mode</p>
                    <span className="mt-1 inline-flex items-center rounded-full bg-media-frozen-water px-3 py-0.5 text-xs font-medium text-media-dark-raspberry">Reviewer · Seasoned Critic</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                  <button
                    onClick={() => setSaved((prev) => !prev)}
                    className={cn(
                      "rounded-full px-4 py-2 text-media-dark-raspberry transition hover:shadow-lg",
                      saved ? "bg-media-powder-blush/40" : "bg-media-frozen-water"
                    )}
                  >
                    <Bookmark className="mr-2 inline h-4 w-4 align-middle" />
                    {saved ? "Saved" : "Save"}
                  </button>
                  <button 
                    onClick={() => alert("Following user!")}
                    className="rounded-full bg-media-powder-blush px-5 py-2 text-white shadow-lg shadow-media-powder-blush/40 transition hover:-translate-y-0.5"
                  >
                    Follow
                  </button>
                  <button 
                    onClick={() => alert("More options coming soon!")}
                    className="rounded-full bg-media-frozen-water p-2 text-media-dark-raspberry hover:text-media-berry-crush"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mt-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  {categoryTags.map((tag) => (
                    <span
                      key={tag.label}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-media-dark-raspberry shadow-sm shadow-media-frozen-water/40",
                        "bg-gradient-to-r",
                        tag.gradient
                      )}
                    >
                      <span>{tag.icon}</span>
                      {tag.label}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl font-bold text-media-dark-raspberry">
                  {media.title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-media-dark-raspberry/70">
                  <span className="capitalize">{media.type}</span>
                  <span>•</span>
                  <span>{media.year}</span>
                  <span>•</span>
                  <span>{media.genre}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-media-powder-blush text-media-powder-blush" />
                    <span className="font-semibold">{media.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-base leading-relaxed text-media-dark-raspberry/80">
                  {media.synopsis}
                </p>

                <div className="overflow-hidden rounded-3xl border border-media-frozen-water/70 bg-gradient-to-br from-media-pearl-aqua/60 via-white to-media-powder-blush/40 shadow-inner">
                  <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
                    <div className="flex-1 space-y-3">
                      <p className="text-sm uppercase tracking-[0.2em] text-media-dark-raspberry/60">Featured Moment</p>
                      <p className="text-lg font-semibold text-media-berry-crush">Episode 04 · Dream Archive</p>
                      <p className="text-media-dark-raspberry/70">
                        I paused five times just to take in the production design. The blend of holographic film stock and watercolor overlays feels impossibly tactile.
                      </p>
                    </div>
                    <div className="relative h-60 flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-media-berry-crush/80 to-media-powder-blush/80 shadow-lg shadow-media-berry-crush/30">
                      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.4),_transparent_60%)]" />
                      <div className="relative z-10 flex h-full w-full items-center justify-center text-5xl">
                        🎞️
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="mt-10 grid gap-6 rounded-3xl border border-media-frozen-water/80 bg-media-frozen-water/60 p-6 md:grid-cols-[1fr_280px]">
                <div>
                  <p className="text-sm font-semibold text-media-dark-raspberry/60 uppercase tracking-wide">Rate this vibe</p>
                  <div className="mt-4 flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => handleRatePost(star)}
                        disabled={isRatingLoading}
                        className="transition hover:-translate-y-0.5"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={cn(
                            "h-9 w-9",
                            star <= displayedRating
                              ? "fill-media-powder-blush text-media-powder-blush drop-shadow-md"
                              : "text-media-berry-crush/20"
                          )}
                        />
                      </button>
                    ))}
                    <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-media-berry-crush shadow-sm">
                      {displayedRating.toFixed(1)} / 5
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-media-dark-raspberry/60">Hover a star to preview · Click to lock it in</p>
                </div>

                <div className="rounded-2xl bg-white/70 p-4 shadow-lg shadow-media-frozen-water/70">
                  <p className="text-xs uppercase tracking-wide text-media-dark-raspberry/50">Community Score</p>
                  <p className="mt-2 text-4xl font-bold text-media-berry-crush">{media.rating.toFixed(1)}</p>
                  <p className="text-xs text-media-dark-raspberry/60">Average Rating</p>
                  <div className="mt-4 space-y-3">
                    {ratingStats.distribution.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs font-semibold text-media-dark-raspberry/70">
                          <span>{item.label}</span>
                          <span>{item.percent}%</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-white/70">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-media-powder-blush to-media-berry-crush"
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="mt-8 flex flex-wrap gap-4 rounded-2xl border border-media-pearl-aqua/50 bg-white/70 p-4 text-sm font-semibold text-media-dark-raspberry">
                <button
                  onClick={() => setLiked((prev) => !prev)}
                  className={cn(
                    "flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full px-4 py-2 transition",
                    liked
                      ? "bg-media-berry-crush text-white shadow-lg shadow-media-berry-crush/40"
                      : "bg-media-frozen-water hover:bg-media-powder-blush/30"
                  )}
                >
                  <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                  {liked ? "Loved" : "Love"}
                  <span className="text-xs font-medium opacity-80">1.2k</span>
                </button>
                <button 
                  onClick={() => {
                    const commentSection = document.querySelector('[data-comments]');
                    commentSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-full bg-media-frozen-water px-4 py-2 transition hover:bg-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Comment
                  <span className="text-xs font-medium opacity-80">87</span>
                </button>
              </div>
            </section>

            {/* Comments */}
            <section data-comments className="rounded-[28px] border border-media-pearl-aqua/40 bg-white/90 p-8 shadow-[0_20px_60px_rgba(255,166,158,0.25)] backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-media-dark-raspberry/50">Glow Talk</p>
                  <h2 className="text-3xl font-bold text-media-berry-crush">Comments</h2>
                </div>
                <span className="text-sm font-semibold text-media-dark-raspberry/60">Open threads · 14</span>
              </div>
              <div className="rounded-3xl border border-media-frozen-water/80 bg-media-frozen-water/60 p-5">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush text-white font-bold">
                    MV
                  </div>
                  <div className="flex-1 space-y-3">
                    <textarea
                      value={commentDraft}
                      onChange={(event) => setCommentDraft(event.target.value)}
                      placeholder="Leave a glowing thought..."
                      className="min-h-[96px] w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-base text-media-dark-raspberry placeholder:text-media-dark-raspberry/40 focus:outline-none focus:ring-2 focus:ring-media-powder-blush/40"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs font-semibold text-media-dark-raspberry/60">
                        <span className="rounded-full bg-white/60 px-3 py-1">✨ + Moodboard</span>
                        <span className="rounded-full bg-white/60 px-3 py-1">📎 Attachment</span>
                      </div>
                      <button
                        onClick={() => {
                          if (commentDraft.trim()) {
                            alert("Comment posted!");
                            setCommentDraft("");
                          }
                        }}
                        disabled={!commentDraft.trim()}
                        className="rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua px-6 py-2 text-sm font-bold text-white shadow-lg shadow-media-powder-blush/40 transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {commentThreads.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-3xl border border-media-frozen-water/80 bg-white/80 p-6 shadow-lg shadow-media-frozen-water/60 transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-media-powder-blush to-media-berry-crush text-white font-bold">
                          {comment.avatar}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-media-dark-raspberry">{comment.name}</p>
                            {comment.badge && (
                              <span className="rounded-full bg-media-pearl-aqua/60 px-2.5 py-0.5 text-xs font-semibold text-media-dark-raspberry">
                                {comment.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-media-dark-raspberry/60">{comment.timestamp}</p>
                        </div>
                      </div>
                      <button className="text-media-dark-raspberry/40 hover:text-media-berry-crush">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-4 text-media-dark-raspberry/80">{comment.content}</p>
                    <div className="mt-5 flex items-center gap-4 text-sm font-semibold text-media-dark-raspberry/60">
                      <button className="flex items-center gap-1 rounded-full bg-media-frozen-water px-3 py-1 transition hover:bg-media-powder-blush/30">
                        <Heart className="h-4 w-4" /> {comment.likes}
                      </button>
                      <button className="flex items-center gap-1 rounded-full bg-media-frozen-water px-3 py-1 transition hover:bg-media-powder-blush/30">
                        <MessageCircle className="h-4 w-4" /> Reply
                      </button>
                    </div>

                    {comment.replies && (
                      <div className="mt-5 space-y-4 border-l-2 border-dashed border-media-pearl-aqua/60 pl-6">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="rounded-2xl bg-media-frozen-water/70 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-media-dark-raspberry">{reply.name}</p>
                                <p className="text-xs text-media-dark-raspberry/60">{reply.timestamp}</p>
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-media-dark-raspberry/80">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-[24px] border border-media-pearl-aqua/40 bg-white/80 p-6 shadow-lg shadow-media-pearl-aqua/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-media-berry-crush">Trending Reviews</h3>
                <span className="text-xs font-semibold text-media-dark-raspberry/60">Live</span>
              </div>
              <div className="mt-4 space-y-4">
                {trendingHighlights.map((trend) => (
                  <article
                    key={trend.id}
                    className="flex gap-3 rounded-2xl border border-white/80 bg-gradient-to-r from-white to-media-frozen-water/80 p-3 shadow-inner"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">
                      {trend.image}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-media-dark-raspberry">{trend.title}</p>
                      <p className="text-xs text-media-dark-raspberry/60">{trend.blurb}</p>
                      <p className="mt-1 text-xs font-semibold text-media-powder-blush">⭐ {trend.rating}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate("/feed")}
        className="fixed bottom-8 right-8 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-media-powder-blush to-media-pearl-aqua text-white shadow-2xl shadow-media-powder-blush/50 transition hover:scale-105"
        aria-label="Create new post"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}
