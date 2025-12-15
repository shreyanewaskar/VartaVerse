import { useState, useEffect } from "react";
import { TrendingUp, ChevronRight } from "lucide-react";
import { contentApi } from "@/lib/content-api";

export default function TrendingSidebar() {
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingPosts = async () => {
      try {
        const posts = await contentApi.getTrendingPosts();
        setTrendingPosts(posts);
      } catch (err) {
        console.error('Failed to load trending posts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTrendingPosts();
  }, []);
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
          {loading ? (
            <div className="p-4 text-center text-media-dark-raspberry/60">
              Loading trending posts...
            </div>
          ) : trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <button
                key={post.postId}
                className="w-full p-4 hover:bg-media-frozen-water/40 smooth-all transition-colors text-left group"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <h4 className="font-semibold text-media-dark-raspberry group-hover:text-media-berry-crush smooth-all line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-media-berry-crush/60 mt-1 capitalize">{post.category || 'General'}</p>
                  </div>
                  <div className="flex-shrink-0 ml-2 px-2 py-1 rounded-lg bg-gradient-to-r from-media-powder-blush to-media-berry-crush text-white text-xs font-bold">
                    Trending
                  </div>
                </div>
                <p className="text-xs text-media-berry-crush/50 mt-2">{post.likesCount || 0} likes</p>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-media-dark-raspberry/60">
              No trending posts available
            </div>
          )}
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
