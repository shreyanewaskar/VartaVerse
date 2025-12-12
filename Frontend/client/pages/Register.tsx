import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import AuthNavBar from "@/components/AuthNavBar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
  if (score <= 2) return { score: 2, label: "Fair", color: "bg-yellow-400" };
  if (score <= 3) return { score: 3, label: "Good", color: "bg-blue-400" };
  return { score: 4, label: "Strong", color: "bg-media-powder-blush" };
};

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    phoneNumber: "",
    bio: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      // Ensure required fields are present
      const finalData = {
        ...registerData,
        bio: registerData.bio || '',
        phoneNumber: registerData.phoneNumber || ''
      };
      await register(finalData);
      navigate("/feed");
    } catch (error) {
      // Error handled in useAuth hook
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AuthNavBar />

      {/* Background with animated shapes */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-media-frozen-water via-media-pearl-aqua/20 to-white">
        {/* Animated Background Shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-media-pearl-aqua/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-media-powder-blush/20 rounded-full blur-3xl animate-pulse opacity-80" style={{ animationDelay: "1s" }} />

        {/* Register Card Container */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
          <div className="w-full max-w-md animate-fade-in">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <Link to="/" className="group">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center transform group-hover:scale-110 smooth-all shadow-lg">
                    <span className="text-white font-bold text-xl">V</span>
                  </div>
                </Link>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl font-bold text-media-berry-crush text-center mb-2">
                Create Your Account
              </h1>
              <p className="text-center text-media-dark-raspberry/70 mb-8">
                Join VartaVerse and start sharing your reviews
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="John Doe"
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none smooth-all",
                        errors.name
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 glow-primary"
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none smooth-all",
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 glow-primary"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className={cn(
                        "w-full pl-10 pr-12 py-3 rounded-xl border-2 focus:outline-none smooth-all",
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 glow-primary"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-media-dark-raspberry/50 hover:text-media-dark-raspberry smooth-all"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-2 bg-media-frozen-water rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full smooth-all",
                            passwordStrength.color
                          )}
                          style={{
                            width: `${(passwordStrength.score / 4) * 100}%`,
                          }}
                        />
                      </div>
                      <p
                        className={cn(
                          "text-xs font-medium",
                          passwordStrength.score <= 1
                            ? "text-red-500"
                            : passwordStrength.score === 2
                              ? "text-yellow-600"
                              : passwordStrength.score === 3
                                ? "text-blue-600"
                                : "text-media-powder-blush"
                        )}
                      >
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={cn(
                        "w-full pl-10 pr-12 py-3 rounded-xl border-2 focus:outline-none smooth-all",
                        errors.confirmPassword
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 glow-primary"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-media-dark-raspberry/50 hover:text-media-dark-raspberry smooth-all"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-media-frozen-water" />
                <span className="text-sm text-media-dark-raspberry/50">or</span>
                <div className="flex-1 h-px bg-media-frozen-water" />
              </div>

              {/* Login Link */}
              <p className="text-center text-media-dark-raspberry">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-media-berry-crush hover:text-media-powder-blush hover:underline smooth-all"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
