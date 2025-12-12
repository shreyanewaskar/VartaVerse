import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Media {
  id: string;
  title: string;
  year: number;
  type: "movie" | "show" | "book";
  thumbnail?: string;
}

interface MediaSelectorProps {
  selectedMedia: Media | null;
  onMediaSelect: (media: Media) => void;
  onMediaClear: () => void;
}

const mockMediaDatabase: Media[] = [
  {
    id: "1",
    title: "The Midnight Library",
    year: 2022,
    type: "movie",
    thumbnail: "📚",
  },
  {
    id: "2",
    title: "Quantum Dreams",
    year: 2023,
    type: "show",
    thumbnail: "📺",
  },
  {
    id: "3",
    title: "Inception",
    year: 2010,
    type: "movie",
    thumbnail: "🎬",
  },
  {
    id: "4",
    title: "The Crown",
    year: 2016,
    type: "show",
    thumbnail: "👑",
  },
  {
    id: "5",
    title: "Dune",
    year: 2021,
    type: "movie",
    thumbnail: "🪐",
  },
  {
    id: "6",
    title: "Project Hail Mary",
    year: 2021,
    type: "book",
    thumbnail: "📖",
  },
];

export default function MediaSelector({
  selectedMedia,
  onMediaSelect,
  onMediaClear,
}: MediaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredMedia = mockMediaDatabase.filter((media) =>
    media.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (media: Media) => {
    onMediaSelect(media);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-media-dark-raspberry">
        What are you reviewing?
      </label>

      {selectedMedia ? (
        <div className="animate-slide-up bg-gradient-to-r from-media-frozen-water to-media-pearl-aqua/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{selectedMedia.thumbnail}</div>
            <div>
              <p className="font-semibold text-media-dark-raspberry">
                {selectedMedia.title}
              </p>
              <p className="text-xs text-media-berry-crush/70">
                {selectedMedia.year} • {selectedMedia.type}
              </p>
            </div>
          </div>
          <button
            onClick={onMediaClear}
            className="p-1.5 rounded-lg hover:bg-white/50 smooth-all"
          >
            <X className="w-5 h-5 text-media-dark-raspberry" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
          <input
            type="text"
            placeholder="Search for a movie, show, or book..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all"
          />

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-media-pearl-aqua/20 overflow-hidden z-50 animate-slide-up">
              {filteredMedia.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {filteredMedia.map((media) => (
                    <button
                      key={media.id}
                      onClick={() => handleSelect(media)}
                      className="w-full px-4 py-3 text-left hover:bg-media-frozen-water/50 smooth-all flex items-center gap-3 border-b border-media-frozen-water/30 last:border-b-0"
                    >
                      <div className="text-lg">{media.thumbnail}</div>
                      <div>
                        <p className="font-medium text-media-dark-raspberry">
                          {media.title}
                        </p>
                        <p className="text-xs text-media-berry-crush/60">
                          {media.year} • {media.type}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-media-dark-raspberry/50">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
