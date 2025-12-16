import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import AuthNavBar from "@/components/AuthNavBar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({ email, password });
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

        {/* Login Card Container */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
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
                Welcome Back!
              </h1>
              <p className="text-center text-media-dark-raspberry/70 mb-8">
                Login to continue exploring your favorite media
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-media-dark-raspberry/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: undefined });
                      }}
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
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: undefined });
                      }}
                      placeholder="Enter your password"
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
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded accent-media-pearl-aqua cursor-pointer"
                    />
                    <span className="text-sm text-media-dark-raspberry">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-media-berry-crush hover:underline hover:text-media-powder-blush smooth-all"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-media-frozen-water" />
                <span className="text-sm text-media-dark-raspberry/50">or</span>
                <div className="flex-1 h-px bg-media-frozen-water" />
              </div>

              {/* Admin Login Button */}
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="w-full mb-4 px-6 py-3 rounded-xl bg-gradient-to-r from-media-berry-crush to-media-dark-raspberry text-white font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all group cursor-pointer"
              >
                Admin Login
              </button>

              {/* Register Link */}
              <p className="text-center text-media-dark-raspberry">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-media-berry-crush hover:text-media-powder-blush hover:underline smooth-all"
                >
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
