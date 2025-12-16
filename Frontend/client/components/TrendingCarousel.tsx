import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CarouselItem {
  id: string;
  title: string;
  rank: number;
  rating: number;
  thumbnail: string;
  year: number;
  type: "movie" | "show" | "book";
}

interface TrendingCarouselProps {
  title: string;
  items: CarouselItem[];
}

export default function TrendingCarousel({ title, items }: TrendingCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  const handleItemClick = (item: CarouselItem) => {
    const path = `/${item.type}/${item.id}`;
    navigate(path);
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${title}`);
    if (!container) return;

    const scrollAmount = 400;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    container.scrollLeft = newPosition;
    setScrollPosition(newPosition);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-2xl font-bold text-media-dark-raspberry">{title}</h3>

      <div className="relative group">
        {/* Carousel Container */}
        <div
          id={`carousel-${title}`}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-64 animate-slide-up group/card cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush shadow-md hover:shadow-xl hover:-translate-y-2 smooth-all">
                {/* Image Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush opacity-20" />

                {/* Rank Badge */}
                <div className="absolute top-3 right-3 bg-media-powder-blush text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                  #{item.rank}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h4 className="text-white font-bold text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(item.rating)
                              ? "fill-media-powder-blush text-media-powder-blush"
                              : "text-white/30"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-white font-semibold">
                      {item.rating}
                    </span>
                  </div>

                  <p className="text-xs text-white/80">
                    {item.year} • {item.type}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-2 rounded-full bg-media-pearl-aqua hover:bg-media-pearl-aqua/80 text-white shadow-lg smooth-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-2 rounded-full bg-media-pearl-aqua hover:bg-media-pearl-aqua/80 text-white shadow-lg smooth-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
