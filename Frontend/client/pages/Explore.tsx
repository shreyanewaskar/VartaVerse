import { useState } from "react";
import TrendingCarousel from "@/components/TrendingCarousel";
import MainFeed from "@/components/MainFeed";

const trendingMovies = [
  { id: "m1", title: "Inception", rank: 1, rating: 4.9, year: 2010, thumbnail: "🎬", type: "movie" as const },
  { id: "m2", title: "The Matrix", rank: 2, rating: 4.8, year: 1999, thumbnail: "🎬", type: "movie" as const },
  { id: "m3", title: "Dune", rank: 3, rating: 4.7, year: 2021, thumbnail: "🎬", type: "movie" as const },
  { id: "m4", title: "Oppenheimer", rank: 4, rating: 4.6, year: 2023, thumbnail: "🎬", type: "movie" as const },
  { id: "m5", title: "Parasite", rank: 5, rating: 4.8, year: 2019, thumbnail: "🎬", type: "movie" as const },
  { id: "m6", title: "Interstellar", rank: 6, rating: 4.9, year: 2014, thumbnail: "🎬", type: "movie" as const },
];

const trendingBooks = [
  { id: "b1", title: "The Midnight Library", rank: 1, rating: 4.8, year: 2020, thumbnail: "📚", type: "book" as const },
  { id: "b2", title: "Project Hail Mary", rank: 2, rating: 4.9, year: 2021, thumbnail: "📚", type: "book" as const },
  { id: "b3", title: "Dune", rank: 3, rating: 4.7, year: 1965, thumbnail: "📚", type: "book" as const },
  { id: "b4", title: "Project Manager", rank: 4, rating: 4.5, year: 2022, thumbnail: "📚", type: "book" as const },
  { id: "b5", title: "Atomic Habits", rank: 5, rating: 4.8, year: 2018, thumbnail: "📚", type: "book" as const },
];

const trendingShows = [
  { id: "s1", title: "Stranger Things", rank: 1, rating: 4.7, year: 2016, thumbnail: "📺", type: "show" as const },
  { id: "s2", title: "The Crown", rank: 2, rating: 4.6, year: 2016, thumbnail: "📺", type: "show" as const },
  { id: "s3", title: "Quantum Dreams", rank: 3, rating: 4.8, year: 2023, thumbnail: "📺", type: "show" as const },
  { id: "s4", title: "Breaking Bad", rank: 4, rating: 4.9, year: 2008, thumbnail: "📺", type: "show" as const },
  { id: "s5", title: "The Mandalorian", rank: 5, rating: 4.7, year: 2019, thumbnail: "📺", type: "show" as const },
];

const allMediaForGrid = [
  { id: "grid1", title: "Dune: Part Two", year: 2024, rating: 4.7, genre: "Sci-Fi", type: "movie" as const },
  { id: "grid2", title: "Killers of the Flower Moon", year: 2023, rating: 4.6, genre: "Drama", type: "movie" as const },
  { id: "grid3", title: "Poor Things", year: 2023, rating: 4.5, genre: "Romance", type: "movie" as const },
  { id: "grid4", title: "The Iron Widow", year: 2023, rating: 4.8, genre: "Action", type: "book" as const },
  { id: "grid5", title: "Lessons in Chemistry", year: 2022, rating: 4.7, genre: "Fiction", type: "book" as const },
  { id: "grid6", title: "The Silent Patient", year: 2019, rating: 4.8, genre: "Mystery", type: "book" as const },
  { id: "grid7", title: "Avatar: The Last Airbender", year: 2024, rating: 4.6, genre: "Action", type: "show" as const },
  { id: "grid8", title: "Wednesday", year: 2022, rating: 4.7, genre: "Comedy", type: "show" as const },
];

type FilterTab = "all" | "trending" | "new" | "reviews";

export default function Explore() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-media-dark-raspberry mb-4">
            Explore VartaVerse
          </h1>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-6 overflow-x-auto pb-2 border-b border-media-pearl-aqua/20 animate-slide-up">
          {(["all", "trending", "new", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize relative whitespace-nowrap smooth-all ${
                activeTab === tab
                  ? "text-media-dark-raspberry"
                  : "text-media-dark-raspberry/50 hover:text-media-dark-raspberry"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Trending Carousels */}
        <div className="space-y-8">
          <TrendingCarousel title="Trending Movies Now" items={trendingMovies} />
          <TrendingCarousel title="Popular Books This Week" items={trendingBooks} />
          <TrendingCarousel title="New Shows to Binge" items={trendingShows} />
        </div>

        {/* Personalized Feed Section */}
        <div className="space-y-6 animate-slide-up">
          <h2 className="text-2xl font-bold text-media-dark-raspberry">
            Popular Reviews & Discussions
          </h2>
          <MainFeed />
        </div>
      </div>
    </div>
  );
}
