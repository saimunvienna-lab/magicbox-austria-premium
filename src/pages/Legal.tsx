import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

type LegalKey = "impressum" | "datenschutz" | "agb" | "widerruf" | "cookies";

const content: Record<LegalKey, { en: { title: string; body: string[] }; de: { title: string; body: string[] } }> = {
  impressum: {
    en: { title: "Imprint", body: [
      "Information according to § 5 ECG (Austrian E-Commerce Act) and § 25 MedienG.",
      "SAIDA MagicBox\nVienna, Austria",
      "Phone: +43 676 9617723\nEmail: office@saidamagicbox.com",
      "Managing Director: SAIDA MagicBox Team\nVAT-ID: To be added\nCommercial Register: To be added",
      "Online dispute resolution platform of the European Commission: https://ec.europa.eu/consumers/odr",
    ]},
    de: { title: "Impressum", body: [
      "Angaben gemäß § 5 ECG und § 25 MedienG.",
      "SAIDA MagicBox\nWien, Österreich",
      "Telefon: +43 676 9617723\nE-Mail: office@saidamagicbox.com",
      "Geschäftsführung: SAIDA MagicBox Team\nUID-Nr.: wird ergänzt\nFirmenbuchnummer: wird ergänzt",
      "Plattform der EU-Kommission zur Online-Streitbeilegung: https://ec.europa.eu/consumers/odr",
    ]},
  },
  datenschutz: {
    en: { title: "Privacy Policy", body: [
      "We process your personal data in accordance with the EU General Data Protection Regulation (GDPR) and the Austrian Data Protection Act.",
      "Data controller: SAIDA MagicBox, Vienna, Austria. Email: office@saidamagicbox.com.",
      "Data collected: contact form details (name, email, company, message), dealer inquiries, server logs, cookie preferences.",
      "Legal basis: Art. 6(1)(a) consent, (b) contract initiation, (f) legitimate interest in operating and securing this website.",
      "Recipients: hosting provider within the EU, email provider, no transfers to third countries without appropriate safeguards.",
      "Retention: data is stored only as long as necessary for the stated purpose or required by law.",
      "Your rights: access, rectification, erasure, restriction, data portability, objection. Supervisory authority: Austrian DSB (dsb.gv.at).",
    ]},
    de: { title: "Datenschutzerklärung", body: [
      "Wir verarbeiten Ihre personenbezogenen Daten gemäß DSGVO und österreichischem Datenschutzgesetz.",
      "Verantwortlicher: SAIDA MagicBox, Wien, Österreich. E-Mail: office@saidamagicbox.com.",
      "Erhobene Daten: Kontaktformular (Name, E-Mail, Firma, Nachricht), Händleranfragen, Server-Logs, Cookie-Einstellungen.",
      "Rechtsgrundlagen: Art. 6 Abs. 1 lit. a Einwilligung, lit. b Vertragsanbahnung, lit. f berechtigtes Interesse am sicheren Betrieb der Website.",
      "Empfänger: Hosting-Anbieter in der EU, E-Mail-Provider; keine Übermittlung in Drittstaaten ohne geeignete Garantien.",
      "Speicherdauer: nur so lange wie für den Zweck erforderlich oder gesetzlich vorgeschrieben.",
      "Ihre Rechte: Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch. Aufsichtsbehörde: Österreichische DSB (dsb.gv.at).",
    ]},
  },
  agb: {
    en: { title: "Terms & Conditions (AGB)", body: [
      "These General Terms and Conditions apply to all B2B orders placed with SAIDA MagicBox.",
      "Offers are non-binding. A contract is concluded by our written order confirmation.",
      "Prices are net, exclusive of VAT and shipping unless stated otherwise.",
      "Payment terms, delivery times and warranty are set out in the individual offer or order confirmation.",
      "Place of performance and jurisdiction is Vienna, Austria. Austrian law applies, excluding the UN Sales Convention.",
    ]},
    de: { title: "Allgemeine Geschäftsbedingungen (AGB)", body: [
      "Diese AGB gelten für alle B2B-Bestellungen bei SAIDA MagicBox.",
      "Angebote sind freibleibend. Ein Vertrag kommt durch unsere schriftliche Auftragsbestätigung zustande.",
      "Preise verstehen sich netto, zzgl. USt. und Versand, sofern nicht anders angegeben.",
      "Zahlungsbedingungen, Lieferzeiten und Gewährleistung ergeben sich aus dem jeweiligen Angebot bzw. der Auftragsbestätigung.",
      "Erfüllungsort und Gerichtsstand ist Wien, Österreich. Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts.",
    ]},
  },
  widerruf: {
    en: { title: "Right of Withdrawal", body: [
      "Information on the right of withdrawal for consumers within the meaning of the Austrian Consumer Protection Act (KSchG) and the FAGG.",
      "You have the right to withdraw from a distance contract within 14 days without giving any reason.",
      "The withdrawal period expires 14 days from the day on which you, or a third party indicated by you, takes physical possession of the goods.",
      "To exercise the right of withdrawal, please inform us by clear declaration (e.g. email) at office@saidamagicbox.com.",
      "B2B orders between businesses are excluded from the statutory right of withdrawal.",
    ]},
    de: { title: "Widerrufsrecht", body: [
      "Informationen zum Widerrufsrecht für Verbraucher iSd KSchG und FAGG.",
      "Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen vom Fernabsatzvertrag zurückzutreten.",
      "Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.",
      "Zur Ausübung Ihres Widerrufsrechts informieren Sie uns mittels eindeutiger Erklärung (z. B. E-Mail) an office@saidamagicbox.com.",
      "B2B-Bestellungen zwischen Unternehmern sind vom gesetzlichen Widerrufsrecht ausgenommen.",
    ]},
  },
  cookies: {
    en: { title: "Cookie Policy", body: [
      "This website uses cookies to provide essential functionality, measure traffic and (with your consent) personalize content.",
      "Essential cookies are required for the site to function and cannot be disabled.",
      "Analytics cookies help us understand usage patterns. Marketing cookies allow us to deliver relevant content.",
      "You can change your preferences at any time by clearing your browser storage and reloading the page.",
    ]},
    de: { title: "Cookie-Richtlinie", body: [
      "Diese Website verwendet Cookies für essenzielle Funktionen, Reichweitenmessung und – mit Ihrer Einwilligung – personalisierte Inhalte.",
      "Essenzielle Cookies sind für den Betrieb erforderlich und können nicht deaktiviert werden.",
      "Analyse-Cookies helfen uns, die Nutzung zu verstehen. Marketing-Cookies ermöglichen relevante Inhalte.",
      "Sie können Ihre Einstellungen jederzeit ändern, indem Sie den Browser-Speicher leeren und die Seite neu laden.",
    ]},
  },
};

const Inner = ({ slug }: { slug: LegalKey }) => {
  const { lang, t } = useI18n();
  const data = content[slug][lang === "de" ? "de" : "en"];
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-32 pb-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="size-4" /> {t("back_home")}
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{data.title}</h1>
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed">
          {data.body.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
        </div>
        <p className="mt-12 text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString(lang === "de" ? "de-AT" : "en-GB")}</p>
      </article>
      <Footer />
    </main>
  );
};

const Legal = ({ slug }: { slug: LegalKey }) => (
  <I18nProvider><Inner slug={slug} /></I18nProvider>
);
export default Legal;
