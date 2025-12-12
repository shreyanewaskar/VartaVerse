import { TrendingUp, ChevronRight } from "lucide-react";

interface TrendingItem {
  id: string;
  title: string;
  category: string;
  posts: number;
  isTrending: boolean;
}

const trendingItems: TrendingItem[] = [
  { id: "1", title: "Indie Cinema Revival", category: "Movies", posts: 2840, isTrending: true },
  { id: "2", title: "Mind-Bending Sci-Fi", category: "TV Shows", posts: 1562, isTrending: true },
  { id: "3", title: "Book Club Picks", category: "Books", posts: 912, isTrending: false },
  { id: "4", title: "Summer Blockbusters", category: "Movies", posts: 3124, isTrending: true },
  { id: "5", title: "Underrated Gems", category: "TV Shows", posts: 756, isTrending: false },
];

export default function TrendingSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 gap-4">
      {/* Trending Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-media-frozen-water">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-media-berry-crush" />
            <h3 className="font-bold text-media-dark-raspberry">Trending Now</h3>
          </div>
        </div>

        <div className="divide-y divide-media-frozen-water max-h-96 overflow-y-auto">
          {trendingItems.map((item) => (
            <button
              key={item.id}
              className="w-full p-4 hover:bg-media-frozen-water/40 smooth-all transition-colors text-left group"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <h4 className="font-semibold text-media-dark-raspberry group-hover:text-media-berry-crush smooth-all line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-media-berry-crush/60 mt-1">{item.category}</p>
                </div>
                {item.isTrending && (
                  <div className="flex-shrink-0 ml-2 px-2 py-1 rounded-lg bg-gradient-to-r from-media-powder-blush to-media-berry-crush text-white text-xs font-bold">
                    Trending
                  </div>
                )}
              </div>
              <p className="text-xs text-media-berry-crush/50 mt-2">{item.posts.toLocaleString()} posts</p>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-media-frozen-water">
          <button className="w-full px-4 py-2 text-center text-sm font-semibold text-media-dark-raspberry hover:text-media-berry-crush smooth-all flex items-center justify-center gap-1 group">
            See More
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 smooth-all" />
          </button>
        </div>
      </div>
    </aside>
  );
}
