import { useState, useRef } from "react";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Package, Settings, Plus, Minus, CheckCircle, Building, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

/* ── Constants ─────────────────────────────────────────── */
const K_PLUS = ["K14+","K15+","K16+","K17+","K18+","K19+","K20+","K55+","K56+","K59+","K60+","K62+","K63+","K64+","K65+"];
const K_ALL  = [
  "K01","K02","K03","K04","K05","K06","K07","K08","K09","K10",
  "K11","K12","K13","K13-1","K14+","K15+","K16+","K17+","K18+","K19+",
  "K20+","K21","K22","K23","K24","K25","K26","K27","K28","K29",
  "K30","K31","K32","K33","K34","K35","K36","K37","K38","K39",
  "K40","K41","K42","K43","K44","K45","K46","K47","K48","K49",
  "K50","K51","K52","K53","K54","K55+","K56+","K57","K58","K59+",
  "K60+","K61","K62+","K63+","K64+","K65+",
];
const STARTER_NET  = 399.90;
const K_PRICE      = 6.25;
const K_PLUS_PRICE = 9.90;
const VAT_RATE     = 0.20;

type KSel = Record<string, number>;
type VatStatus = "idle" | "checking" | "valid" | "invalid" | "unknown";

const fmt   = (n: number) => "€" + n.toFixed(2).replace(".", ",");
const isPlus = (k: string) => K_PLUS.includes(k);
const up     = (k: string) => isPlus(k) ? K_PLUS_PRICE : K_PRICE;

const contactSchema = z.object({
  shop_name:    z.string().trim().min(1).max(150),
  contact_name: z.string().trim().min(1).max(100),
  email:        z.string().trim().email().max(255),
  phone:        z.string().trim().min(1).max(50),
  city:         z.string().trim().min(1).max(100),
  country:      z.string().trim().min(1).max(80),
  vat_number:   z.string().trim().max(30).optional(),
  message:      z.string().trim().max(1000).optional(),
});

