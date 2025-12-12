import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Heart,
  MessageCircle,
  Star,
  Bookmark,
  UserPlus,
  Share2,
  Bell,
  Check,
  Trash2,
  Settings,
  X,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "like" | "comment" | "rating" | "saved" | "follow" | "share" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  postPreview?: {
    image?: string;
    emoji?: string;
    title: string;
  };
  grouped?: {
    count: number;
    avatars: string[];
  };
  highlighted?: boolean;
}

const notifications: Notification[] = [
  {
    id: "n1",
    type: "follow",
    title: "New Follower",
    description: "Aarav Sharma started following you",
    timestamp: "5m ago",
    read: false,
    avatar: "AS",
    highlighted: true,
  },
  {
    id: "n2",
    type: "like",
    title: "Likes on Your Post",
    description: "5 people liked your review of The Little Prince",
    timestamp: "1h ago",
    read: false,
    grouped: {
      count: 5,
      avatars: ["MV", "JS", "AN", "MK", "SR"],
    },
    postPreview: {
      emoji: "📖",
      title: "The Little Prince Review",
    },
    highlighted: true,
  },
  {
    id: "n3",
    type: "comment",
    title: "New Comment",
    description: "Juno Sparks commented on your post",
    timestamp: "2h ago",
    read: false,
    avatar: "JS",
    postPreview: {
      emoji: "🌿",
      title: "Midnight Reading Session",
    },
  },
  {
    id: "n4",
    type: "rating",
    title: "Rating Received",
    description: "Milo Kang rated your book recommendation 5 stars",
    timestamp: "3h ago",
    read: false,
    avatar: "MK",
  },
  {
    id: "n5",
    type: "saved",
    title: "Book Saved",
    description: "Sia Rahman saved your post about The Secret Garden",
    timestamp: "5h ago",
    read: true,
    avatar: "SR",
  },
  {
    id: "n6",
    type: "share",
    title: "Post Shared",
    description: "Eden Vega shared your nostalgic reads collection",
    timestamp: "1d ago",
    read: true,
    avatar: "EV",
  },
  {
    id: "n7",
    type: "system",
    title: "System Update",
    description: "New features available! Check out the updated bookshelf",
    timestamp: "2d ago",
    read: true,
  },
];

const filterTabs = ["All", "Mentions", "Likes", "Comments", "Follows", "System Updates"];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return <Heart className="h-5 w-5" />;
    case "comment":
      return <MessageCircle className="h-5 w-5" />;
    case "rating":
      return <Star className="h-5 w-5" />;
    case "saved":
      return <Bookmark className="h-5 w-5" />;
    case "follow":
      return <UserPlus className="h-5 w-5" />;
    case "share":
      return <Share2 className="h-5 w-5" />;
    case "system":
      return <Bell className="h-5 w-5" />;
  }
};

