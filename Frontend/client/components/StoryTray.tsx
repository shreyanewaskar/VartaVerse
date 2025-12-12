import { useState } from "react";
import { Plus } from "lucide-react";

interface Story {
  id: string;
  name: string;
  hasNew: boolean;
  color: string;
}

const stories: Story[] = [
  { id: "1", name: "Your Story", hasNew: false, color: "from-media-pearl-aqua to-media-powder-blush" },
  { id: "2", name: "Alex Chen", hasNew: true, color: "from-media-powder-blush to-media-berry-crush" },
  { id: "3", name: "Jordan Lee", hasNew: true, color: "from-media-berry-crush to-media-dark-raspberry" },
  { id: "4", name: "Sam Rivera", hasNew: false, color: "from-media-pearl-aqua to-media-berry-crush" },
  { id: "5", name: "Casey Park", hasNew: true, color: "from-media-powder-blush to-media-frozen-water" },
  { id: "6", name: "Morgan Wei", hasNew: false, color: "from-media-dark-raspberry to-media-powder-blush" },
];

export default function StoryTray() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setSelectedStory(story.id)}
            className="flex-shrink-0 animate-fade-in group cursor-pointer"
          >
            <div className={`relative w-20 h-28 rounded-xl overflow-hidden ${story.color} bg-gradient-to-br p-0.5 hover:shadow-lg smooth-all`}>
              <div className="w-full h-full rounded-lg bg-white/10 backdrop-blur-sm flex flex-col items-center justify-between p-3">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {story.name.charAt(0)}
                </div>

                {/* Has New Content Indicator */}
                {story.hasNew && (
                  <div className="w-3 h-3 rounded-full bg-media-powder-blush pulse-badge shadow-md" />
                )}
              </div>

              {/* Story Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2 text-white text-xs font-semibold text-center truncate">
                {story.name}
              </div>
            </div>
          </button>
        ))}

        {/* Add Story Button */}
        <button className="flex-shrink-0 group animate-fade-in">
          <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-media-frozen-water to-media-pearl-aqua p-0.5 hover:shadow-lg smooth-all">
            <div className="w-full h-full rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center hover:bg-white/70 smooth-all">
              <Plus className="w-6 h-6 text-media-berry-crush group-hover:text-media-dark-raspberry smooth-all" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
