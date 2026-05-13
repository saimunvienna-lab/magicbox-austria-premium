import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    q: "Was genau ist die SAIDA MagicBox?",
    a: "Die SAIDA MagicBox ist ein intelligentes B2B-Lagersystem für Handyshops in Österreich, Deutschland und der Schweiz. Statt hunderte einzelne Panzerglas-Verpackungen zu lagern, enthält eine MagicBox passgenaue Schutzfolien für über 2.000 Smartphone-Modelle von 48+ Marken — übersichtlich in 60+ beschrifteten Schubladen organisiert. Per QR-Code findet jeder Mitarbeiter in 15 Sekunden das richtige Panzerglas.",
  },
  {
    q: "Für wen ist die MagicBox geeignet?",
    a: "MagicBox ist speziell für unabhängige Handyshops, Mobilfunkhändler und Reparaturwerkstätten in Österreich, Deutschland und der Schweiz entwickelt. Besonders sinnvoll ist sie für Shops, die viele verschiedene Smartphone-Modelle bedienen, wenig Lagerfläche haben und ihren Kundenservice beschleunigen möchten.",
  },
  {
    q: "Welche Smartphone-Marken und Modelle sind abgedeckt?",
    a: "Aktuell unterstützt MagicBox 2.000+ Modelle von über 48 Marken — darunter Apple iPhone (alle Generationen), Samsung Galaxy (S-, A-, Note-Serie), Xiaomi, Huawei, OPPO, Vivo, OnePlus, Nokia, Motorola, Realme, Honor und viele mehr. Die Modell-Datenbank wird monatlich um neue Smartphones erweitert — auch das Samsung Galaxy S26 Ultra und iPhone 17 Pro Max sind bereits enthalten.",
  },
  {
    q: "Wie funktioniert die Bestellung als Händler?",
    a: "Sie wählen Ihren Kundentyp (Österreich mit MwSt. oder EU-Ausland ohne MwSt. via Reverse Charge), tragen Ihre Firmendaten und gegebenenfalls UID-Nummer ein, und wir schicken Ihnen unverbindlich ein Angebot. Bei Bestellung liefern wir die MagicBox binnen 48 Stunden in ganz Österreich, binnen 3–5 Werktagen in der EU.",
  },
  {
    q: "Was kostet eine MagicBox und was ist enthalten?",
    a: "Die MagicBox startet ab €540 (netto, B2B-Preis). Jede Box enthält 305 Stück Panzerglas in 60+ Varianten: ~240 Stück Standard 0,33mm für flache Displays und ~65 Stück Ultra-Dünn 0,25mm für Curved-Displays und Smartphones mit sensiblem In-Display-Fingerprint-Sensor. Bei einem Verkaufspreis von €10–20 pro Stück liegt der mögliche Umsatz pro Box bei €3.050–4.850 — das entspricht einer Marge von 500–800%.",
  },
  {
    q: "Wodurch unterscheidet sich MagicBox von einem Folien-Schneideplotter?",
    a: "Schneideplotter (z.B. Mietubl, Devia) schneiden weiche TPU- oder Hydrogel-Folien zu — KEINE Panzergläser. Diese Folien sind weniger kratzfest, fühlen sich nicht wie Glas an und sind bei vielen Kunden unbeliebt. MagicBox liefert echtes 9H-Panzerglas in passgenauer Größe, ohne Strom, ohne Wartung, ohne Abo. Der Vergleich oben auf dieser Seite zeigt alle Unterschiede im Detail.",
  },
  {
    q: "Was bedeutet 'In Österreich entwickelt' konkret?",
    a: "SAIDA MagicBox wurde in Wien konzipiert, mit Input von Handyshop-Besitzern aus ganz Österreich. Die Produktion erfolgt nach europäischen Qualitätsstandards. Versand und B2B-Service laufen über Wien — Sie haben einen Ansprechpartner in Ihrer Zeitzone, in deutscher Sprache, mit österreichischer UID-Nummer für saubere B2B-Abrechnung.",
  },
  {
    q: "Was ist mit Smartphones mit In-Display-Fingerprint-Sensor?",
    a: "Die meisten Smartphones mit Fingerabdruckscanner unter dem Display funktionieren problemlos mit Standard-0,33mm Panzerglas. Einige neuere Modelle reagieren jedoch sensibel und benötigen Ultra-Dünn-0,25mm-Glas, damit der Sensor korrekt liest. Genau dafür enthält jede MagicBox bereits 0,25mm Ultra-Dünn-Gläser — Sie sind für jeden Kundenfall gerüstet.",
  },
  {
    q: "Wie funktionieren Nachbestellungen einzelner Modelle?",
    a: "Wenn eine Schublade leer wird (z.B. K42 für iPhone 17 Pro), können Sie über unseren Händler-Bereich gezielt einzelne Modelle nachbestellen — keine ganze Box nötig. Mindestbestellmenge ist niedrig gehalten, Lieferung erfolgt binnen 48 Stunden in Österreich. So bleibt Ihr Bestand immer aktuell, ohne totes Kapital.",
  },
  {
    q: "Gibt es Garantie und Rückgaberecht für Händler?",
    a: "Ja. Auf jede MagicBox gewähren wir 12 Monate B2B-Gewährleistung auf Material- und Verarbeitungsfehler. Defekte oder beschädigte Panzergläser werden anstandslos ersetzt. Da es sich um B2B-Handel handelt, gilt kein Konsumenten-Widerrufsrecht — wir prüfen Reklamationen aber individuell und kulant.",
  },
];

const FAQ = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section id="faq" className="relative py-16 sm:py-24 bg-gradient-to-b from-background to-secondary/30">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
            HÄUFIGE FRAGEN
          </span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Alles, was Händler wissen wollen.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Antworten auf die häufigsten Fragen rund um SAIDA MagicBox, Bestellung, Qualität und Service.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border rounded-xl bg-card px-2 hover:border-primary/30 hover:shadow-sm data-[state=open]:border-primary/50 data-[state=open]:shadow-md transition-all"
            >
              <AccordionTrigger className="text-left font-semibold text-lg text-foreground px-4 py-5 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-5 text-base text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
