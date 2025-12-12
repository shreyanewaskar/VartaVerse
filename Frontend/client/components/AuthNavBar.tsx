import { Link } from "react-router-dom";

export default function AuthNavBar() {
  return (
    <nav className="w-full glass border-b border-media-pearl-aqua/30 shadow-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-media-berry-crush to-media-dark-raspberry flex items-center justify-center transform group-hover:scale-110 smooth-all shadow-lg">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="font-bold text-media-dark-raspberry group-hover:text-media-berry-crush smooth-all">
            VartaVerse
          </span>
        </Link>

        {/* Empty space for alignment */}
        <div />
      </div>
    </nav>
  );
}