export default function Notifications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [notificationList, setNotificationList] = useState(notifications);
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredNotifications =
    activeFilter === "All"
      ? notificationList
      : notificationList.filter((notif) => {
          switch (activeFilter) {
            case "Mentions":
              return notif.type === "comment" || notif.type === "share";
            case "Likes":
              return notif.type === "like";
            case "Comments":
              return notif.type === "comment";
            case "Follows":
              return notif.type === "follow";
            case "System Updates":
              return notif.type === "system";
            default:
              return true;
          }
        });

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotificationList([]);
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-media-frozen-water via-white to-media-pearl-aqua text-media-dark-raspberry">
      {/* Floating Background Motifs */}
      <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-media-pearl-aqua/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-20 h-64 w-64 rounded-full bg-media-powder-blush/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-media-pearl-aqua/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]" />

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute top-32 left-8 text-3xl opacity-10">✨</div>
      <div className="pointer-events-none absolute top-64 right-16 text-3xl opacity-10">✈️</div>
      <div className="pointer-events-none absolute bottom-32 left-1/3 text-3xl opacity-10">💫</div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 lg:py-8">
        {/* Header / Navbar */}
        <header className="sticky top-4 z-20">
          <div className="glass flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-5 py-3 shadow-2xl shadow-media-frozen-water/60">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-media-pearl-aqua/30 hover:shadow-md hover:shadow-media-pearl-aqua/50"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-media-berry-crush">Notifications</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-media-powder-blush px-2.5 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <button className="rounded-full bg-white/70 p-2 text-media-dark-raspberry transition hover:bg-media-pearl-aqua/30 hover:shadow-md">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Quick Actions Bar */}
        {notificationList.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/50 bg-white/40 p-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-media-powder-blush/40 transition hover:scale-105"
              >
                <Check className="h-4 w-4" />
                Mark All Read
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-4 py-2 text-sm font-semibold text-media-dark-raspberry shadow-md transition hover:bg-media-pearl-aqua/20"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-full border-2 border-media-pearl-aqua bg-white/70 px-4 py-2 text-sm font-semibold text-media-dark-raspberry shadow-md transition hover:bg-media-pearl-aqua/20">
              <Settings className="h-4 w-4" />
              Manage Preferences
            </button>
          </div>
        )}

        {/* Notification Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                activeFilter === tab
                  ? "bg-white/70 text-media-dark-raspberry shadow-lg shadow-media-pearl-aqua/40"
                  : "bg-white/40 text-media-dark-raspberry/70 hover:bg-white/60 hover:shadow-md hover:shadow-media-pearl-aqua/30"
              )}
            >
              {tab}
              {activeFilter === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-media-pearl-aqua to-media-powder-blush" />
              )}
            </button>
          ))}
        </div>

        {/* Notification List Container */}
        {filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="glass flex flex-col items-center justify-center rounded-3xl border border-white/50 bg-white/40 p-16 shadow-lg">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-5xl shadow-inner">
              🔔
            </div>
            <h2 className="mb-2 text-2xl font-bold text-media-berry-crush">You're all caught up!</h2>
            <p className="mb-6 text-center text-media-dark-raspberry/70">
              No new notifications right now.
            </p>
            <button
              onClick={() => navigate("/feed")}
              className="rounded-full bg-gradient-to-r from-media-powder-blush to-media-pearl-aqua px-6 py-3 text-sm font-bold text-white shadow-lg shadow-media-powder-blush/40 transition hover:scale-105"
            >
              Explore Posts
            </button>
          </div>
        ) : (
          <div className="glass space-y-3 rounded-3xl border border-white/50 bg-white/40 p-6 shadow-lg">
            {/* Highlighted Notifications First */}
            {filteredNotifications
              .filter((notif) => notif.highlighted)
              .map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onMarkAsRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                  onHover={() => setHoveredNotification(notif.id)}
                  onHoverLeave={() => setHoveredNotification(null)}
                  isHovered={hoveredNotification === notif.id}
                  onToggleGroup={() => toggleGroup(notif.id)}
                  isExpanded={expandedGroups.has(notif.id)}
                />
              ))}

            {/* Regular Notifications */}
            {filteredNotifications
              .filter((notif) => !notif.highlighted)
              .map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onMarkAsRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                  onHover={() => setHoveredNotification(notif.id)}
                  onHoverLeave={() => setHoveredNotification(null)}
                  isHovered={hoveredNotification === notif.id}
                  onToggleGroup={() => toggleGroup(notif.id)}
                  isExpanded={expandedGroups.has(notif.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  onHover: () => void;
  onHoverLeave: () => void;
  isHovered: boolean;
  onToggleGroup: () => void;
  isExpanded: boolean;
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onHover,
  onHoverLeave,
  isHovered,
  onToggleGroup,
  isExpanded,
}: NotificationCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onHoverLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/80 bg-media-frozen-water/60 p-4 shadow-md transition-all duration-300",
        notification.highlighted &&
          "bg-gradient-to-r from-media-powder-blush/20 via-white to-media-frozen-water/60 border-media-powder-blush/40 shadow-lg",
        !notification.read && "ring-2 ring-media-pearl-aqua/50",
        isHovered && "translate-y-[-2px] shadow-xl shadow-media-pearl-aqua/50"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Left Side - Icon */}
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-media-powder-blush/40 to-media-powder-blush/60 text-media-dark-raspberry shadow-lg shadow-media-powder-blush/30 transition-all",
              notification.highlighted && "animate-pulse-glow"
            )}
          >
            {getNotificationIcon(notification.type)}
          </div>
          {!notification.read && (
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-media-pearl-aqua ring-2 ring-white shadow-lg" />
          )}
        </div>

        {/* Center - Notification Text */}
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-media-berry-crush">{notification.title}</h3>
              <p className="text-sm text-media-dark-raspberry/80">{notification.description}</p>
              {notification.grouped && (
                <button
                  onClick={onToggleGroup}
                  className="mt-2 flex items-center gap-2 text-xs font-semibold text-media-pearl-aqua hover:text-media-berry-crush transition"
                >
                  {isExpanded ? "Show less" : `View all ${notification.grouped.count} people`}
                </button>
              )}
              {notification.grouped && isExpanded && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {notification.grouped.avatars.map((avatar, idx) => (
                    <div
                      key={idx}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-media-pearl-aqua to-media-powder-blush text-xs font-bold text-white shadow-md"
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs italic text-media-powder-blush">{notification.timestamp}</p>
            </div>

            {/* Right Side - Quick Actions */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="rounded-full p-2 text-media-dark-raspberry/40 transition hover:bg-white/60 hover:text-media-dark-raspberry"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showActions && (
                <div className="absolute right-0 top-10 z-10 flex flex-col gap-1 rounded-xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
                  {!notification.read && (
                    <button
                      onClick={() => {
                        onMarkAsRead();
                        setShowActions(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-media-dark-raspberry transition hover:bg-media-pearl-aqua/20"
                    >
                      <Check className="h-3 w-3" />
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onDelete();
                      setShowActions(false);
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-media-dark-raspberry transition hover:bg-media-powder-blush/20"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post Preview on Hover */}
          {isHovered && notification.postPreview && (
            <div className="mt-3 animate-fade-in rounded-xl border border-media-pearl-aqua/40 bg-white/90 p-3 shadow-lg">
              <div className="flex items-center gap-3">
                {notification.postPreview.emoji && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-media-pearl-aqua/40 to-media-powder-blush/40 text-2xl shadow-inner">
                    {notification.postPreview.emoji}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-media-dark-raspberry">
                    {notification.postPreview.title}
                  </p>
                  <button 
                    onClick={() => navigate("/media/m1")}
                    className="mt-1 flex items-center gap-1 text-xs font-semibold text-media-pearl-aqua hover:text-media-berry-crush transition"
                  >
                    <Eye className="h-3 w-3" />
                    View post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