/* ── Sub-components ─────────────────────────────────────── */
const KGrid = ({
  selected, onToggle, onChangeQty,
}: {
  selected: KSel;
  onToggle: (k: string) => void;
  onChangeQty: (k: string, d: number) => void;
}) => (
  <div className="space-y-3">
    <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-1.5">
      {K_ALL.map(k => (
        <button key={k} type="button" onClick={() => onToggle(k)}
          className={`py-2 px-1 rounded-lg border text-center transition-all ${
            selected[k]
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/30"
          }`}>
          <span className="block text-xs font-semibold">{k}</span>
          <span className="block text-[10px] mt-0.5 opacity-60">{fmt(up(k))}</span>
        </button>
      ))}
    </div>
    {Object.keys(selected).length > 0 && (
      <div className="space-y-2 pt-2 border-t border-border">
        {Object.entries(selected).map(([k, q]) => (
          <div key={k} className="flex items-center gap-3">
            <span className="text-sm font-medium w-16">{k}</span>
            <span className="text-xs text-muted-foreground flex-1">
              {fmt(up(k))} × {q} = {fmt(up(k) * q)}
            </span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button type="button" onClick={() => onChangeQty(k, -1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition text-base">−</button>
              <span className="w-8 text-center text-sm font-medium">{q}</span>
              <button type="button" onClick={() => onChangeQty(k, 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition text-base">+</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SummaryBox = ({ rows, vatRow, total }: {
  rows: { label: string; value: string }[];
  vatRow?: { label: string; value: string };
  total: string;
}) => (
  <div className="bg-secondary/40 rounded-xl p-4 space-y-1.5 mt-4">
    {rows.map((r, i) => (
      <div key={i} className="flex justify-between text-sm">
        <span className="text-muted-foreground">{r.label}</span>
        <span>{r.value}</span>
      </div>
    ))}
    {vatRow && (
      <div className="flex justify-between text-sm text-amber-600">
        <span>{vatRow.label}</span>
        <span>{vatRow.value}</span>
      </div>
    )}
    <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
      <span>Gesamt / Total</span>
      <span className="text-primary">{total}</span>
    </div>
  </div>
);

/* ── Main Component ─────────────────────────────────────── */
const Order = () => {
  const { lang }  = useI18n();
  const { toast } = useToast();
  const de        = lang === "de";

  const [step, setStep]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Product
  const [isAT, setIsAT]               = useState(true);
  const [product, setProduct]         = useState<"starter" | "custom">("starter");
  const [starterQty, setStarterQty]   = useState(1);
  const [showExtra, setShowExtra]     = useState(false);
  const [extraK, setExtraK]           = useState<KSel>({});
  const [customK, setCustomK]         = useState<KSel>({});

  // Contact
  const [shopName, setShopName]       = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [city, setCity]               = useState("");
  const [country, setCountry]         = useState("");
  const [vatNum, setVatNum]           = useState("");
  const [vatStatus, setVatStatus]     = useState<VatStatus>("idle");
  const [vatCompany, setVatCompany]   = useState("");
  const [message, setMessage]         = useState("");
  const vatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Totals */
  const starterNet   = STARTER_NET * starterQty;
  const extraNet     = Object.entries(extraK).reduce((a, [k, q]) => a + up(k) * q, 0);
  const starterTotNet = starterNet + extraNet;
  const customNet    = Object.entries(customK).reduce((a, [k, q]) => a + up(k) * q, 0);
  const activeNet    = product === "starter" ? starterTotNet : customNet;
  const vat          = isAT ? activeNet * VAT_RATE : 0;
  const grand        = activeNet + vat;

  /* K helpers */
  const toggleK = (sel: KSel, setSel: (v: KSel) => void, k: string) => {
    const next = { ...sel };
    if (next[k]) delete next[k]; else next[k] = 1;
    setSel(next);
  };
  const changeKQty = (sel: KSel, setSel: (v: KSel) => void, k: string, d: number) =>
    setSel({ ...sel, [k]: Math.max(1, Math.min(999, (sel[k] || 1) + d)) });

  /* VAT validation via VIES proxy */
  const checkVat = async (raw: string) => {
    const cc  = raw.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
    const num = raw.replace(/[A-Za-z\s-]/g, "");
    if (!cc || !num) { setVatStatus("idle"); return; }
    setVatStatus("checking");
    try {
      const res  = await fetch(`https://viesapi.eu/api/search/${cc}${num}`);
      const data = await res.json();
      if (data?.valid === true) {
        setVatStatus("valid");
        setVatCompany(data.traderName || "");
      } else {
        setVatStatus("invalid");
        setVatCompany("");
      }
    } catch {
      setVatStatus("unknown");
    }
  };

  const onVatChange = (v: string) => {
    setVatNum(v);
    setVatStatus("idle");
    setVatCompany("");
    if (vatTimer.current) clearTimeout(vatTimer.current);
    if (v.trim().length > 4) vatTimer.current = setTimeout(() => checkVat(v.trim()), 900);
  };

  /* Submit */
  const handleSubmit = async () => {
    const parsed = contactSchema.safeParse({
      shop_name: shopName, contact_name: contactName,
      email, phone, city, country,
      vat_number: vatNum || undefined,
      message: message || undefined,
    });
    if (!parsed.success) {
      toast({ title: de ? "Bitte alle Pflichtfelder ausfüllen" : "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (product === "custom" && Object.keys(customK).length === 0) {
      toast({ title: de ? "Bitte K-Serien auswählen" : "Please select K-Series", variant: "destructive" });
      return;
    }
    setLoading(true);
    const items = product === "starter"
      ? [
          { type: "starter_box", qty: starterQty, unit_price: STARTER_NET },
          ...Object.entries(extraK).map(([k, q]) => ({ k_series: k, qty: q, unit_price: up(k), type: "extra" })),
        ]
      : Object.entries(customK).map(([k, q]) => ({ k_series: k, qty: q, unit_price: up(k), type: "custom" }));

    const { error } = await supabase.from("orders").insert([{
      ...parsed.data,
      k_series:     product === "starter"
        ? `Starter Box ×${starterQty}` + (Object.keys(extraK).length ? ` + ${Object.keys(extraK).join(", ")}` : "")
        : Object.keys(customK).join(", "),
      quantity:     product === "starter" ? starterQty : Object.values(customK).reduce((a, b) => a + b, 0),
      product_type: product,
      items,
      vat_applied:  isAT,
      net_total:    activeNet,
      vat_amount:   vat,
      grand_total:  grand,
      vat_valid:    vatStatus === "valid",
    }]);

    if (error) {
      toast({ title: de ? "Fehler" : "Error", description: de ? "Bitte erneut versuchen." : "Please try again.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({
        title: de ? "Bestellung eingegangen! ✅" : "Order received! ✅",
        description: `${fmt(grand)}${isAT ? (de ? " inkl. MwSt." : " incl. VAT") : ""}`,
      });
    }
    setLoading(false);
  };

  const STEPS = [
    de ? "Produkt" : "Product",
    de ? "Kontakt" : "Contact",
    de ? "Übersicht" : "Review",
  ];

  if (submitted) return (
    <section id="order" className="py-24 sm:py-32 bg-secondary/20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-3">
          {de ? "Bestellung eingegangen!" : "Order Received!"}
        </h2>
        <p className="text-muted-foreground text-lg mb-4">
          {de ? "Wir melden uns innerhalb von 24 Stunden." : "We'll be in touch within 24 hours."}
        </p>
        <p className="text-2xl font-bold text-primary">
          {fmt(grand)}{isAT ? (de ? " (inkl. MwSt.)" : " (incl. VAT)") : ""}
        </p>
        <button onClick={() => { setSubmitted(false); setStep(0); }}
          className="mt-8 px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition">
          {de ? "Neue Bestellung" : "New Order"}
        </button>
      </div>
    </section>
  );

  return (
    <section id="order" className="py-24 sm:py-32 bg-secondary/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-3">
            {de ? "Jetzt bestellen" : "Place an Order"}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            {de ? "Bestellung aufgeben" : "Request Your Order"}
          </h2>
        </div>

        {/* Step bar */}
        <div className="flex mb-8 border border-border rounded-2xl overflow-hidden bg-secondary/30">
          {STEPS.map((s, i) => (
            <button key={i} type="button" onClick={() => i < step && setStep(i)}
              className={`flex-1 py-3 text-sm font-semibold transition-all flex flex-col items-center gap-1 ${
                step === i ? "bg-background text-primary" : i < step ? "text-green-600 cursor-pointer" : "text-muted-foreground"
              }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === i ? "bg-primary text-primary-foreground" : i < step ? "bg-green-100 text-green-700" : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </span>
              {s}
            </button>
          ))}
        </div>

        {/* ── STEP 0: PRODUCT ── */}
        {step === 0 && (
          <div className="space-y-4">
            {/* Customer type */}
            <div className="bg-background border border-border rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {de ? "Kundentyp" : "Customer Type"}
              </p>
              <div className="flex rounded-xl border border-border overflow-hidden">
                <button type="button" onClick={() => setIsAT(true)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all ${isAT ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  🇦🇹 {de ? "Österreich (+20% MwSt.)" : "Austria (+20% VAT)"}
                </button>
                <button type="button" onClick={() => setIsAT(false)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all ${!isAT ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  🇪🇺 {de ? "EU (ohne MwSt.)" : "EU (no VAT)"}
                </button>
              </div>
            </div>

            {/* Product */}
            <div className="bg-background border border-border rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {de ? "Produkt auswählen" : "Select Product"}
              </p>
              {/* Starter Box */}
              <div onClick={() => setProduct("starter")}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer mb-3 transition-all ${product === "starter" ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/20"}`}>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${product === "starter" ? "text-primary" : "text-foreground"}`}>Starter Box</p>
                  <p className="text-xs text-muted-foreground mt-0.5">61 {de ? "Schubladen" : "drawers"} · 305 {de ? "Gläser" : "glasses"} · QR-System</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{de ? "Empfohlen" : "Recommended"}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm text-primary">{fmt(STARTER_NET)}</p>
                  <p className="text-xs text-muted-foreground">{isAT ? (de ? "zzgl. MwSt." : "+ VAT") : (de ? "ohne MwSt." : "no VAT")}</p>
                </div>
              </div>
              {/* Custom */}
              <div onClick={() => setProduct("custom")}
                className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${product === "custom" ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/20"}`}>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${product === "custom" ? "text-primary" : "text-foreground"}`}>
                    {de ? "Individuelle Bestellung" : "Custom Order"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">K-Serie {fmt(K_PRICE)} · K+-Serie {fmt(K_PLUS_PRICE)}</p>
                </div>
              </div>
            </div>

            {/* Starter config */}
            {product === "starter" && (
              <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {de ? "Anzahl Starter Boxes" : "Number of Starter Boxes"}
                </p>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setStarterQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-3xl font-bold w-12 text-center">{starterQty}</span>
                  <button type="button" onClick={() => setStarterQty(q => Math.min(99, q + 1))}
                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition">
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-muted-foreground">= {starterQty * 61} {de ? "Schubladen" : "drawers"}, {starterQty * 305} {de ? "Gläser" : "glasses"}</span>
                </div>
                {/* Extra K toggle */}
                <button type="button" onClick={() => setShowExtra(v => !v)}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  {showExtra ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {showExtra ? (de ? "Extra K-Serien ausblenden" : "Hide extra K-Series") : (de ? "Zusätzliche K-Serien hinzufügen" : "Add extra K-Series")}
                </button>
                {showExtra && (
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-3">
                      {de ? "Zusätzliche Gläser neben der Starter Box:" : "Extra glasses alongside the Starter Box:"}
                    </p>
                    <KGrid selected={extraK}
                      onToggle={k => toggleK(extraK, setExtraK, k)}
                      onChangeQty={(k, d) => changeKQty(extraK, setExtraK, k, d)} />
                  </div>
                )}
                <SummaryBox
                  rows={[
                    { label: `Starter Box × ${starterQty}`, value: fmt(starterNet) },
                    ...(extraNet > 0 ? [{ label: de ? "Extra K-Serien" : "Extra K-Series", value: fmt(extraNet) }] : []),
                  ]}
                  vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined}
                  total={fmt(grand)}
                />
              </div>
            )}

            {/* Custom config */}
            {product === "custom" && (
              <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {de ? "K-Serien auswählen" : "Select K-Series"}
                </p>
                <KGrid selected={customK}
                  onToggle={k => toggleK(customK, setCustomK, k)}
                  onChangeQty={(k, d) => changeKQty(customK, setCustomK, k, d)} />
                {Object.keys(customK).length > 0 && (
                  <SummaryBox
                    rows={[{ label: de ? "Netto" : "Net", value: fmt(customNet) }]}
                    vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined}
                    total={fmt(grand)}
                  />
                )}
              </div>
            )}

            <Button type="button" onClick={() => setStep(1)} size="lg"
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold">
              {de ? "Weiter zu Kontaktdaten" : "Continue to Contact"} <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── STEP 1: CONTACT ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {de ? "Shop-Informationen" : "Shop Information"}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input value={shopName} onChange={e => setShopName(e.target.value)} placeholder={de ? "Shop-Name *" : "Shop Name *"} required className="h-11 rounded-xl" />
                <Input value={contactName} onChange={e => setContactName(e.target.value)} placeholder={de ? "Ansprechpartner *" : "Contact Person *"} required className="h-11 rounded-xl" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="E-Mail *" required className="h-11 rounded-xl" />
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder={de ? "Telefon / WhatsApp *" : "Phone / WhatsApp *"} required className="h-11 rounded-xl" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder={de ? "Stadt *" : "City *"} required className="h-11 rounded-xl" />
                <Input value={country} onChange={e => setCountry(e.target.value)} placeholder={de ? "Land *" : "Country *"} required className="h-11 rounded-xl" />
              </div>
            </div>

            {/* VAT Number */}
            <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                UID / VAT-{de ? "Nummer" : "Number"}{" "}
                <span className="normal-case font-normal tracking-normal text-muted-foreground">({de ? "optional" : "optional"})</span>
              </p>
              <div className="relative">
                <Input
                  value={vatNum}
                  onChange={e => onVatChange(e.target.value)}
                  placeholder={de ? "z.B. ATU12345678 oder DE123456789" : "e.g. ATU12345678 or DE123456789"}
                  className="h-11 rounded-xl pr-36"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-medium">
                  {vatStatus === "checking" && <><Loader className="w-3.5 h-3.5 animate-spin text-muted-foreground" /><span className="text-muted-foreground">{de ? "Prüfe..." : "Checking..."}</span></>}
                  {vatStatus === "valid"    && <><CheckCircle className="w-3.5 h-3.5 text-green-600" /><span className="text-green-600">{de ? "Gültig" : "Valid"}</span></>}
                  {vatStatus === "invalid"  && <><AlertCircle className="w-3.5 h-3.5 text-red-500" /><span className="text-red-500">{de ? "Ungültig" : "Invalid"}</span></>}
                  {vatStatus === "unknown"  && <span className="text-muted-foreground">{de ? "Nicht prüfbar" : "Unverifiable"}</span>}
                </div>
              </div>
              {vatStatus === "valid" && vatCompany && (
                <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                  <Building className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{vatCompany}</span>
                </div>
              )}
              {vatStatus === "invalid" && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{de ? "Keine gültige EU-Umsatzsteuer-ID gefunden." : "No valid EU VAT ID found."}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-muted-foreground" />
                {de ? "Prüfung über das offizielle EU-VIES-System" : "Validated via official EU VIES system"}
              </p>
            </div>

            <div className="bg-background border border-border rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {de ? "Nachricht" : "Message"} <span className="normal-case font-normal tracking-normal">({de ? "optional" : "optional"})</span>
              </p>
              <Textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder={de ? "Besondere Wünsche, Lieferhinweise..." : "Special requests, delivery notes..."}
                maxLength={1000} rows={3} className="rounded-xl" />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(0)} size="lg" className="flex-1 h-12 rounded-2xl">
                <ArrowLeft className="mr-1 w-4 h-4" /> {de ? "Zurück" : "Back"}
              </Button>
              <Button type="button" onClick={() => setStep(2)} size="lg" className="flex-[2] h-12 rounded-2xl bg-primary text-primary-foreground font-bold">
                {de ? "Zur Übersicht" : "Review Order"} <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: REVIEW ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-background border border-border rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {de ? "Bestellübersicht" : "Order Summary"}
              </p>
              {product === "starter" ? (
                <SummaryBox
                  rows={[
                    { label: `Starter Box × ${starterQty}`, value: fmt(starterNet) },
                    ...(extraNet > 0 ? [{ label: de ? "Extra K-Serien" : "Extra K-Series", value: fmt(extraNet) }] : []),
                  ]}
                  vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined}
                  total={fmt(grand)}
                />
              ) : (
                <SummaryBox
                  rows={Object.entries(customK).map(([k, q]) => ({ label: `${k} × ${q}`, value: fmt(up(k) * q) }))}
                  vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined}
                  total={fmt(grand)}
                />
              )}
            </div>

            <div className="bg-background border border-border rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {de ? "Kontaktdaten" : "Contact Details"}
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>🏪 <span className="text-foreground font-medium">{shopName}</span></p>
                <p>👤 {contactName}</p>
                <p>📧 {email}</p>
                <p>📞 {phone}</p>
                <p>📍 {city}, {country}</p>
                {vatNum && (
                  <p className="flex items-center gap-2">
                    🏢 UID: {vatNum}
                    {vatStatus === "valid"   && <span className="text-green-600 text-xs">✅ {de ? "Gültig" : "Valid"}</span>}
                    {vatStatus === "invalid" && <span className="text-red-500 text-xs">❌ {de ? "Ungültig" : "Invalid"}</span>}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} size="lg" className="flex-1 h-12 rounded-2xl">
                <ArrowLeft className="mr-1 w-4 h-4" /> {de ? "Zurück" : "Back"}
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={loading} size="lg"
                className="flex-[2] h-12 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
                {loading ? (de ? "Wird gesendet…" : "Sending…") : (de ? "Bestellung absenden" : "Submit Order")}
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Order;
