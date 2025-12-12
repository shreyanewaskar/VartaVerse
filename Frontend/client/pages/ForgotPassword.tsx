import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Check } from "lucide-react";
import AuthNavBar from "@/components/AuthNavBar";
import { cn } from "@/lib/utils";

type Step = "email" | "verify" | "reset" | "success";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setStep("verify");
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setStep("reset");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setStep("success");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AuthNavBar />

      {/* Background with animated shapes */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-media-frozen-water via-media-pearl-aqua/20 to-white">
        {/* Animated Background Shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-media-pearl-aqua/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-media-powder-blush/20 rounded-full blur-3xl animate-pulse opacity-80" style={{ animationDelay: "1s" }} />

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="w-full max-w-md animate-fade-in">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <Link to="/" className="group">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center transform group-hover:scale-110 smooth-all shadow-lg">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                </Link>
              </div>

              {/* Step 1: Email */}
              {step === "email" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-3xl font-bold text-media-berry-crush text-center mb-2">
                      Forgot Password?
                    </h1>
                    <p className="text-center text-media-dark-raspberry/70">
                      Enter your email to receive a verification code
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                            setError("");
                          }}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all"
                        />
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all flex items-center justify-center gap-2"
                    >
                      Send Code
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <p className="text-center text-media-dark-raspberry/70 text-sm">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-media-berry-crush hover:text-media-powder-blush smooth-all"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>
              )}

              {/* Step 2: Verify Code */}
              {step === "verify" && (
                <div className="space-y-6 animate-slide-up">
                  <div>
                    <h1 className="text-3xl font-bold text-media-berry-crush text-center mb-2">
                      Verify Email
                    </h1>
                    <p className="text-center text-media-dark-raspberry/70 text-sm">
                      We sent a verification code to {email}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                          setError("");
                        }}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all text-center text-2xl tracking-widest"
                      />
                      {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all flex items-center justify-center gap-2"
                    >
                      Verify Code
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <button
                    onClick={() => setStep("email")}
                    className="w-full text-center text-media-dark-raspberry/70 hover:text-media-berry-crush smooth-all text-sm"
                  >
                    ← Back to Email
                  </button>
                </div>
              )}

              {/* Step 3: Reset Password */}
              {step === "reset" && (
                <div className="space-y-6 animate-slide-up">
                  <div>
                    <h1 className="text-3xl font-bold text-media-berry-crush text-center mb-2">
                      Create New Password
                    </h1>
                    <p className="text-center text-media-dark-raspberry/70 text-sm">
                      Choose a strong password for your account
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="At least 8 characters"
                        className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-media-dark-raspberry mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 rounded-xl border-2 border-media-frozen-water focus:border-media-pearl-aqua focus:ring-2 focus:ring-media-pearl-aqua/20 focus:outline-none smooth-all"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all flex items-center justify-center gap-2"
                    >
                      Reset Password
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <button
                    onClick={() => setStep("verify")}
                    className="w-full text-center text-media-dark-raspberry/70 hover:text-media-berry-crush smooth-all text-sm"
                  >
                    ← Back to Verification
                  </button>
                </div>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <div className="space-y-6 animate-slide-up text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-media-powder-blush to-media-berry-crush flex items-center justify-center animate-bounce">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-media-berry-crush mb-2">
                      Password Reset!
                    </h1>
                    <p className="text-media-dark-raspberry/70">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                  </div>

                  <Link
                    to="/login"
                    className="w-full inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold hover:shadow-2xl hover:-translate-y-1 smooth-all"
                  >
                    Back to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
