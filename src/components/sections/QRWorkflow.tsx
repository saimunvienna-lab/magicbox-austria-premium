import { useState, useEffect, useRef } from "react";

const DB = [{"b":"Apple","m":"iPhone 11 Pro","k":"K01"},{"b":"Apple","m":"iPhone XS","k":"K01"},{"b":"Apple","m":"iPhone X","k":"K01"},{"b":"Apple","m":"iPhone 11","k":"K02"},{"b":"Apple","m":"iPhone XR","k":"K02"},{"b":"Apple","m":"iPhone 11 Pro Max","k":"K03"},{"b":"Apple","m":"iPhone XS Max","k":"K03"},{"b":"Apple","m":"iPhone 12 Pro","k":"K04"},{"b":"Apple","m":"iPhone 12","k":"K04"},{"b":"Apple","m":"iPhone 12 Pro Max","k":"K05"},{"b":"Apple","m":"iPhone 14","k":"K06"},{"b":"Apple","m":"iPhone 13 Pro","k":"K06"},{"b":"Apple","m":"iPhone 13","k":"K06"},{"b":"Apple","m":"iPhone 16E","k":"K06"},{"b":"Apple","m":"iPhone 14 Plus","k":"K07"},{"b":"Apple","m":"iPhone 13 Pro Max","k":"K07"},{"b":"Apple","m":"iPhone 16","k":"K08"},{"b":"Apple","m":"iPhone 15","k":"K08"},{"b":"Apple","m":"iPhone 14 Pro","k":"K08"},{"b":"Apple","m":"iPhone 16 Plus","k":"K09"},{"b":"Apple","m":"iPhone 15 Plus","k":"K09"},{"b":"Apple","m":"iPhone 14 Pro Max","k":"K09"},{"b":"Apple","m":"iPhone 15 Pro","k":"K10"},{"b":"Apple","m":"iPhone 15 Pro Max","k":"K11"},{"b":"Apple","m":"iPhone 16 Pro","k":"K12"},{"b":"Apple","m":"iPhone 17","k":"K12"},{"b":"Apple","m":"iPhone 17 PRO","k":"K12"},{"b":"Apple","m":"iPhone 16 Pro Max","k":"K13"},{"b":"Apple","m":"iPhone 17 PRO MAX","k":"K13"},{"b":"Apple","m":"iPhone 17 AIR","k":"K13-1"},{"b":"Samsung","m":"Samsung Galaxy S21 5G","k":"K14+"},{"b":"Google","m":"Google Pixel 7a","k":"K14+"},{"b":"Google","m":"Google Pixel 9","k":"K14+"},{"b":"Samsung","m":"Samsung Galaxy A24 4G","k":"K15+"},{"b":"Samsung","m":"Samsung Galaxy A25","k":"K15+"},{"b":"Samsung","m":"Samsung Galaxy S21+ 5G","k":"K15+"},{"b":"Vivo","m":"vivo T2","k":"K15+"},{"b":"Oppo","m":"Oppo A54","k":"K15+"},{"b":"Huawei","m":"Huawei Y9s","k":"K15+"},{"b":"Redmi","m":"Redmi Note 9 5G","k":"K15+"},{"b":"Nothing Phone","m":"Nothing Phone (1)","k":"K15+"},{"b":"Samsung","m":"Samsung Galaxy S23","k":"K16+"},{"b":"Samsung","m":"Samsung Galaxy S22 5G","k":"K16+"},{"b":"LG","m":"LG K31","k":"K16+"},{"b":"Tecno","m":"Tecno Pop 5S","k":"K16+"},{"b":"Samsung","m":"Samsung Galaxy S23 FE","k":"K17+"},{"b":"Samsung","m":"Samsung Galaxy S23+","k":"K17+"},{"b":"Samsung","m":"Samsung Galaxy S22+ 5G","k":"K17+"},{"b":"Samsung","m":"Samsung Galaxy A54","k":"K17+"},{"b":"Meizu","m":"Meizu 21","k":"K17+"},{"b":"Meizu","m":"Meizu 20","k":"K17+"},{"b":"Huawei","m":"HUAWEI PURA 80","k":"K17+"},{"b":"Samsung","m":"Samsung Galaxy S24","k":"K18+"},{"b":"Huawei","m":"Huawei P30","k":"K18+"},{"b":"Huawei","m":"Huawei P40","k":"K18+"},{"b":"Samsung","m":"Samsung Galaxy S24+","k":"K19+"},{"b":"Samsung","m":"Samsung Galaxy M15","k":"K19+"},{"b":"Samsung","m":"Samsung Galaxy A15","k":"K19+"},{"b":"Honor","m":"Honor 8X","k":"K19+"},{"b":"LG","m":"LG Q60","k":"K19+"},{"b":"Samsung","m":"Samsung Galaxy S24 Ultra","k":"K20+"},{"b":"Vivo","m":"vivo Y77e","k":"K21"},{"b":"Vivo","m":"vivo Y35","k":"K21"},{"b":"Vivo","m":"vivo Y22","k":"K21"},{"b":"Vivo","m":"vivo Y21","k":"K21"},{"b":"Vivo","m":"vivo Y20","k":"K21"},{"b":"Vivo","m":"vivo Y16","k":"K21"},{"b":"Vivo","m":"vivo iQOO Z6","k":"K21"},{"b":"Oppo","m":"Oppo A16s","k":"K21"},{"b":"Oppo","m":"Oppo A15","k":"K21"},{"b":"Oppo","m":"Oppo A38","k":"K21"},{"b":"Oppo","m":"Oppo A57","k":"K21"},{"b":"Oppo","m":"Oppo A78","k":"K21"},{"b":"Redmi","m":"Redmi A2","k":"K21"},{"b":"Redmi","m":"Redmi A1","k":"K21"},{"b":"Redmi","m":"Redmi 10A","k":"K21"},{"b":"Redmi","m":"Redmi 9C","k":"K21"},{"b":"Redmi","m":"Redmi 9A","k":"K21"},{"b":"Realme","m":"Realme C15","k":"K21"},{"b":"Realme","m":"Realme C3","k":"K21"},{"b":"Realme","m":"Realme C25","k":"K21"},{"b":"Realme","m":"Realme C30","k":"K21"},{"b":"Realme","m":"Realme 5","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A70","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy M33","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A23","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A13","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A12","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A04","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A03","k":"K21"},{"b":"Nokia","m":"Nokia G22","k":"K21"},{"b":"Nokia","m":"Nokia G21","k":"K21"},{"b":"Nokia","m":"Nokia G11","k":"K21"},{"b":"Honor","m":"Honor X8 5G","k":"K21"},{"b":"Honor","m":"Honor X6","k":"K21"},{"b":"Honor","m":"Honor X5","k":"K21"},{"b":"Xiaomi","m":"Xiaomi Poco M4 5G","k":"K21"},{"b":"Xiaomi","m":"Xiaomi Poco M5","k":"K21"},{"b":"Xiaomi","m":"Xiaomi Poco C51","k":"K21"},{"b":"OnePlus","m":"OnePlus Nord N300","k":"K21"},{"b":"Motorola","m":"Motorola Moto G20","k":"K21"},{"b":"Motorola","m":"Motorola Moto G50","k":"K21"},{"b":"Tecno","m":"Tecno Spark 10","k":"K21"},{"b":"Tecno","m":"Tecno Spark 8","k":"K21"},{"b":"Infinix","m":"Infinix Note 12","k":"K21"},{"b":"Infinix","m":"Infinix Hot 11","k":"K21"},{"b":"Vivo","m":"vivo Y100 4G","k":"K22"},{"b":"Vivo","m":"vivo T3","k":"K22"},{"b":"Vivo","m":"vivo iQOO Z9","k":"K22"},{"b":"Vivo","m":"vivo Y200e","k":"K22"},{"b":"Oppo","m":"Oppo A80","k":"K22"},{"b":"Redmi","m":"Redmi Note 12 Pro+","k":"K22"},{"b":"Redmi","m":"Redmi Note 11 Pro","k":"K22"},{"b":"Redmi","m":"Redmi Note 10 Pro","k":"K22"},{"b":"Realme","m":"Realme GT3","k":"K22"},{"b":"Realme","m":"Realme GT2","k":"K22"},{"b":"Samsung","m":"Samsung Galaxy Note20","k":"K22"},{"b":"Xiaomi","m":"Xiaomi Poco X5 Pro","k":"K22"},{"b":"Xiaomi","m":"Xiaomi Poco F5","k":"K22"},{"b":"Xiaomi","m":"Xiaomi Poco F3","k":"K22"},{"b":"Xiaomi","m":"Xiaomi 13T Pro","k":"K22"},{"b":"Nothing Phone","m":"Nothing Phone (2)","k":"K22"},{"b":"OnePlus","m":"OnePlus 10T","k":"K22"},{"b":"Motorola","m":"Motorola Edge 20","k":"K22"},{"b":"Tecno","m":"Tecno Spark 20","k":"K22"},{"b":"Vivo","m":"vivo S19","k":"K23"},{"b":"Vivo","m":"vivo iQOO 12","k":"K23"},{"b":"Oppo","m":"Oppo A96","k":"K23"},{"b":"Redmi","m":"Redmi Note 12","k":"K23"},{"b":"Realme","m":"Realme GT5","k":"K23"},{"b":"Samsung","m":"Samsung Galaxy M55","k":"K23"},{"b":"Samsung","m":"Samsung Galaxy A71","k":"K23"},{"b":"Xiaomi","m":"Xiaomi Poco X4 Pro 5G","k":"K23"},{"b":"Xiaomi","m":"Xiaomi 11T","k":"K23"},{"b":"OnePlus","m":"OnePlus Nord 4","k":"K23"},{"b":"Motorola","m":"Motorola Moto G35","k":"K23"},{"b":"Tecno","m":"Tecno Pova 6 Pro","k":"K23"},{"b":"Infinix","m":"Infinix Note 40","k":"K23"},{"b":"Asus","m":"Asus Zenfone 11 Ultra","k":"K23"},{"b":"Vivo","m":"vivo Y300i","k":"K24"},{"b":"Vivo","m":"vivo Y58","k":"K24"},{"b":"Oppo","m":"Oppo A3","k":"K24"},{"b":"Oppo","m":"Oppo A60","k":"K24"},{"b":"Redmi","m":"Redmi Note 12 4G","k":"K24"},{"b":"Realme","m":"Realme 13","k":"K24"},{"b":"Realme","m":"Realme 12","k":"K24"},{"b":"Samsung","m":"Samsung Galaxy M54","k":"K24"},{"b":"Samsung","m":"Samsung Galaxy A05s","k":"K24"},{"b":"Xiaomi","m":"Xiaomi Poco X5","k":"K24"},{"b":"Tecno","m":"Tecno Camon 30","k":"K24"},{"b":"Realme","m":"Realme 9 Pro+","k":"K25"},{"b":"Oppo","m":"Oppo Reno8","k":"K25"},{"b":"OnePlus","m":"OnePlus Nord","k":"K25"},{"b":"Google","m":"Google Pixel 6","k":"K25"},{"b":"Redmi","m":"Redmi Note 10S","k":"K25"},{"b":"Samsung","m":"Samsung Galaxy A14","k":"K26"},{"b":"Redmi","m":"Redmi A3","k":"K26"},{"b":"Xiaomi","m":"Xiaomi Poco C40","k":"K26"},{"b":"Samsung","m":"Samsung Galaxy A50s","k":"K27"},{"b":"Samsung","m":"Samsung Galaxy A32","k":"K27"},{"b":"Samsung","m":"Samsung Galaxy A20","k":"K27"},{"b":"Redmi","m":"Redmi Note 8 Pro","k":"K27"},{"b":"Redmi","m":"Redmi Note 7","k":"K27"},{"b":"Samsung","m":"Samsung Galaxy A34","k":"K28"},{"b":"Redmi","m":"Redmi 13","k":"K29"},{"b":"Redmi","m":"Redmi 12","k":"K29"},{"b":"Realme","m":"Realme C53","k":"K29"},{"b":"Samsung","m":"Samsung Galaxy A05","k":"K29"},{"b":"Infinix","m":"Infinix Hot 40","k":"K29"},{"b":"Honor","m":"Honor X7","k":"K29"},{"b":"Motorola","m":"Motorola Moto G51 5G","k":"K29"},{"b":"Tecno","m":"Tecno Pova 7 5G","k":"K29"},{"b":"Samsung","m":"Samsung Galaxy S20 FE","k":"K30"},{"b":"Samsung","m":"Samsung Galaxy A53 5G","k":"K30"},{"b":"Samsung","m":"Samsung Galaxy A52","k":"K30"},{"b":"Samsung","m":"Samsung Galaxy A51","k":"K30"},{"b":"Redmi","m":"Redmi Note 11","k":"K30"},{"b":"Xiaomi","m":"Xiaomi Poco M4 Pro","k":"K30"},{"b":"Tecno","m":"Tecno Pova 3","k":"K31"},{"b":"Samsung","m":"Samsung Galaxy F41","k":"K32"},{"b":"OnePlus","m":"OnePlus 9","k":"K32"},{"b":"OnePlus","m":"OnePlus 8T","k":"K32"},{"b":"Motorola","m":"Motorola Moto G84","k":"K32"},{"b":"Samsung","m":"Samsung Galaxy A55","k":"K33"},{"b":"Samsung","m":"Samsung Galaxy A35","k":"K33"},{"b":"Google","m":"Google Pixel 8 Pro","k":"K33"},{"b":"Vivo","m":"vivo V20","k":"K34"},{"b":"OnePlus","m":"OnePlus 7T","k":"K34"},{"b":"Samsung","m":"Samsung Galaxy S21 FE 5G","k":"K35"},{"b":"Google","m":"Google Pixel 7","k":"K35"},{"b":"Realme","m":"Realme Narzo 50","k":"K36"},{"b":"Motorola","m":"Motorola Moto G04","k":"K36"},{"b":"Motorola","m":"Motorola Moto G34","k":"K36"},{"b":"Infinix","m":"Infinix Smart 8","k":"K36"},{"b":"Xiaomi","m":"Xiaomi Mi 11 Lite 5G","k":"K37"},{"b":"Vivo","m":"vivo X60","k":"K37"},{"b":"Xiaomi","m":"Xiaomi Poco M3 Pro","k":"K38"},{"b":"Realme","m":"Realme 6","k":"K38"},{"b":"Samsung","m":"Samsung Galaxy A56","k":"K43"},{"b":"Samsung","m":"Samsung Galaxy A36","k":"K43"},{"b":"Samsung","m":"Samsung Galaxy A26","k":"K43"},{"b":"Nothing Phone","m":"Nothing Phone (3a)","k":"K43"},{"b":"Huawei","m":"Huawei Mate 60","k":"K43"},{"b":"Tecno","m":"Tecno Spark 40","k":"K43"},{"b":"Xiaomi","m":"Xiaomi 14","k":"K44"},{"b":"Google","m":"Google Pixel 4a 5G","k":"K44"},{"b":"Google","m":"Google Pixel 9 Pro XL","k":"K45"},{"b":"Nothing Phone","m":"Nothing Phone (2a)","k":"K45"},{"b":"Redmi","m":"Redmi Note 13 Pro","k":"K46"},{"b":"Redmi","m":"Redmi K70 Ultra","k":"K46"},{"b":"Xiaomi","m":"Xiaomi Poco F6","k":"K46"},{"b":"Xiaomi","m":"Xiaomi 13T","k":"K46"},{"b":"Realme","m":"Realme 13+","k":"K46"},{"b":"Samsung","m":"Samsung Galaxy S25 Ultra","k":"K55+"},{"b":"Samsung","m":"Samsung S25 EDGE","k":"K56+"},{"b":"Samsung","m":"S26","k":"K59+"},{"b":"Samsung","m":"S26 ULTRA","k":"K60+"},{"b":"Motorola","m":"Motorola Moto G54","k":"K51"},{"b":"Asus","m":"Asus ROG Phone 7","k":"K54"},{"b":"Redmi","m":"Redmi K80 Ultra","k":"K65+"},{"b":"Xiaomi","m":"Xiaomi Poco F7","k":"K65+"},{"b":"Xiaomi","m":"Xiaomi 15T Pro","k":"K65+"},{"b":"Huawei","m":"Huawei Nova 14 5G","k":"K61"},{"b":"Oppo","m":"Oppo Reno 14F","k":"K62+"},{"b":"Vivo","m":"Vivo X300 Pro","k":"K63+"},{"b":"Vivo","m":"Vivo iqoo 15","k":"K64+"},{"b":"Redmi","m":"Redmi 15 5G","k":"K57"},{"b":"Redmi","m":"Redmi 15C 5G","k":"K58"}];

