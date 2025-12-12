import { Zap, Users, Star, TrendingUp } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: Feature[] = [
  {
    id: "1",
    title: "Unified Media Hub",
    description:
      "Discover trending news, reviews, and social posts about movies, shows, books, and more all in one place.",
    icon: <TrendingUp className="w-8 h-8" />,
    color: "from-media-pearl-aqua to-media-powder-blush",
  },
  {
    id: "2",
    title: "AI-Powered Smart Feed",
    description:
      "Get personalized content recommendations based on your interests, viewing history, and ratings.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-media-powder-blush to-media-berry-crush",
  },
  {
    id: "3",
    title: "Interactive Reviews",
    description:
      "Rate, comment, and discuss your favorite movies, shows, and books with a vibrant community.",
    icon: <Star className="w-8 h-8" />,
    color: "from-media-berry-crush to-media-dark-raspberry",
  },
  {
    id: "4",
    title: "Follow & Connect",
    description:
      "Discover creators and friends with similar tastes and build your personalized media community.",
    icon: <Users className="w-8 h-8" />,
    color: "from-media-pearl-aqua to-media-berry-crush",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-media-dark-raspberry mb-4">
          Why Choose VartaVerse?
        </h2>
        <p className="text-media-berry-crush text-lg max-w-2xl mx-auto">
          Everything you need to discover, review, and share your favorite media in one beautiful platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-2 smooth-all animate-slide-up group cursor-pointer"
          >
            {/* Icon Container */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 smooth-all shadow-md`}>
              <div className="text-white">{feature.icon}</div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-media-dark-raspberry mb-2 group-hover:text-media-berry-crush smooth-all">
              {feature.title}
            </h3>
            <p className="text-media-dark-raspberry/70 text-sm leading-relaxed">
              {feature.description}
            </p>

            {/* Bottom Accent */}
            <div className={`h-1 w-0 bg-gradient-to-r ${feature.color} rounded-full mt-4 group-hover:w-full smooth-all`} />
          </div>
        ))}
      </div>
    </section>
  );
}
