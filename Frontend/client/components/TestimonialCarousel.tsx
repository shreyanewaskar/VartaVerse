import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Movie Enthusiast",
    quote:
      "VartaVerse has become my go-to platform for discovering new films and reading reviews from fellow enthusiasts. The personalized recommendations are spot-on!",
    avatar: "S",
    color: "from-media-pearl-aqua to-media-powder-blush",
  },
  {
    id: "2",
    name: "Marcus Chen",
    role: "Book Lover",
    quote:
      "I love how easy it is to connect with other readers and discuss books on VartaVerse. The community here is amazing and supportive.",
    avatar: "M",
    color: "from-media-powder-blush to-media-berry-crush",
  },
  {
    id: "3",
    name: "Emma Wilson",
    role: "Series Binge-Watcher",
    quote:
      "The smart feed feature is incredible! It knows exactly what kind of shows I want to watch. Best media platform out there.",
    avatar: "E",
    color: "from-media-berry-crush to-media-dark-raspberry",
  },
  {
    id: "4",
    name: "James Rodriguez",
    role: "Content Creator",
    quote:
      "As a reviewer, VartaVerse has given me the perfect platform to share my thoughts and build a community of like-minded people.",
    avatar: "J",
    color: "from-media-pearl-aqua to-media-berry-crush",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlay(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-media-dark-raspberry mb-4">
          What Users Love
        </h2>
        <p className="text-media-berry-crush text-lg">
          Join thousands of happy users on VartaVerse
        </p>
      </div>

      <div
        className="relative h-96 rounded-2xl bg-white shadow-lg overflow-hidden animate-slide-up"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Testimonial Content */}
        <div className="h-full flex items-center justify-center relative">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 flex flex-col items-center justify-center px-8 md:px-12 transition-opacity duration-500 ${
                index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg`}
              >
                {testimonial.avatar}
              </div>

              {/* Quote */}
              <blockquote className="text-center mb-6 max-w-2xl">
                <p className="text-lg md:text-xl text-media-dark-raspberry font-medium italic mb-4">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Author */}
              <div className="text-center">
                <p className="font-bold text-media-dark-raspberry text-lg">
                  {testimonial.name}
                </p>
                <p className="text-media-berry-crush/70 text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-media-pearl-aqua/80 hover:bg-media-pearl-aqua text-white smooth-all group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:scale-110 smooth-all" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-media-pearl-aqua/80 hover:bg-media-pearl-aqua text-white smooth-all group"
        >
          <ChevronRight className="w-6 h-6 group-hover:scale-110 smooth-all" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full smooth-all cursor-pointer ${
                index === currentIndex
                  ? "bg-media-berry-crush w-8"
                  : "bg-media-pearl-aqua/50 hover:bg-media-pearl-aqua"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
