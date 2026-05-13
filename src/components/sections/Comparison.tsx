import { motion, useReducedMotion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

type Row = { label: string; magic: string; plotter: string; classic: string };

const rows: Row[] = [
  { label: "Einmal-Investition", magic: "ab €540", plotter: "€1.200 – €3.000", classic: "€2.000+" },
  { label: "Material pro Schutzfolie", magic: "€1,70", plotter: "€0,80 (Folie/TPU)", classic: "€2 – €4" },
  { label: "Modelle abgedeckt", magic: "2.000+ ✅", plotter: "5.000+ (nur Folie) ⚠️", classic: "~30 ❌" },
  { label: "Glasqualität", magic: "9H Panzerglas ✅", plotter: "❌ Nur Folie (TPU/Hydrogel)", classic: "9H Panzerglas ✅" },
  { label: "Curved-Display Support", magic: "✅ Mit 0,25mm Ultra-Dünn", plotter: "⚠️ Begrenzt", classic: "✅" },
  { label: "Fingerprint-Sensor kompatibel", magic: "✅ 0,25mm für sensible Modelle", plotter: "⚠️ Je nach Folie", classic: "⚠️ Je nach Modell" },
  { label: "Zeit pro Kunde", magic: "15 Sek. ✅", plotter: "3 – 5 Min.", classic: "10 – 20 Min. ❌" },
  { label: "Strom benötigt", magic: "❌ Nein", plotter: "✅ Ja", classic: "❌ Nein" },
  { label: "Software-Updates", magic: "✅ Kostenlos, monatlich", plotter: "⚠️ Abo ca. €20/Monat", classic: "— Nicht zutreffend" },
  { label: "Platzbedarf im Shop", magic: "0,5 m² ✅", plotter: "1,5 m²", classic: "3+ m² ❌" },
  { label: "Wartung", magic: "❌ Keine", plotter: "✅ Regelmäßig nötig", classic: "❌ Keine" },
  { label: "Empfohlen für", magic: "Jeden Handyshop", plotter: "High-Volume Repair", classic: "Spezialisten / Nischen" },
];

const Comparison = () => {
  const reduce = useReducedMotion();
  return (
    <section id="vergleich" className="relative py-16 sm:py-24 bg-gradient-to-b from-secondary/40 to-background overflow-hidden">
      <div className="absolute top-0 right-0 size-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
            DER VERGLEICH
          </span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            MagicBox vs. Schneideplotter vs. Klassisches Lager.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Was Sie wirklich pro Jahr kostet — und was Sie verdienen. Ein ehrlicher Vergleich.
          </p>
        </div>

        <div className="mt-12 relative">
          <div className="overflow-x-auto rounded-3xl border border-border shadow-elevated bg-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-card text-left font-semibold text-foreground p-4 border-b border-border">
                    Kriterium
                  </th>
                  <th className="p-4 border-b border-border bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold relative">
                    <div className="flex items-center justify-center gap-2">
                      <span>SAIDA MagicBox</span>
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-background/20 px-2 py-0.5 rounded-full">
                        <Star className="size-3 fill-current" /> Empfohlen
                      </span>
                    </div>
                  </th>
                  <th className="p-4 border-b border-border bg-secondary text-foreground font-semibold text-center">
                    Schneideplotter
                  </th>
                  <th className="p-4 border-b border-border bg-secondary text-foreground font-semibold text-center">
                    Klassisches Lager
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.label}
                    initial={reduce ? false : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className={`${i % 2 === 0 ? "bg-card" : "bg-secondary/30"} hover:bg-primary/5 transition-colors`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit p-4 font-medium text-foreground border-b border-border">
                      {r.label}
                    </td>
                    <td className="p-4 text-center text-foreground bg-primary/5 font-medium border-b border-border">
                      {r.magic}
                    </td>
                    <td className="p-4 text-center text-muted-foreground border-b border-border">
                      {r.plotter}
                    </td>
                    <td className="p-4 text-center text-muted-foreground border-b border-border">
                      {r.classic}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:hidden absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none rounded-r-3xl" />
        </div>

        <p className="mt-4 text-xs text-muted-foreground italic">
          *Vergleichswerte basieren auf branchenüblichen Durchschnittswerten und SAIDA-Praxiserfahrung aus 14 Jahren Mobilfunk-Handel. Tatsächliche Werte können je nach Shop variieren.
        </p>

        <div className="mt-12 rounded-3xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-8 sm:p-10 text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold">
            Möchten Sie eine ROI-Berechnung für Ihren Shop?
          </h3>
          <p className="mt-3 text-primary-foreground/85 max-w-2xl mx-auto">
            Senden Sie uns Ihren durchschnittlichen Schutzfolien-Umsatz und wir zeigen Ihnen, wie schnell sich MagicBox amortisiert.
          </p>
          <a
            href="#bestellung"
            className="mt-6 inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Unverbindliche Anfrage stellen <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
