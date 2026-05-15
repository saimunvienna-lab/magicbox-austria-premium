import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Legal from "./pages/Legal.tsx";
import NotFound from "./pages/NotFound.tsx";
import Order from "./components/sections/Order.tsx";
import Contact from "./pages/Contact.tsx";
import { I18nProvider } from "@/lib/i18n";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const BlogIndex = lazy(() => import("./pages/BlogIndex.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminBlog = lazy(() => import("./pages/AdminBlog.tsx"));
const AdminContacts = lazy(() => import("./pages/AdminContacts.tsx"));
const AdminOrders = lazy(() => import("./pages/AdminOrders.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));

const RouteFallback = () => (
  <div className="min-h-screen grid place-items-center">
    <div className="size-8 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/impressum" element={<Legal slug="impressum" />} />
          <Route path="/datenschutz" element={<Legal slug="datenschutz" />} />
          <Route path="/agb" element={<Legal slug="agb" />} />
          <Route path="/widerruf" element={<Legal slug="widerruf" />} />
          <Route path="/cookies" element={<Legal slug="cookies" />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
          <Route path="/admin/contacts" element={<ProtectedRoute><AdminContacts /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
