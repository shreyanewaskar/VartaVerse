import { useState, useRef } from "react";
import MainFeed from "@/components/MainFeed";
import TrendingSidebar from "@/components/TrendingSidebar";
import FloatingActionButton from "@/components/FloatingActionButton";
import CreatePostModal from "@/components/CreatePostModal";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua/30">
      {/* Main Container */}
      <div className="max-w-full mx-auto px-4 md:px-6 py-6">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <MainFeed key={refreshTrigger} />
          </div>

          {/* Trending Sidebar - Takes 1 column on large screens */}
          <div>
            <TrendingSidebar />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onOpen={() => setIsModalOpen(true)} />

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
