import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Legal from "./pages/Legal.tsx";
import BlogIndex from "./pages/BlogIndex.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import NotFound from "./pages/NotFound.tsx";
import Order from "./components/sections/Order.tsx";
import Admin from "./pages/Admin.tsx";
import AdminBlog from "./pages/AdminBlog.tsx";  // ← NEW: Import AdminBlog
import Contact from "./pages/Contact.tsx";
import { I18nProvider } from "@/lib/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/impressum" element={<Legal slug="impressum" />} />
          <Route path="/datenschutz" element={<Legal slug="datenschutz" />} />
          <Route path="/agb" element={<Legal slug="agb" />} />
          <Route path="/widerruf" element={<Legal slug="widerruf" />} />
          <Route path="/cookies" element={<Legal slug="cookies" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/blog" element={<AdminBlog />} />  {/* ← NEW: Admin Blog route */}
          <Route path="/kontakt" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
