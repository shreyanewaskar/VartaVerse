import { useState, useEffect } from "react";
import { X, User, Mail, Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/lib/user-api";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

export default function EditProfileModal({ isOpen, onClose, onProfileUpdated }: EditProfileModalProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    bio: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with current user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || ""
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Send complete user object with updated fields
      const updateData = {
        ...user,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio
      };
      
      console.log('Sending update data:', updateData);
      
      await userApi.updateProfile(updateData);
      
      // Refresh user data
      await refreshUser();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
      onProfileUpdated?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-media-frozen-water p-6 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-2xl font-bold text-media-dark-raspberry">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-media-powder-blush/20 hover:scale-110 smooth-all text-media-dark-raspberry group"
            >
              <X className="w-6 h-6 group-hover:text-media-powder-blush smooth-all" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none smooth-all",
                    errors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                      : "border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20"
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-media-frozen-water bg-media-frozen-water/30 text-media-dark-raspberry/70 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-media-dark-raspberry/50 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-media-dark-raspberry/50" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:outline-none focus:ring-2 focus:ring-media-pearl-aqua/20 smooth-all resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
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
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}