type Model = { b: string; m: string; k: string };

const BRANDS = ["Apple","Samsung","Xiaomi","Redmi","Realme","Oppo","Vivo","OnePlus","Motorola","Huawei","Honor","Google","Nokia","Nothing Phone","Infinix","Tecno"];

const STEPS = [
  { num: "1", label: "Schritt 1 / Step 1", heading: "QR-Code scannen", desc: "Jede MagicBox hat einen eindeutigen QR. Ein Scan öffnet sofort den Inventar-Finder." },
  { num: "2", label: "Schritt 2 / Step 2", heading: "Modell identifizieren", desc: "2086 Modelle — das System zeigt die exakte K-Nummer. Beispiel: iPhone 17 PRO MAX → K13." },
  { num: "3", label: "Schritt 3 / Step 3", heading: "K-Schublade öffnen", desc: "Nach K-Nummer sortiert. Das System nennt die exakte Schublade — einfach öffnen." },
  { num: "4", label: "Schritt 4 / Step 4", heading: "Schutzglas anbringen", desc: "Passgenau. Sofort. Kein Fehlkauf — die richtige Folie, auf Anhieb." },
];

function highlight(text: string, query: string) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? <mark key={i} className="bg-primary/15 text-primary rounded px-0.5">{p}</mark> : p
  );
}

