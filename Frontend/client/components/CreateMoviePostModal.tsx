import { useState } from "react";
import { X, Film, Upload, Image } from "lucide-react";
import { contentApi } from "@/lib/content-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface CreateMoviePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function CreateMoviePostModal({ isOpen, onClose, onPostCreated }: CreateMoviePostModalProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({ title: "Please login to create posts", variant: "destructive" });
      return;
    }

    if (!title.trim() || !director.trim() || !genre.trim() || !year.trim() || !description.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = null;
      if (selectedImage) {
        // Store image in localStorage with a unique key
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedImage);
        });
        const imageKey = `movie_image_${Date.now()}`;
        localStorage.setItem(imageKey, imageData);
        imageUrl = imageKey;
      }
      
      const movieData = {
        director: director.trim(),
        genre: genre.trim(),
        year: year.trim(),
        description: description.trim(),
        imageUrl: imageUrl
      };

      const postData = {
        title: title.trim(),
        content: JSON.stringify(movieData),
        category: "movie"
      };

      await contentApi.createPost(postData);
      
      toast({ title: "Movie post created successfully!" });
      
      // Reset form
      setTitle("");
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
        title: "Failed to create movie post", 
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-media-dark-raspberry">
                Create Movie Post
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-media-powder-blush/20 hover:scale-110 smooth-all text-media-dark-raspberry group"
            >
              <X className="w-6 h-6 group-hover:text-media-powder-blush smooth-all" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Movie Title */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Movie Title *
              </label>
              <input
                type="text"
                placeholder="Enter movie title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                required
              />
            </div>

            {/* Director and Genre Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                  Director *
                </label>
                <input
                  type="text"
                  placeholder="Director name..."
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                  Genre *
                </label>
                <input
                  type="text"
                  placeholder="Action, Drama, Comedy..."
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                  required
                />
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Release Year *
              </label>
              <input
                type="text"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Description *
              </label>
              <textarea
                placeholder="Tell us about this movie..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 focus:shadow-lg smooth-all resize-none h-32"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Movie Poster (Optional)
              </label>
              {!imagePreview ? (
                <div className="border-2 border-dashed border-media-pearl-aqua rounded-2xl p-6 text-center hover:border-media-berry-crush transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-media-pearl-aqua mx-auto mb-2" />
                    <p className="text-media-dark-raspberry font-medium">Click to upload image</p>
                    <p className="text-media-dark-raspberry/60 text-sm">PNG, JPG up to 10MB</p>
                  </label>
                </div>
              ) : (
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
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-media-pearl-aqua text-media-dark-raspberry font-bold hover:bg-media-pearl-aqua/10 smooth-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-media-berry-crush to-media-pearl-aqua text-white font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Movie Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}