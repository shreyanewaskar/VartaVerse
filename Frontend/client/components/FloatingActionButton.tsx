import { Plus } from "lucide-react";
import { useState } from "react";

interface FloatingActionButtonProps {
  onOpen?: () => void;
}

export default function FloatingActionButton({ onOpen }: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onOpen?.();
  };

  return (
    <>
      {/* Tooltip */}
      {isHovered && (
        <div className="fixed bottom-24 right-8 animate-fade-in">
          <div className="bg-media-dark-raspberry text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg whitespace-nowrap">
            Create Post / Review
            <div className="absolute bottom-0 right-4 translate-y-1 w-2 h-2 bg-media-dark-raspberry transform rotate-45" />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush shadow-xl hover:shadow-2xl hover:scale-110 smooth-all animate-pop-in flex items-center justify-center group cursor-pointer z-30"
      >
        <Plus className="w-8 h-8 text-white group-hover:rotate-90 smooth-all" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush opacity-0 group-hover:opacity-30 blur-xl smooth-all" />
      </button>
    </>
  );
}