const MagicBoxFinder = () => {
  const [tab, setTab] = useState<"how" | "find">("how");
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [selected, setSelected] = useState<Model | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setStep(s => (s + 1) % 4), 2800);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const goStep = (n: number) => { setPaused(true); if (timerRef.current) clearInterval(timerRef.current); setStep(n); };

  const results = DB.filter(d =>
    (!brand || d.b === brand) &&
    (!query || d.m.toLowerCase().includes(query.toLowerCase()) || d.b.toLowerCase().includes(query.toLowerCase()) || d.k.toLowerCase().includes(query.toLowerCase()))
  );

  const showSearch = query.trim() || brand;

  return (
    <section id="how" className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">So funktioniert's · How it works</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-3">
            Scan. Find. <span className="text-primary">Install.</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">2086 Modelle · 48+ Marken · K01–K65+ · Sofortsuche</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1 mb-8 max-w-sm mx-auto">
          <button onClick={() => setTab("how")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "how" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>
            So funktioniert's
          </button>
          <button onClick={() => setTab("find")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "find" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}>
            Modell suchen
          </button>
        </div>

        {/* HOW IT WORKS */}
        {tab === "how" && (
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Visual */}
            <div className="border border-border rounded-2xl bg-secondary/20 p-8 min-h-[200px] flex flex-col items-center justify-center gap-6">
              {step === 0 && (
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-background border border-border rounded-xl p-2 grid grid-cols-4 gap-1 relative overflow-hidden">
                    {[1,1,1,1,1,0,1,1,0,1,0,1,1,1,0,1].map((v,i) => (
                      <div key={i} className={`rounded-sm ${v ? "bg-foreground opacity-80" : ""}`} />
                    ))}
                    <div className="absolute left-1 right-1 h-0.5 bg-primary" style={{animation:"scanLine 1.8s ease-in-out infinite",top:"10%"}} />
                  </div>
                  <div className="text-center"><div className="text-3xl text-primary mb-1">⬡</div><p className="text-xs text-muted-foreground">Scannen...</p></div>
                </div>
              )}
              {step === 1 && (
                <div className="flex items-center gap-6">
                  <div className="bg-background border border-border rounded-xl p-4 min-w-[160px]">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Apple</p>
                    <p className="text-sm font-semibold">iPhone 17 PRO MAX</p>
                    <p className="text-primary text-xs font-medium mt-2">K-Serie: K13</p>
                  </div>
                  <div className="text-center text-green-500 text-2xl">✓</div>
                </div>
              )}
              {step === 2 && (
                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">K13</p>
                    <p className="text-primary text-xs">Schublade 13 ←</p>
                  </div>
                  <div className="bg-background border border-border rounded-xl p-3 w-32 flex flex-col gap-2">
                    {["K11","K12","K13","K13-1"].map((k,i) => (
                      <div key={k} className={`h-4 rounded flex items-center px-2 text-xs ${i===2 ? "bg-primary/15 text-primary border border-primary/30" : "bg-secondary text-muted-foreground"}`}>{k}{i===2 && " ←"}</div>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="flex items-center gap-6">
                  <div className="relative w-12 h-20 rounded-xl border-2 border-primary bg-primary/5">
                    <div className="absolute left-2 top-2 w-1 bottom-2 rounded-full bg-primary/20" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-green-100 border border-green-400 flex items-center justify-center text-green-600 text-xs">✓</div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">iPhone 17 PRO MAX</p>
                    <p className="text-xs text-primary mt-1">K13 — Passgenau</p>
                    <p className="text-xs text-green-600 mt-1">Verkauf abgeschlossen</p>
                  </div>
                </div>
              )}
              {/* Progress dots */}
              <div className="flex gap-2">
                {[0,1,2,3].map(i => (
                  <button key={i} onClick={() => goStep(i)} className={`h-1 rounded-full transition-all ${step===i ? "w-6 bg-primary" : "w-3 bg-border"}`} />
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col">
              <div className="border border-border rounded-2xl overflow-hidden mb-6">
                {STEPS.map((s, i) => (
                  <div key={i} onClick={() => goStep(i)} className={`grid cursor-pointer transition-colors ${step===i ? "bg-primary/5" : "bg-background hover:bg-secondary/50"} ${i>0 ? "border-t border-border" : ""}`} style={{gridTemplateColumns:"44px 1fr"}}>
                    <div className="flex items-center justify-center py-4 border-r border-border">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold transition-all ${step===i ? "bg-primary border-primary text-white" : "border-border text-muted-foreground"}`}>{s.num}</div>
                    </div>
                    <div className="p-3 pl-4">
                      <p className={`text-xs uppercase tracking-wider mb-0.5 ${step===i ? "text-primary" : "text-muted-foreground"}`}>{s.label}</p>
                      <p className="text-sm font-semibold text-foreground">{s.heading}</p>
                      {step===i && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab("find")} className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                Jetzt Modell suchen →
              </button>
            </div>
          </div>
        )}

        {/* FINDER */}
        {tab === "find" && (
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
              <input
                autoFocus
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(null); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="z.B. iPhone 17 PRO MAX, Galaxy S25, Poco F7..."
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => { setBrand(""); setSelected(null); }} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!brand ? "bg-primary text-white border-primary" : "border-border text-muted-foreground"}`}>Alle</button>
              {BRANDS.map(b => (
                <button key={b} onClick={() => { setBrand(b === brand ? "" : b); setSelected(null); }} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${brand===b ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground"}`}>{b}</button>
              ))}
            </div>

            {selected && (
              <div className="border border-border rounded-2xl bg-secondary/20 p-5 mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-foreground text-base">{selected.m}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selected.b}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary leading-none">{selected.k}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">K-Serie</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                  {[["📱","QR scannen","MagicBox"],["📦","Schublade",selected.k],["✓","Schutzglas","Passgenau"]].map(([icon,label,val],i) => (
                    <div key={i} className="bg-background border border-border rounded-xl p-3 text-center">
                      <p className="text-lg mb-1">{icon}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSearch ? (
              <>
                <p className="text-xs text-muted-foreground mb-2"><span className="font-semibold text-primary">{results.length}</span> Gerät{results.length !== 1 ? "e" : ""} gefunden</p>
                {results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">Kein Gerät gefunden — Suchbegriff anpassen</div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                    {results.slice(0, 60).map((d, i) => (
                      <div key={i} onClick={() => setSelected(d)} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/40 cursor-pointer transition-colors">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{d.b}</p>
                          <p className="text-sm font-medium text-foreground">{highlight(d.m, query)}</p>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 text-center min-w-[52px] flex-shrink-0">
                          <p className="text-sm font-semibold text-primary">{d.k}</p>
                          <p className="text-xs text-primary/60">K-Serie</p>
                        </div>
                      </div>
                    ))}
                    {results.length > 60 && <p className="text-center text-xs text-muted-foreground py-2 border-t border-border">+ {results.length - 60} weitere — Suche verfeinern</p>}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm">Modellnamen eingeben oder Marke auswählen</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MagicBoxFinder;
