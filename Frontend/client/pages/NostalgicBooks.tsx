import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Bookmark,
  Heart,
  Search,
  Share2,
  Star,
  Sun,
  Moon,
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  description: string;
  category: string;
}

const featuredBooks: Book[] = [
  {
    id: "f1",
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    cover: "🌿",
    rating: 4.8,
    description: "A timeless tale of magic, friendship, and the healing power of nature.",
    category: "Classics",
  },
  {
    id: "f2",
    title: "Anne of Green Gables",
    author: "L.M. Montgomery",
    cover: "📖",
    rating: 4.9,
    description: "Follow Anne's adventures in the charming world of Avonlea.",
    category: "Childhood",
  },
  {
    id: "f3",
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    cover: "🦁",
    rating: 4.7,
    description: "Step through the wardrobe into a magical realm of wonder.",
    category: "Fantasy",
  },
];

const allBooks: Book[] = [
  {
    id: "b1",
    title: "Little Women",
    author: "Louisa May Alcott",
    cover: "👭",
    rating: 4.8,
    description: "The heartwarming story of four sisters growing up during the Civil War.",
    category: "Classics",
  },
  {
    id: "b2",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    cover: "⚡",
    rating: 4.9,
    description: "The beginning of a magical journey that captured millions of hearts.",
    category: "Fantasy",
  },
  {
    id: "b3",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "🎩",
    rating: 4.6,
    description: "Holden Caulfield's iconic coming-of-age story.",
    category: "Classics",
  },
  {
    id: "b4",
    title: "Nancy Drew: The Secret of the Old Clock",
    author: "Carolyn Keene",
    cover: "🔍",
    rating: 4.5,
    description: "The first mystery that started it all for young detectives.",
    category: "Mystery",
  },
  {
    id: "b5",
    title: "Matilda",
    author: "Roald Dahl",
    cover: "📚",
    rating: 4.9,
    description: "A brilliant girl with extraordinary powers and a love for books.",
    category: "Childhood",
  },
  {
    id: "b6",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "💍",
    rating: 4.8,
    description: "Bilbo Baggins' unexpected journey to the Lonely Mountain.",
    category: "Fantasy",
  },
  {
    id: "b7",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "🐦",
    rating: 4.9,
    description: "A powerful story of justice, childhood innocence, and moral growth.",
    category: "Classics",
  },
  {
    id: "b8",
    title: "The Hardy Boys: The Tower Treasure",
    author: "Franklin W. Dixon",
    cover: "🔐",
    rating: 4.4,
    description: "Frank and Joe's first thrilling mystery adventure.",
    category: "Mystery",
  },
  {
    id: "b9",
    title: "Charlotte's Web",
    author: "E.B. White",
    cover: "🕷️",
    rating: 4.7,
    description: "A beautiful friendship between a pig and a spider.",
    category: "Childhood",
  },
  {
    id: "b10",
    title: "The Giver",
    author: "Lois Lowry",
    cover: "🌈",
    rating: 4.6,
    description: "A dystopian world where memories hold the key to truth.",
    category: "Fantasy",
  },
  {
    id: "b11",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "💐",
    rating: 4.8,
    description: "Elizabeth Bennet and Mr. Darcy's timeless love story.",
    category: "Classics",
  },
  {
    id: "b12",
    title: "The Boxcar Children",
    author: "Gertrude Chandler Warner",
    cover: "🚂",
    rating: 4.5,
    description: "Four orphaned siblings create a home in an abandoned boxcar.",
    category: "Childhood",
  },
];

const trendingBooks = [
  { id: "t1", title: "The Secret Garden", author: "Frances Hodgson Burnett", cover: "🌿", rating: 4.8 },
  { id: "t2", title: "Anne of Green Gables", author: "L.M. Montgomery", cover: "📖", rating: 4.9 },
  { id: "t3", title: "Little Women", author: "Louisa May Alcott", cover: "👭", rating: 4.8 },
  { id: "t4", title: "Matilda", author: "Roald Dahl", cover: "📚", rating: 4.9 },
  { id: "t5", title: "The Hobbit", author: "J.R.R. Tolkien", cover: "💍", rating: 4.8 },
];

const categories = ["All", "Classics", "Childhood", "Fantasy", "Mystery"];

