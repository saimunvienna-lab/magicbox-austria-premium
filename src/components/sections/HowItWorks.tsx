import { motion, useReducedMotion } from "framer-motion";
import { Smartphone, QrCode, PackageOpen, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Smartphone,
    title: "Kunde kommt mit Smartphone",
    desc: "Egal welches Modell — iPhone 17 Pro Max, Samsung Galaxy S26 Ultra, Xiaomi 15 oder ein 5 Jahre altes Huawei. Sie müssen nichts wissen, keine Modellliste prüfen.",
    placeholder: "Foto: Kunde am Tresen",
  },
  {
    n: "02",
    icon: QrCode,
    title: "QR-Code scannen, Modell wählen",
    desc: "Mit dem Smartphone den QR-Code auf der MagicBox scannen. App öffnet sich, Modell wählen — System zeigt sofort die richtige Schublade (z.B. K60+ für Samsung Galaxy S26 Ultra).",
    placeholder: "Foto: QR-Scan auf Handy mit App-Anzeige",
  },
  {
    n: "03",
    icon: PackageOpen,
    title: "Schublade öffnen, Panzerglas anbringen",
    desc: "Beschriftete Schublade öffnen, perfekt passendes Panzerglas entnehmen, sauber anbringen. Fertig. Kunde glücklich. Nächster bitte.",
    placeholder: "Foto: Geöffnete Schublade mit Panzerglas",
  },
];

const HowItWorks = () => {
  const reduce = useReducedMotion();
  return (
    <section id="how" className="relative py-16 sm:py-24 overflow-hidden bg-background">
      <div className="absolute -top-32 -left-32 size-[420px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 size-[420px] rounded-full bg-primary-glow/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
            SO FUNKTIONIERT'S
          </span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            In 15 Sekunden vom Kunden zur Kasse.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Drei Schritte. Keine Suche. Kein Chaos. So einfach ist der MagicBox-Workflow im Shop-Alltag.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector */}
          <div className="hidden lg:block absolute top-24 left-[16%] right-[16%] h-px border-t-2 border-dashed border-primary/30 pointer-events-none" />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative bg-card rounded-3xl p-8 border border-border shadow-elevated hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute top-4 right-6 text-6xl font-bold text-muted/40 select-none leading-none">
                {s.n}
              </span>
              <div className="relative">
                <div className="size-14 rounded-full bg-primary/10 grid place-items-center mb-6">
                  <s.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-6 aspect-video rounded-2xl bg-gradient-to-br from-secondary to-primary/5 grid place-items-center">
                  <span className="text-xs text-muted-foreground/70 italic">{s.placeholder}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-r from-foreground to-primary-deep text-primary-foreground p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="text-2xl sm:text-3xl font-bold leading-tight">
            Von 12 Minuten Suche auf 15 Sekunden.
          </div>
          <a
            href="#bestellung"
            className="shrink-0 inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Jetzt MagicBox bestellen <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
