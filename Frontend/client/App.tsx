import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Movies from "./pages/Movies";
import Shows from "./pages/Shows";
import Books from "./pages/Books";
import MediaDetail from "./pages/MediaDetail";
import MovieDetail from "./pages/MovieDetail";
import ShowDetail from "./pages/ShowDetail";
import BookDetail from "./pages/BookDetail";
import NostalgicBooks from "./pages/NostalgicBooks";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Bookmarks from "./pages/Bookmarks";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MediaManagement from "./pages/MediaManagement";
import PostsManagement from "./pages/PostsManagement";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col h-screen bg-background text-foreground">
    <NavBar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/feed" element={<ProtectedRoute><AppLayout><Index /></AppLayout></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><AppLayout><Explore /></AppLayout></ProtectedRoute>} />
              <Route path="/movies" element={<ProtectedRoute><AppLayout><Movies /></AppLayout></ProtectedRoute>} />
              <Route path="/shows" element={<ProtectedRoute><AppLayout><Shows /></AppLayout></ProtectedRoute>} />
              <Route path="/books" element={<ProtectedRoute><AppLayout><Books /></AppLayout></ProtectedRoute>} />
              <Route path="/nostalgic-books" element={<ProtectedRoute><NostalgicBooks /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
              <Route path="/media/:id" element={<ProtectedRoute><AppLayout><MediaDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/movie/:id" element={<ProtectedRoute><AppLayout><MovieDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/show/:id" element={<ProtectedRoute><AppLayout><ShowDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><AppLayout><BookDetail /></AppLayout></ProtectedRoute>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/media" element={<ProtectedRoute><MediaManagement /></ProtectedRoute>} />
              <Route path="/admin/posts" element={<ProtectedRoute><PostsManagement /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
