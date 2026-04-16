import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import React, { Suspense } from "react";

// Lazy Load Public Pages
const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Give = React.lazy(() => import("./pages/Give"));
const Sermons = React.lazy(() => import("./pages/Sermons"));
const SermonsVideo = React.lazy(() => import("./pages/SermonsVideo"));
const SermonsAudio = React.lazy(() => import("./pages/SermonsAudio"));
const Events = React.lazy(() => import("./pages/Events"));
const Ministries = React.lazy(() => import("./pages/Ministries"));
const Prayer = React.lazy(() => import("./pages/Prayer"));
const Contact = React.lazy(() => import("./pages/Contact"));

// Lazy Load Admin
const AdminLayout = React.lazy(() => import("./admin/AdminLayout"));

const queryClient = new QueryClient();

// High-end Global Loading State
const PageLoader = () => (
  <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-church-gold/20 border-t-church-red rounded-full animate-spin" />
      <p className="text-church-red font-bold text-sm uppercase tracking-widest animate-pulse">Loading Sanctuary...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="church-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/sermons/video" element={<SermonsVideo />} />
              <Route path="/sermons/audio" element={<SermonsAudio />} />
              <Route path="/events" element={<Events />} />
              <Route path="/ministries" element={<Ministries />} />
              <Route path="/prayer" element={<Prayer />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/give" element={<Give />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
