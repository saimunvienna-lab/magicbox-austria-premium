import { I18nProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Technology from "@/components/sections/Technology";
import QRWorkflow from "@/components/sections/QRWorkflow";
import MagicBoxSystem from "@/components/sections/MagicBoxSystem";
import Gallery from "@/components/sections/Gallery";
import Austria from "@/components/sections/Austria";
import Benefits from "@/components/sections/Benefits";
import Blog from "@/components/sections/Blog";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import Dealer from "@/components/sections/Dealer";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import Order from "@/components/sections/Order";

// ✅ Flag — false = hidden | true = visible
const SHOW_GALLERY = false
const SHOW_TESTIMONIALS = false

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "SAIDA MagicBox",
  description: "Premium B2B tempered glass inventory system for mobile phone shops. 2000+ smartphone models, 48+ brands, QR-code finder.",
  brand: { "@type": "Brand", name: "SAIDA" },
  countryOfOrigin: "AT",
  category: "B2B Retail Inventory System",
  manufacturer: { "@type": "Organization", name: "SAIDA MagicBox", address: { "@type": "PostalAddress", addressLocality: "Innsbruck", addressCountry: "AT" } },
};

const Index = () => (
  <I18nProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <main className="bg-background overflow-x-clip">
      <Navbar />
      <h1 className="sr-only">SAIDA MagicBox — Premium Tempered Glass Inventory System</h1>
      <Hero />
      <Problem />
      <Solution />
      <Technology />
      <QRWorkflow />
      <MagicBoxSystem />
      {SHOW_GALLERY && <Gallery />}
      <Austria />
      <Benefits />
      <Blog />
      {SHOW_TESTIMONIALS && <Testimonials />}
      <Order />
      <Contact />
      <Dealer />
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </main>
  </I18nProvider>
);

export default Index;
