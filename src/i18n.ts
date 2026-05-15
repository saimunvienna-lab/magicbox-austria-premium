import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        solution: 'Solution',
        technology: 'Technology',
        order: 'Order',
        blog: 'Blog',
        contact: 'Contact',
      },
      contact: {
        title: 'Get in Touch',
        subtitle: 'We are here for you — by phone, email, or WhatsApp. Response within 24 hours guaranteed.',
        address: 'Address',
        phone: 'Phone & WhatsApp',
        email: 'Email',
        hours: 'Business Hours',
        weekdays: 'Monday - Friday',
        weekend: 'Saturday - Sunday',
        closed: 'Closed',
        location: 'Location',
        formTitle: 'Send Message',
        name: 'Name',
        namePlaceholder: 'Your name',
        emailLabel: 'Email',
        phoneLabel: 'Phone',
        company: 'Company',
        companyPlaceholder: 'Your mobile shop (optional)',
        messageLabel: 'Message',
        messagePlaceholder: 'How can we help you?',
        send: 'Send Message',
        sending: 'Sending...',
        privacy: 'Your data will be treated confidentially and not shared with third parties.',
        success: 'Message sent!',
        successDesc: 'We will get back to you within 24 hours.',
        error: 'Error',
        errorDesc: 'Please try again or contact us directly.',
      },
      blog: {
        title: 'Insights & News',
        subtitle: 'B2B insights on inventory, screen protector technology, and European mobile retail.',
        readMore: 'Read article',
        backToBlog: 'Back to blog',
        relatedPosts: 'Continue reading',
        noPosts: 'No posts available.',
        notFound: 'Article not found',
        notFoundDesc: 'This blog post does not exist or has been removed.',
      },
    },
  },
  de: {
    translation: {
      nav: {
        home: 'Home',
        solution: 'Lösung',
        technology: 'Technologie',
        order: 'Bestellung',
        blog: 'Blog',
        contact: 'Kontakt',
      },
      contact: {
        title: 'Kontakt aufnehmen',
        subtitle: 'Wir sind für Sie da – per Telefon, E-Mail oder WhatsApp. Antwort innerhalb von 24 Stunden garantiert.',
        address: 'Adresse',
        phone: 'Telefon & WhatsApp',
        email: 'E-Mail',
        hours: 'Geschäftszeiten',
        weekdays: 'Montag - Freitag',
        weekend: 'Samstag - Sonntag',
        closed: 'Geschlossen',
        location: 'Standort',
        formTitle: 'Nachricht senden',
        name: 'Name',
        namePlaceholder: 'Ihr Name',
        emailLabel: 'E-Mail',
        phoneLabel: 'Telefon',
        company: 'Firma',
        companyPlaceholder: 'Ihr Handyshop (optional)',
        messageLabel: 'Nachricht',
        messagePlaceholder: 'Wie können wir Ihnen helfen?',
        send: 'Nachricht senden',
        sending: 'Wird gesendet...',
        privacy: 'Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.',
        success: 'Nachricht gesendet!',
        successDesc: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
        error: 'Fehler',
        errorDesc: 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
      },
      blog: {
        title: 'Insights & News',
        subtitle: 'B2B-Insights zu Lager, Schutzglas-Technologie und europäischem Mobilfunk-Handel.',
        readMore: 'Artikel lesen',
        backToBlog: 'Zurück zum Blog',
        relatedPosts: 'Weiterlesen',
        noPosts: 'Keine Beiträge vorhanden.',
        notFound: 'Artikel nicht gefunden',
        notFoundDesc: 'Dieser Blogartikel existiert nicht oder wurde entfernt.',
      },
    },
  },
};

// Read same storage key used by the custom I18nProvider so both stay in sync.
const savedLang =
  (typeof window !== 'undefined' && localStorage.getItem('saida_lang')) || 'de';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