export default function NostalgicBooks() {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState<"day" | "night">("day");
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const filteredBooks = activeCategory === "All" 
    ? allBooks 
    : allBooks.filter(book => book.category === activeCategory);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-media-frozen-water via-white to-media-powder-blush text-media-dark-raspberry">
      {/* Floating Background Motifs */}
      <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-media-pearl-aqua/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-20 h-64 w-64 rounded-full bg-media-powder-blush/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-media-pearl-aqua/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]" />
      
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute top-32 left-8 text-6xl opacity-10">📚</div>
      <div className="pointer-events-none absolute top-64 right-16 text-5xl opacity-10">✈️</div>
      <div className="pointer-events-none absolute bottom-32 left-1/3 text-4xl opacity-10">📖</div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 lg:py-12">
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
              <span className="text-sm font-semibold text-media-dark-raspberry/70">/ Nostalgic Books</span>
            </div>

            <div className="flex flex-1 items-center gap-4 pl-6">
              <div className="relative hidden flex-1 items-center md:flex">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-media-dark-raspberry/50" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="h-10 w-full rounded-full border border-white/60 bg-white/60 px-9 text-sm text-media-dark-raspberry placeholder:text-media-dark-raspberry/40 focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/40"
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

        {/* Section Title */}
        <div className="space-y-3 text-center">
          <h1 className="text-5xl font-bold text-media-dark-raspberry lg:text-6xl">
            Nostalgic Reads
          </h1>
          <p className="text-lg text-media-berry-crush lg:text-xl">
            Rediscover classics, hidden gems, and your favorite childhood reads
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-media-pearl-aqua to-media-powder-blush" />
        </div>

        {/* Featured Book Carousel */}
        <section className="overflow-hidden rounded-[28px]">
          <div className="relative flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {featuredBooks.map((book, index) => (
              <div
                key={book.id}
                className={cn(
                  "group relative min-w-[320px] flex-shrink-0 rounded-3xl border border-media-pearl-aqua/40 bg-white/90 p-8 shadow-[0_20px_60px_rgba(147,225,216,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_25px_70px_rgba(255,166,158,0.45)]",
                  index === carouselIndex && "ring-2 ring-media-powder-blush/50"
                )}
                style={{ animation: "slide-up 0.4s ease-out" }}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="flex h-48 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-media-pearl-aqua/60 to-media-powder-blush/60 text-6xl shadow-lg">
                    {book.cover}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold text-media-dark-raspberry">{book.title}</h3>
                      <p className="text-sm font-semibold text-media-berry-crush">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-5 w-5",
                            star <= book.rating
                              ? "fill-media-powder-blush text-media-powder-blush"
                              : "text-media-berry-crush/20"
                          )}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-media-dark-raspberry/70">
                        {book.rating}
                      </span>
                    </div>
                    <p className="text-sm text-media-dark-raspberry/70">{book.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-to-br from-media-pearl-aqua/90 to-media-powder-blush/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button 
                    onClick={() => navigate(`/media/m1`)}
                    className="rounded-full bg-white px-6 py-3 text-sm font-bold text-media-dark-raspberry shadow-lg transition hover:scale-105"
                  >
                    View Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters / Sort Options */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300",
                activeCategory === category
                  ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush text-white shadow-lg shadow-media-powder-blush/40"
                  : "bg-white/70 text-media-dark-raspberry hover:bg-media-pearl-aqua/30 hover:shadow-md hover:shadow-media-pearl-aqua/50"
              )}
            >
              {category}
              {activeCategory === category && (
                <div className="absolute -bottom-1 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-white/80" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Books Grid Section */}
          <section>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onMouseEnter={() => setHoveredBook(book.id)}
                  onMouseLeave={() => setHoveredBook(null)}
                  className="group relative rounded-2xl border border-white/80 bg-white p-5 shadow-lg shadow-media-frozen-water/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-media-pearl-aqua/50"
                >
                  {/* Book Cover */}
                  <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-5xl shadow-inner">
                    {book.cover}
                  </div>

                  {/* Book Info */}
                  <h3 className="text-lg font-bold text-media-dark-raspberry">{book.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-media-berry-crush">{book.author}</p>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4 transition-all",
                          star <= book.rating
                            ? "fill-media-powder-blush text-media-powder-blush"
                            : "text-media-berry-crush/20"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-xs font-semibold text-media-dark-raspberry/60">
                      {book.rating}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 line-clamp-2 text-xs text-media-dark-raspberry/70">
                    {book.description}
                  </p>

                  {/* Hover Overlay / Quick Actions */}
                  {hoveredBook === book.id && (
                    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl bg-white/95 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/media/m1`); }}
                        className="rounded-full bg-gradient-to-r from-media-pearl-aqua to-media-powder-blush px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:scale-105"
                      >
                        Read Review
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); alert("Added to favorites!"); }}
                        className="rounded-full bg-media-frozen-water px-4 py-2 text-xs font-semibold text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); alert("Share feature coming soon!"); }}
                        className="rounded-full bg-media-frozen-water px-4 py-2 text-xs font-semibold text-media-dark-raspberry transition hover:bg-media-powder-blush/30"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Trending / Popular Nostalgic Books Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-[24px] border border-media-pearl-aqua/40 bg-white/80 p-6 shadow-lg shadow-media-pearl-aqua/50">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-media-berry-crush flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-media-powder-blush" />
                  Trending Books
                </h3>
                <span className="text-xs font-semibold text-media-dark-raspberry/60">Live</span>
              </div>
              <div className="space-y-4">
                {trendingBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="group flex gap-3 rounded-2xl border border-white/80 bg-gradient-to-r from-white to-media-frozen-water/80 p-3 shadow-inner transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-media-powder-blush/40"
                  >
                    <div className="flex h-16 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                      {book.cover}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-media-dark-raspberry">{book.title}</p>
                      <p className="text-xs text-media-dark-raspberry/60">{book.author}</p>
                      <div className="mt-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3 w-3",
                              star <= book.rating
                                ? "fill-media-powder-blush text-media-powder-blush"
                                : "text-media-berry-crush/20"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* Call-to-Action Banner */}
        <section className="rounded-[28px] border border-media-pearl-aqua/40 bg-gradient-to-r from-media-frozen-water via-white to-media-powder-blush/30 p-10 shadow-[0_20px_60px_rgba(255,166,158,0.25)]">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-media-dark-raspberry">
                Rediscover your favorite books from the past
              </h2>
              <p className="text-media-berry-crush">
                Join thousands of readers exploring nostalgic literature
              </p>
            </div>
            <button 
              onClick={() => navigate("/books")}
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-media-powder-blush/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_25px_70px_rgba(255,166,158,0.6)]"
            >
              Explore More Books
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="rounded-[24px] border border-media-pearl-aqua/30 bg-media-frozen-water/60 p-8 shadow-lg">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="mb-4 text-lg font-bold text-media-berry-crush">VartaVerse</h4>
              <p className="text-sm text-media-dark-raspberry/70">
                Your gateway to nostalgic reads and timeless stories.
              </p>
            </div>
            <div>
              <h5 className="mb-3 text-sm font-semibold text-media-dark-raspberry">About</h5>
              <ul className="space-y-2 text-sm text-media-dark-raspberry/70">
                <li><a href="#" className="hover:text-media-berry-crush transition">Our Story</a></li>
                <li><a href="#" className="hover:text-media-berry-crush transition">Mission</a></li>
                <li><a href="#" className="hover:text-media-berry-crush transition">Team</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-3 text-sm font-semibold text-media-dark-raspberry">Contact</h5>
              <ul className="space-y-2 text-sm text-media-dark-raspberry/70">
                <li><a href="#" className="hover:text-media-berry-crush transition">Support</a></li>
                <li><a href="#" className="hover:text-media-berry-crush transition">Email</a></li>
                <li><a href="#" className="hover:text-media-berry-crush transition">Social</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-3 text-sm font-semibold text-media-dark-raspberry">Legal</h5>
              <ul className="space-y-2 text-sm text-media-dark-raspberry/70">
                <li><a href="#" className="hover:text-media-berry-crush transition">Terms</a></li>
                <li><a href="#" className="hover:text-media-berry-crush transition">Privacy</a></li>
                <li><a href="#" className="hover:text-media-berry-crush transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 border-t border-media-pearl-aqua/30 pt-6">
            <button className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
              <span className="text-lg">📘</span>
            </button>
            <button className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
              <span className="text-lg">📷</span>
            </button>
            <button className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
              <span className="text-lg">🐦</span>
            </button>
            <button className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-gradient-to-r hover:from-media-pearl-aqua hover:to-media-powder-blush hover:text-white">
              <span className="text-lg">📺</span>
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-media-dark-raspberry/60">
            © 2025 VartaVerse. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

