import { Link } from "react-router-dom";
import LandingNavBar from "@/components/LandingNavBar";
import FeatureCards from "@/components/FeatureCards";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Footer from "@/components/Footer";
import { Play } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingNavBar />

      {/* Hero Section */}
      <section className="flex-1 relative overflow-hidden bg-gradient-to-br from-media-frozen-water via-media-pearl-aqua/20 to-white">
        {/* Animated Background Shapes */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-media-pearl-aqua/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-media-powder-blush/20 rounded-full blur-3xl animate-pulse opacity-80" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-media-berry-crush/10 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: "2s" }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-media-dark-raspberry mb-6 leading-tight">
              VartaVerse
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-media-berry-crush to-media-dark-raspberry">
                Your Hub for Everything
              </span>
            </h1>

            <p className="text-xl text-media-berry-crush mb-8 leading-relaxed max-w-lg">
              Discover, review, and share your favorite movies, shows, books, and news all in one beautiful platform. Connect with a vibrant community of media enthusiasts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link
                to="/login"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold text-lg hover:shadow-2xl hover:scale-105 smooth-all inline-flex items-center justify-center gap-2"
              >
                Get Started
                <Play className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-full border-2 border-media-berry-crush text-media-berry-crush font-bold text-lg hover:bg-media-berry-crush/10 hover:shadow-lg smooth-all text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 flex-wrap animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div>
                <p className="text-3xl font-bold text-media-dark-raspberry">50K+</p>
                <p className="text-media-berry-crush">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-media-dark-raspberry">100K+</p>
                <p className="text-media-berry-crush">Reviews & Ratings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-media-dark-raspberry">15K+</p>
                <p className="text-media-berry-crush">Daily Active</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative h-96 md:h-full min-h-96">
              {/* Hero Card Stack */}
              <div className="absolute inset-0 flex items-center justify-center perspective">
                {/* Card 1 */}
                <div className="absolute w-64 h-80 rounded-2xl bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush shadow-xl transform -rotate-12 hover:rotate-0 smooth-all cursor-pointer flex items-center justify-center text-white font-bold text-2xl">
                  <div className="text-center">
                    <p className="text-4xl mb-2">🎬</p>
                    <p>Movies</p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="absolute w-64 h-80 rounded-2xl bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry shadow-xl transform rotate-0 translate-y-8 flex items-center justify-center text-white font-bold text-2xl z-10">
                  <div className="text-center">
                    <p className="text-4xl mb-2">📺</p>
                    <p>Shows</p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="absolute w-64 h-80 rounded-2xl bg-gradient-to-br from-media-powder-blush to-media-berry-crush shadow-xl transform rotate-12 translate-y-16 hover:rotate-0 smooth-all cursor-pointer flex items-center justify-center text-white font-bold text-2xl">
                  <div className="text-center">
                    <p className="text-4xl mb-2">📚</p>
                    <p>Books</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureCards />

      {/* Testimonials Section */}
      <TestimonialCarousel />

      {/* CTA Banner Section */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-r from-media-berry-crush to-media-dark-raspberry">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the Community Today
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Start exploring your favorite media, connect with friends, and share your reviews. It's free and takes just a minute to get started.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua text-media-dark-raspberry font-bold text-lg hover:shadow-2xl hover:scale-110 smooth-all animate-bounce"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
