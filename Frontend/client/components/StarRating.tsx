import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const getRatingLabel = (rating: number): string => {
  if (rating === 0) return "Select a rating";
  if (rating === 1) return "Terrible";
  if (rating === 2) return "Poor";
  if (rating === 3) return "Good";
  if (rating === 4) return "Great";
  if (rating === 5) return "Excellent";
  return "";
};

export default function StarRating({ rating, onRatingChange }: StarRatingProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-media-dark-raspberry">
        Rating
      </label>
      <div className="flex gap-3 items-center">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className="group cursor-pointer transition-transform duration-200 hover:scale-110"
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-all duration-200",
                  star <= rating
                    ? "fill-media-powder-blush text-media-powder-blush"
                    : "text-media-frozen-water group-hover:text-media-powder-blush/50"
                )}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <div className="ml-4">
            <p className="text-sm font-semibold text-media-powder-blush">
              {rating}/5 Stars - {getRatingLabel(rating)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
