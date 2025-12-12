import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import AuthNavBar from "@/components/AuthNavBar";
import { cn } from "@/lib/utils";
import { userApi } from "@/lib/user-api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      await login({ email, password });
      toast({ title: "Admin login successful" });
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AuthNavBar />

      {/* Background with animated shapes */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#ddfff7] via-[#93e1d8]/20 to-white">
        {/* Animated Background Shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#93e1d8]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ffa69e]/20 rounded-full blur-3xl animate-pulse opacity-80" style={{ animationDelay: "1s" }} />

        {/* Login Card Container */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="w-full max-w-md animate-fade-in">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#aa4465] to-[#861657] flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-3xl font-bold text-[#aa4465] text-center mb-2">
                Admin Portal
              </h1>
              <p className="text-center text-[#861657]/70 mb-8">
                Secure access to admin dashboard
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-[#861657] mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#861657]/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="admin@vartaverse.com"
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none smooth-all",
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-[#ddfff7] focus:border-[#93e1d8] focus:ring-2 focus:ring-[#93e1d8]/20"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-[#861657] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#861657]/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: undefined });
                      }}
                      placeholder="Enter admin password"
                      className={cn(
                        "w-full pl-10 pr-12 py-3 rounded-xl border-2 focus:outline-none smooth-all",
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-[#ddfff7] focus:border-[#93e1d8] focus:ring-2 focus:ring-[#93e1d8]/20"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#861657]/50 hover:text-[#861657] smooth-all"
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

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#aa4465] to-[#861657] text-white font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Access Dashboard"}
                </button>
              </form>

              {/* Back to User Login */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm text-[#861657]/60 hover:text-[#aa4465] hover:underline smooth-all"
                >
                  ← Back to User Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


