import { useState } from "react";
import { X, ImageIcon, Video, Hash, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import StarRating from "@/components/StarRating";
import MediaSelector from "@/components/MediaSelector";
import { contentApi } from "@/lib/content-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Media {
  id: string;
  title: string;
  year: number;
  type: "movie" | "show" | "book";
  thumbnail?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
  defaultCategory?: string;
}

type TabType = "post" | "review";

export default function CreatePostModal({ isOpen, onClose, onPostCreated, defaultCategory }: CreatePostModalProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [rating, setRating] = useState(0);
  const [spoiler, setSpoiler] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Movie-specific fields
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({ title: "Please login to create posts", variant: "destructive" });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = null;
      if (selectedImage) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedImage);
        });
        const imageKey = `post_image_${Date.now()}`;
        localStorage.setItem(imageKey, imageData);
        imageUrl = imageKey;
      }
      
      let postContent = content.trim();
      
      // For movie category, create structured content
      if (defaultCategory === "movie") {
        const movieData = {
          director: director.trim(),
          genre: genre.trim(),
          year: year.trim(),
          description: description.trim(),
          imageUrl: imageUrl
        };
        postContent = JSON.stringify(movieData);
      } else if (imageUrl) {
        // For regular posts, add image to content
        const postData = {
          text: content.trim(),
          imageUrl: imageUrl
        };
        postContent = JSON.stringify(postData);
      }
      
      const postData = {
        title: title.trim(),
        content: postContent,
        category: defaultCategory || (activeTab === "review" ? "review" : "general")
      };

      await contentApi.createPost(postData);
      
      toast({ title: "Post created successfully!" });
      
      // Reset form
      setTitle("");
      setContent("");
      setSelectedMedia(null);
      setRating(0);
      setSpoiler(false);
      setTags([]);
      setTagInput("");
      setDirector("");
      setGenre("");
      setYear("");
      setDescription("");
      setSelectedImage(null);
      setImagePreview(null);
      
      onPostCreated?.();
      onClose();
    } catch (error: any) {
      toast({ 
        title: "Failed to create post", 
        description: error.response?.data?.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm smooth-all animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-media-frozen-water p-6 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-2xl font-bold text-media-dark-raspberry">
              Create New Post
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-media-powder-blush/20 hover:scale-110 smooth-all text-media-dark-raspberry group"
            >
              <X className="w-6 h-6 group-hover:text-media-powder-blush smooth-all" />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-6 border-b border-media-frozen-water flex gap-8">
            {(["post", "review"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 font-semibold capitalize relative smooth-all",
                  activeTab === tab
                    ? "text-media-berry-crush"
                    : "text-media-dark-raspberry/50 hover:text-media-dark-raspberry"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Media Selection (Review Tab Only) */}
            {activeTab === "review" && (
              <MediaSelector
                selectedMedia={selectedMedia}
                onMediaSelect={setSelectedMedia}
                onMediaClear={() => setSelectedMedia(null)}
              />
            )}

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                {activeTab === "review" ? "Review Title" : "Post Title"}
              </label>
              <input
                type="text"
                placeholder={
                  activeTab === "review"
                    ? "A catchy review title..."
                    : "A catchy title for your post..."
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
              />
            </div>

            {/* Movie-specific fields */}
            {defaultCategory === "movie" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                      Director
                    </label>
                    <input
                      type="text"
                      placeholder="Director name..."
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                      className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                      Genre
                    </label>
                    <input
                      type="text"
                      placeholder="Action, Drama, etc..."
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Movie description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 focus:shadow-lg smooth-all resize-none h-32"
                  />
                </div>
              </>
            )}

            {/* Content Area - Only show for non-movie posts */}
            {defaultCategory !== "movie" && (
              <div>
                <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                  {activeTab === "review" ? "Your Review" : "Content"}
                </label>
                <textarea
                  placeholder="Share your thoughts, reviews, or start a discussion here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 focus:shadow-lg smooth-all resize-none h-40"
                />
              </div>
            )}

            {/* Review Specifics */}
            {activeTab === "review" && (
              <>
                {/* Star Rating */}
                <StarRating rating={rating} onRatingChange={setRating} />

                {/* Spoiler Alert */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-media-dark-raspberry">
                    Contains Spoilers
                  </label>
                  <button
                    onClick={() => setSpoiler(!spoiler)}
                    className={cn(
                      "relative inline-flex h-8 w-14 rounded-full smooth-all",
                      spoiler
                        ? "bg-gradient-to-r from-media-berry-crush to-media-powder-blush shadow-lg shadow-media-berry-crush/50"
                        : "bg-media-frozen-water"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-7 w-7 transform rounded-full bg-white smooth-all absolute top-0.5",
                        spoiler ? "translate-x-7" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
              </>
            )}

            {/* Image Upload */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Media Toolbar */}
            <div className="flex items-center gap-3 pt-4 border-t border-media-frozen-water">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="p-2.5 rounded-lg hover:bg-media-pearl-aqua/20 smooth-all group cursor-pointer">
                <ImageIcon className="w-5 h-5 text-media-dark-raspberry group-hover:text-media-pearl-aqua group-hover:scale-110 smooth-all" />
              </label>

              <button className="p-2.5 rounded-lg hover:bg-media-pearl-aqua/20 smooth-all group cursor-pointer">
                <Video className="w-5 h-5 text-media-dark-raspberry group-hover:text-media-pearl-aqua group-hover:scale-110 smooth-all" />
              </button>

              <div className="flex-1" />

              {/* Tags */}
              <div className="flex gap-2 flex-wrap items-center">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-gradient-to-r from-media-pearl-aqua to-media-powder-blush text-media-dark-raspberry px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 group"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="opacity-0 group-hover:opacity-100 smooth-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {tags.length < 5 && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="#"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="w-12 px-2 py-1.5 rounded-lg border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer / Publish Button */}
          <div className="sticky bottom-0 bg-white border-t border-media-frozen-water p-6 rounded-b-3xl flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-media-pearl-aqua text-media-dark-raspberry font-bold hover:bg-media-pearl-aqua/10 smooth-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title || (defaultCategory === "movie" ? (!director || !genre || !year || !description) : !content) || isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua text-white font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Publishing..." : (activeTab === "review" ? "Publish Review" : "Publish Post")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
