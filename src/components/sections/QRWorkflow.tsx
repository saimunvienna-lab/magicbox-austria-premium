import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

const steps = {
  en: [
    {
      num: "01",
      label: "Step 1",
      heading: "Scan QR Code",
      desc: "Every MagicBox carries a unique QR code. One scan opens the inventory finder instantly in your browser.",
    },
    {
      num: "02",
      label: "Step 2",
      heading: "Identify the model",
      desc: "2000+ smartphone models, 48+ brands — the system shows the exact match with K-number immediately.",
    },
    {
      num: "03",
      label: "Step 3",
      heading: "Open K-number drawer",
      desc: "Every drawer is sorted by K-number. No searching — just open the indicated drawer and take out the glass.",
    },
    {
      num: "04",
      label: "Step 4",
      heading: "Install the glass",
      desc: "Perfect fit. Every time. No wrong purchases, no waste — the right protector for every device, first try.",
    },
  ],
  de: [
    {
      num: "01",
      label: "Schritt 1",
      heading: "QR-Code scannen",
      desc: "Jede MagicBox trägt einen eindeutigen QR. Ein Scan öffnet den Inventar-Finder sofort im Browser.",
    },
    {
      num: "02",
      label: "Schritt 2",
      heading: "Modell identifizieren",
      desc: "2000+ Smartphone-Modelle, 48+ Marken — das System zeigt exakt das richtige Modell mit K-Nummer an.",
    },
    {
      num: "03",
      label: "Schritt 3",
      heading: "K-Schublade öffnen",
      desc: "Jede Schublade ist nach K-Nummern sortiert. Kein Suchen — einfach die angezeigte Lade öffnen.",
    },
    {
      num: "04",
      label: "Schritt 4",
      heading: "Schutzglas anbringen",
      desc: "Passgenau. Sofort. Kein Ausschuss, kein Fehlkauf — die richtige Folie für jedes Gerät, auf Anhieb.",
    },
  ],
};

const visuals = [
  // Step 1 — QR scan
  <div key="v0" className="flex items-center justify-center gap-8">
    <div className="grid grid-cols-3 gap-1 p-3 bg-background border border-border rounded-xl w-20 h-20">
      {[1,0,1,0,1,0,1,0,1].map((on, i) => (
        <div key={i} className={`rounded-sm ${on ? "bg-foreground opacity-80" : "bg-transparent"}`} />
      ))}
    </div>
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
          <rect x="7" y="7" width="10" height="10" rx="1" />
        </svg>
      </div>
      <span className="text-xs text-muted-foreground">Scanning…</span>
    </div>
  </div>,

  // Step 2 — Model found
  <div key="v1" className="flex items-center justify-center gap-6">
    <div className="bg-background border border-border rounded-xl px-5 py-4 min-w-[150px]">
      <p className="text-sm font-medium text-foreground">iPhone 15 Pro Max</p>
      <p className="text-xs text-primary mt-1">K-Nummer: K-2847</p>
      <p className="text-xs text-muted-foreground mt-2">48+ Brands · 2000+ Models</p>
    </div>
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
      <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  </div>,

  // Step 3 — Drawer
  <div key="v2" className="flex items-center justify-center gap-8">
    <div className="bg-background border border-border rounded-xl p-3 w-28 flex flex-col gap-2">
      {[false, true, false, false].map((open, i) => (
        <div
          key={i}
          className={`h-3 rounded-md transition-colors ${open ? "bg-primary opacity-70" : "bg-muted"}`}
        />
      ))}
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground">K-2847</span>
      <span className="text-xs text-primary">Drawer 2 ↓</span>
    </div>
  </div>,

  // Step 4 — Glass
  <div key="v3" className="flex items-center justify-center gap-8">
    <div className="w-14 h-24 rounded-xl border-2 border-primary bg-primary/5 relative flex items-center justify-center overflow-hidden">
      <div className="absolute left-3 w-1.5 h-14 rounded-full bg-primary/20" />
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground">Perfect fit</span>
      <span className="text-xs text-primary">No returns</span>
      <svg className="w-5 h-5 text-primary mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  </div>,
];

const QRWorkflow = () => {
  const { locale } = useI18n();
  const lang = (locale === "de" ? "de" : "en") as "en" | "de";
  const data = steps[lang];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % 4);
    }, 2800);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const handleClick = (i: number) => {
    setPaused(true);
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const headline = lang === "de"
    ? (<>Scannen. Finden.<br />Anbringen. Unter&nbsp;10&nbsp;Sekunden.</>)
    : (<>Scan. Find.<br />Install. Under&nbsp;10&nbsp;seconds.</>);

  const eyebrow = lang === "de" ? "So funktioniert's" : "How it works";
  const hint = lang === "de" ? "Tippe auf einen Schritt" : "Tap any step";

  return (
    <section id="how" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            {headline}
          </h2>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Steps */}
          <div className="flex flex-col">
            {data.map((step, i) => (
              <div
                key={i}
                className="flex gap-5 cursor-pointer group"
                onClick={() => handleClick(i)}
              >
                {/* Left col: circle + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full border flex flex-col items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      active === i
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground group-hover:border-primary/50"
                    }`}
                  >
                    <span className={`text-[10px] font-semibold tracking-widest ${active === i ? "text-primary-foreground/70" : "text-primary"}`}>
                      {step.num}
                    </span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {i === 0 && <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="15" y="15" width="3" height="3"/><rect x="19" y="15" width="2" height="2" className="opacity-0"/></>}
                      {i === 1 && <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></>}
                      {i === 2 && <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></>}
                      {i === 3 && <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h4"/></>}
                    </svg>
                  </div>
                  {i < 3 && (
                    <div className={`w-px flex-1 min-h-[2rem] my-1 transition-colors duration-500 ${active > i ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 pt-1 flex-1">
                  <p className={`text-[11px] font-semibold tracking-widest uppercase mb-1 transition-colors ${active === i ? "text-primary" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{step.heading}</h3>
                  <p className={`text-sm text-muted-foreground leading-relaxed transition-all duration-400 ${active === i ? "opacity-100 max-h-24" : "opacity-0 max-h-0 overflow-hidden"}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Progress dots */}
            <div className="flex gap-2 mt-2 ml-[4.75rem]">
              {[0,1,2,3].map((i) => (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${active === i ? "w-8 bg-primary" : "w-4 bg-border"}`}
                  aria-label={`Step ${i+1}`}
                />
              ))}
            </div>
          </div>

          {/* Visual panel */}
          <div className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-border bg-secondary/30 p-10 min-h-[280px] flex flex-col items-center justify-center gap-6 transition-all duration-500">
              <div className="w-full flex items-center justify-center min-h-[140px]">
                {visuals[active]}
              </div>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default QRWorkflow;
