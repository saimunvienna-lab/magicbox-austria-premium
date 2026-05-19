import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Model = { b: string; m: string; k: string };

const BRANDS = [
  "Vivo","Oppo","Realme","Samsung","Redmi","Motorola","Tecno","Xiaomi","Infinix",
  "Huawei","Honor","OnePlus","Nokia","Apple","Google","Nothing Phone",
];

function hl(text: string, q: string) {
  if (!q.trim()) return <>{text}</>;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        re.test(part)
          ? <mark key={i} className="bg-primary/15 text-primary rounded-sm px-0.5 not-italic">{part}</mark>
          : part
      )}
    </>
  );
}

const QRWorkflow = () => {
  const { t } = useI18n();

  const STEPS = [
    { n: "01", label: t("qr_s1_label"), heading: t("qr_s1_h"), desc: t("qr_s1_d") },
    { n: "02", label: t("qr_s2_label"), heading: t("qr_s2_h"), desc: t("qr_s2_d") },
    { n: "03", label: t("qr_s3_label"), heading: t("qr_s3_h"), desc: t("qr_s3_d") },
    { n: "04", label: t("qr_s4_label"), heading: t("qr_s4_h"), desc: t("qr_s4_d") },
  ];

  const [tab, setTab]               = useState<"how" | "find">("how");
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused]         = useState(false);
  const [query, setQuery]           = useState("");
  const [brand, setBrand]           = useState("");
  const [selected, setSelected]     = useState<Model | null>(null);
  const [DB, setDB]                 = useState<Model[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/phone-models.json")
      .then((r) => r.json())
      .then((rows: Array<{ brand: string; model: string; k_series: string }>) => {
        setDB(rows.map((r) => ({ b: r.brand, m: r.model, k: r.k_series })));
      })
      .catch(() => setDB([]));
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const goStep = (n: number) => {
    setPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveStep(n);
  };

  const results = DB.filter((d) =>
    (!brand || d.b === brand) &&
    (!query.trim() || d.m.toLowerCase().includes(query.toLowerCase()) || d.k.toLowerCase().includes(query.toLowerCase()))
  );
  const showResults = !!(query.trim() || brand);

  return (
    <section id="how" className="relative py-28 sm:py-36 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6">
            <span className="block w-8 h-px bg-primary/60" />
            {t("qr_new_eyebrow")}
            <span className="block w-8 h-px bg-primary/60" />
          </p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight">
            {t("qr_new_title")}{" "}
            <span className="text-gradient">{t("qr_new_title2")}</span>
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("qr_new_sub")}
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex gap-1.5 bg-secondary/60 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5">
            {(["how", "find"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tab === key ? "bg-background text-primary shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {key === "how" ? t("qr_tab_how") : t("qr_tab_find")}
              </button>
            ))}
          </div>
        </div>

        {/* TAB: HOW IT WORKS */}
        {tab === "how" && (
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">

            {/* LEFT: PHOTO */}
            <div className="relative">
              <div className="absolute -top-5 -right-4 z-20 hidden sm:flex items-center gap-4 bg-background/95 backdrop-blur-sm border border-border rounded-2xl px-5 py-3.5 shadow-xl">
                <div className="text-center"><p className="text-2xl font-bold text-primary leading-none">2086</p><p className="text-xs text-muted-foreground mt-0.5">{t("qr_stat_models")}</p></div>
                <div className="w-px h-9 bg-border" />
                <div className="text-center"><p className="text-2xl font-bold text-primary leading-none">48+</p><p className="text-xs text-muted-foreground mt-0.5">{t("qr_stat_brands")}</p></div>
                <div className="w-px h-9 bg-border" />
                <div className="text-center"><p className="text-2xl font-bold text-primary leading-none">K65+</p><p className="text-xs text-muted-foreground mt-0.5">{t("qr_stat_series")}</p></div>
              </div>

              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl ring-1 ring-border/20">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&auto=format&fit=crop&q=85"
                  alt={t("qr_img_alt")}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />
                <div className="absolute inset-0 bg-primary/[0.08]" />
                <div className="absolute left-8 right-8 top-[12%] bottom-[38%] rounded-2xl border border-primary/40 overflow-hidden">
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: "qrScan 2.2s ease-in-out infinite" }} />
                  <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/70 rounded-tl-lg" />
                  <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/70 rounded-tr-lg" />
                  <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/70 rounded-bl-lg" />
                  <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/70 rounded-br-lg" />
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-background/85 backdrop-blur-md border border-border/60 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-bold">{STEPS[activeStep].n}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary mb-0.5">{STEPS[activeStep].label}</p>
                        <p className="text-sm font-bold text-foreground truncate">{STEPS[activeStep].heading}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {STEPS.map((_, i) => (
                          <button key={i} onClick={() => goStep(i)} aria-label={`${t("qr_step_label")} ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: STEPS */}
            <div className="flex flex-col gap-3 lg:pt-8">
              {STEPS.map((step, i) => (
                <div key={i} role="button" tabIndex={0} onClick={() => goStep(i)} onKeyDown={e => e.key === "Enter" && goStep(i)}
                  className={`flex gap-5 rounded-2xl border cursor-pointer transition-all duration-300 p-5 select-none ${
                    activeStep === i ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border/60 bg-background/60 hover:border-border hover:bg-secondary/30"
                  }`}
                >
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    activeStep === i ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-secondary text-muted-foreground"
                  }`}>
                    {step.n}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-xs font-bold uppercase tracking-[0.12em] mb-1 transition-colors ${activeStep === i ? "text-primary" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <h3 className="text-lg font-bold text-foreground leading-snug">{step.heading}</h3>
                    <div className={`overflow-hidden transition-all duration-300 ${activeStep === i ? "max-h-28 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  {activeStep === i && <div className="flex-shrink-0 w-1 self-stretch rounded-full bg-primary/50" />}
                </div>
              ))}

              <button onClick={() => setTab("find")}
                className="mt-3 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                {t("qr_find_cta")}
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* TAB: FINDER */}
        {tab === "find" && (
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input autoFocus value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }}
                placeholder={t("qr_search_ph")}
                className="w-full py-4 rounded-2xl border border-border bg-background text-base focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                style={{ paddingLeft: "3.25rem", paddingRight: query ? "3rem" : "1.25rem" }} />
              {query && (
                <button onClick={() => { setQuery(""); setSelected(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => { setBrand(""); setSelected(null); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!brand ? "bg-primary text-primary-foreground border-primary shadow-sm" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}>
                {t("qr_all")}
              </button>
              {BRANDS.map(b => (
                <button key={b} onClick={() => { setBrand(brand === b ? "" : b); setSelected(null); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${brand === b ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}>
                  {b}
                </button>
              ))}
            </div>

            {selected && (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-6 animate-fade-up">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1">{selected.b}</p>
                    <h3 className="text-2xl font-bold text-foreground">{selected.m}</h3>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-4xl font-bold text-primary leading-none">{selected.k}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">K-{t("qr_series")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  {[
                    ["📱", t("qr_detail_scan"), t("qr_detail_box")],
                    ["📦", t("qr_detail_drawer"), selected.k],
                    ["✅", t("qr_detail_install"), t("qr_detail_fit")],
                  ].map(([icon, label, val], i) => (
                    <div key={i} className="bg-background border border-border rounded-2xl p-4 text-center">
                      <p className="text-2xl mb-2">{icon}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-bold text-foreground mt-1">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResults ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-bold text-primary">{results.length}</span>{" "}
                  {results.length === 1 ? t("qr_found_s") : t("qr_found_p")}
                </p>
                {results.length === 0 ? (
                  <div className="text-center py-14 text-muted-foreground text-base">{t("qr_no_result")}</div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[440px] overflow-y-auto">
                    {results.slice(0, 60).map((d, i) => (
                      <button key={i} onClick={() => setSelected(d)}
                        className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl border w-full text-left transition-all ${
                          selected?.m === d.m ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-background hover:border-primary/30 hover:bg-secondary/20"
                        }`}>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{d.b}</p>
                          <p className="text-sm font-semibold text-foreground truncate">{hl(d.m, query)}</p>
                        </div>
                        <div className="flex-shrink-0 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 text-center min-w-[62px]">
                          <p className="text-sm font-bold text-primary leading-none">{d.k}</p>
                          <p className="text-xs text-primary/60 mt-0.5">K-{t("qr_series")}</p>
                        </div>
                      </button>
                    ))}
                    {results.length > 60 && (
                      <p className="text-center text-sm text-muted-foreground py-3 border-t border-border">
                        + {results.length - 60} {t("qr_more")}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4">
                <Search className="w-12 h-12 opacity-20" />
                <p className="text-base">{t("qr_empty")}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes qrScan {
          0%   { top: 2%;  opacity: 1; }
          45%  { top: 90%; opacity: 1; }
          50%  { top: 90%; opacity: 0; }
          52%  { top: 2%;  opacity: 0; }
          55%  { top: 2%;  opacity: 1; }
          100% { top: 2%;  opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default QRWorkflow;
