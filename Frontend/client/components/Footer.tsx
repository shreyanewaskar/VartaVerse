import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua border-t border-media-pearl-aqua/30 shadow-lg">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute -top-10 left-10 h-32 w-32 rounded-full bg-media-pearl-aqua/20 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-40 w-40 rounded-full bg-media-powder-blush/20 blur-2xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl text-media-dark-raspberry">VartaVerse</span>
            </div>
            <p className="text-sm text-media-dark-raspberry/70 max-w-xs">
              Your hub for discovering, reviewing, and sharing your favorite movies, shows, books, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-media-berry-crush">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/feed"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/movies"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                Movies
              </Link>
              <Link
                to="/shows"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                Shows
              </Link>
              <Link
                to="/books"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                Books
              </Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="font-bold text-media-berry-crush">Support</h3>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-media-dark-raspberry/70 hover:text-media-berry-crush transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-media-pearl-aqua/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-media-dark-raspberry/60">
            © 2025 VartaVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-media-dark-raspberry/60 hover:text-media-berry-crush transition-colors"
              aria-label="Facebook"
            >
              <span className="text-lg">📘</span>
            </a>
            <a
              href="#"
              className="text-media-dark-raspberry/60 hover:text-media-berry-crush transition-colors"
              aria-label="Twitter"
            >
              <span className="text-lg">🐦</span>
            </a>
            <a
              href="#"
              className="text-media-dark-raspberry/60 hover:text-media-berry-crush transition-colors"
              aria-label="Instagram"
            >
              <span className="text-lg">📷</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
