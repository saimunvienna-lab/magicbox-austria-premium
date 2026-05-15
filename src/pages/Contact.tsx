import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { I18nProvider } from "@/lib/i18n";
import Footer from "@/components/Footer";

function ContactInner() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to Supabase
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;

      // Send WhatsApp notification
      const whatsappMessage = `🔔 Neue Kontaktanfrage\n\nName: ${formData.name}\nEmail: ${formData.email}\nTelefon: ${formData.phone}\nFirma: ${formData.company}\n\nNachricht:\n${formData.message}`;
      const whatsappUrl = `https://wa.me/436769617723?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: 'Nachricht gesendet!',
        description: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Fehler',
        description: 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <nav className="text-sm text-blue-200">
          <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <a href="/" itemProp="item" className="hover:text-white transition-colors">
                <span itemProp="name">Home</span>
              </a>
              <meta itemProp="position" content="1" />
            </li>
            <li>/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-white font-medium">
                Kontakt
              </span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>
      </div>

      <main className="container mx-auto px-4 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kontakt aufnehmen
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Wir sind für Sie da – per Telefon, E-Mail oder WhatsApp. Antwort innerhalb von 24 Stunden garantiert.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Address */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Adresse
                  </h3>
                  <p className="text-blue-100">
                    SAIDA MagicBox<br />
                    Wien, Österreich
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Telefon & WhatsApp
                  </h3>
                  <a href="tel:+436769617723" className="text-blue-200 hover:text-white transition-colors block">
                    +43 676 9617723
                  </a>
                  <a 
                    href="https://wa.me/436769617723" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 transition-colors mt-2 inline-block"
                  >
                    WhatsApp öffnen →
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    E-Mail
                  </h3>
                  <a href="mailto:office@saidamagicbox.com" className="text-blue-200 hover:text-white transition-colors">
                    office@saidamagicbox.com
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Geschäftszeiten
                  </h3>
                  <p className="text-blue-100">
                    Montag - Freitag: 9:00 - 18:00<br />
                    Samstag - Sonntag: Geschlossen
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">
                Standort
              </h3>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42552.742805054966!2d16.344063699999998!3d48.2081743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d079e5136ca9f%3A0xfdc2e58a51a25b46!2sVienna%2C%20Austria!5e0!3m2!1sen!2sat!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SAIDA MagicBox Location"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Nachricht senden
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ihr Name"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  E-Mail *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ihre@email.com"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Telefon
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+43 ..."
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                  Firma
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ihr Handyshop (optional)"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Nachricht *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Wie können wir Ihnen helfen?"
                  rows={6}
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  'Wird gesendet...'
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Nachricht senden
                  </>
                )}
              </Button>

              <p className="text-sm text-slate-500 text-center">
                Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Schema.org ContactPoint */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "SAIDA MagicBox",
          "description": "Premium B2B-Lagersystem für Panzerglas – Handyshops in Österreich",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Wien",
            "addressCountry": "AT"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+43-676-9617723",
            "contactType": "customer service",
            "areaServed": "AT",
            "availableLanguage": ["de", "en"]
          },
          "email": "office@saidamagicbox.com",
          "url": "https://saidamagicbox.com"
        })}
      </script>
    </div>
  );
}

export default function Contact() {
  return (
    <I18nProvider>
      <ContactInner />
      <Footer />
    </I18nProvider>
  );
}
