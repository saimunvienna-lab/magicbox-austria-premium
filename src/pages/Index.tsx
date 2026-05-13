import { lazy, Suspense } from "react";
import { I18nProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import AnnouncementBar from "@/components/AnnouncementBar";
import SEO from "@/components/SEO";

// Lazy loaded sections for better mobile performance
const Problem = lazy(() => import("@/components/sections/Problem"));
const Solution = lazy(() => import("@/components/sections/Solution"));
const Technology = lazy(() => import("@/components/sections/Technology"));
const QRWorkflow = lazy(() => import("@/components/sections/QRWorkflow"));
const Comparison = lazy(() => import("@/components/sections/Comparison"));
const FAQ = lazy(() => import("@/components/sections/FAQ"));
const Gallery = lazy(() => import("@/components/sections/Gallery"));
const Austria = lazy(() => import("@/components/sections/Austria"));
const Blog = lazy(() => import("@/components/sections/Blog"));
const Testimonials = lazy(() => import("@/components/sections/Testimonials"));
const Order = lazy(() => import("@/components/sections/Order"));
const Contact = lazy(() => import("@/components/sections/Contact"));
const Dealer = lazy(() => import("@/components/sections/Dealer"));

// Flag — false = hidden | true = visible
const SHOW_GALLERY = false;
const SHOW_TESTIMONIALS = false;

const Index = () => (
  <I18nProvider>
    <main className="bg-background overflow-x-clip">
      <SEO />
      <AnnouncementBar />
      <Navbar />

      {/* Hero loads immediately */}
      <Hero />

      {/* All other sections load lazily */}
      <Suspense fallback={<div className="h-32" />}>
        <Problem />
        <Technology />
        <Solution />
        <Comparison />
        <Order />
        <QRWorkflow />
        {SHOW_GALLERY && <Gallery />}
        <Austria />
        <Blog />
        <FAQ />
        {SHOW_TESTIMONIALS && <Testimonials />}
        <Contact />
        <Dealer />
      </Suspense>

      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </main>
  </I18nProvider>
);

export default Index;
