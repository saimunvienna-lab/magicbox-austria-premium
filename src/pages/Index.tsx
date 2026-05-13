import { lazy, Suspense } from "react";
import { I18nProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import AnnouncementBar from "@/components/AnnouncementBar";

// Lazy loaded sections for better mobile performance
const Problem = lazy(() => import("@/components/sections/Problem"));
const Solution = lazy(() => import("@/components/sections/Solution"));
const Technology = lazy(() => import("@/components/sections/Technology"));
const QRWorkflow = lazy(() => import("@/components/sections/QRWorkflow"));
const MagicBoxSystem = lazy(() => import("@/components/sections/MagicBoxSystem"));
const Gallery = lazy(() => import("@/components/sections/Gallery"));
const Austria = lazy(() => import("@/components/sections/Austria"));
const Benefits = lazy(() => import("@/components/sections/Benefits"));
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
      <AnnouncementBar />
      <Navbar />

      {/* Hero loads immediately */}
      <Hero />

      {/* All other sections load lazily */}
      <Suspense fallback={<div className="h-32" />}>
        <Problem />
        <Technology />
        <Solution />
        <Order />
        <QRWorkflow />
        <MagicBoxSystem />
        {SHOW_GALLERY && <Gallery />}
        <Austria />
        <Benefits />
        <Blog />
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
