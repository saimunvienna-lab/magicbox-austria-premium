import { useState, useRef } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Package, Settings, Plus, Minus, CheckCircle, Building,
  AlertCircle, Loader, ShieldCheck, Sparkles, MapPin, Phone, Mail, User, Store,
  Pencil, Lock, Globe2, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

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
const FULL_NET     = 449.90;
const K_PRICE      = 7.50;
const K_PLUS_PRICE = 9.90;
const VAT_RATE     = 0.20;
const FORMSPREE    = "https://formspree.io/f/mzdokerz";

type KSel = Record<string, number>;
type VatStatus = "idle" | "checking" | "valid" | "invalid" | "unknown";

const fmt    = (n: number) => "€" + n.toFixed(2).replace(".", ",");
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

const inputCls =
  "h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/40 " +
  "focus-visible:ring-2 focus-visible:ring-primary-glow/60 focus-visible:border-primary-glow/40 transition-all";

const KGrid = ({ selected, onToggle, onChangeQty }: {
  selected: KSel;
  onToggle: (k: string) => void;
  onChangeQty: (k: string, d: number) => void;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] gap-1.5">
      {K_ALL.map(k => {
        const active = !!selected[k];
        return (
          <motion.button key={k} type="button" whileTap={{ scale: 0.94 }} onClick={() => onToggle(k)}
            className={`py-2.5 px-1 rounded-xl border text-center transition-all ${
              active
                ? "border-primary-glow/60 bg-primary-glow/15 text-primary-glow shadow-[0_0_0_1px_hsl(var(--primary-glow)/0.3)]"
                : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
            }`}>
            <span className="block text-xs font-semibold tracking-wide">{k}</span>
            <span className="block text-[10px] mt-0.5 opacity-70">{fmt(up(k))}</span>
          </motion.button>
        );
      })}
    </div>
    {Object.keys(selected).length > 0 && (
      <div className="space-y-2 pt-3 border-t border-white/10">
        {Object.entries(selected).map(([k, q]) => (
          <motion.div key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <span className="text-sm font-semibold w-16 text-white">{k}</span>
            <span className="text-xs text-white/50 flex-1">
              {fmt(up(k))} × {q} = <span className="text-primary-glow font-medium">{fmt(up(k) * q)}</span>
            </span>
            <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
              <button type="button" onClick={() => onChangeQty(k, -1)} className="w-8 h-8 grid place-items-center text-white/70 hover:bg-white/10 transition">−</button>
              <span className="w-8 text-center text-sm font-medium text-white">{q}</span>
              <button type="button" onClick={() => onChangeQty(k, 1)} className="w-8 h-8 grid place-items-center text-white/70 hover:bg-white/10 transition">+</button>
            </div>
          </motion.div>
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
  <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-2 mt-4">
    {rows.map((r, i) => (
      <div key={i} className="flex justify-between text-sm">
        <span className="text-white/60">{r.label}</span>
        <span className="text-white font-medium">{r.value}</span>
      </div>
    ))}
    {vatRow && (
      <div className="flex justify-between text-sm text-amber-300/90">
        <span>{vatRow.label}</span><span>{vatRow.value}</span>
      </div>
    )}
    <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-white/10">
      <span className="text-white/70 text-sm font-medium">Gesamt / Total</span>
      <span className="font-display text-2xl font-bold text-gradient">{total}</span>
    </div>
  </div>
);

const Card = ({ children, label, onEdit }: { children: React.ReactNode; label?: string; onEdit?: () => void }) => (
  <div className="relative rounded-3xl glass-dark p-6 sm:p-7 overflow-hidden">
    {label && (
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-glow/90">{label}</p>
        {onEdit && (
          <button onClick={onEdit} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-primary-glow transition">
            <Pencil className="w-3 h-3" /> Edit
          </button>
        )}
      </div>
    )}
    {children}
  </div>
);

const stepVariants = {
  enter:  { opacity: 0, y: 24, filter: "blur(6px)" },
  center: { opacity: 1, y: 0,  filter: "blur(0px)" },
  exit:   { opacity: 0, y: -24, filter: "blur(6px)" },
};

const ReviewRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="text-primary-glow mt-0.5">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-widest text-white/40">{label}</p>
      <p className="text-white truncate">{value}</p>
    </div>
  </div>
);

const PrimaryNext = ({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) => (
  <Button type="button" onClick={onClick} disabled={disabled} size="lg"
    className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-deep font-bold text-base hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none">
    {children} <ArrowRight className="ml-1.5 w-4 h-4" />
  </Button>
);

const SecondaryBack = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <Button type="button" variant="outline" onClick={onClick} size="lg"
    className="flex-1 h-14 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
    <ArrowLeft className="mr-1 w-4 h-4" /> {children}
  </Button>
);

const SubmitBtn = ({ children, loading, onClick }: { children: React.ReactNode; loading: boolean; onClick: () => void }) => (
  <Button type="button" onClick={onClick} disabled={loading} size="lg"
    className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-deep font-bold text-base shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60">
    {loading
      ? <><Loader className="w-4 h-4 animate-spin mr-2" /> Sending…</>
      : <>{children} <ArrowRight className="ml-1.5 w-4 h-4" /></>
    }
  </Button>
);

const Order = () => {
  const { lang }  = useI18n();
  const { toast } = useToast();
  const de        = lang === "de";

  const [step, setStep]           = useState(0);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isAT, setIsAT]             = useState(true);
  const [product, setProduct]       = useState<"starter" | "custom">("starter");
  const [starterQty, setStarterQty] = useState(1);
  const [showExtra, setShowExtra]   = useState(false);
  const [extraK, setExtraK]         = useState<KSel>({});
  const [customK, setCustomK]       = useState<KSel>({});

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

  const starterNet    = STARTER_NET * starterQty;
  const extraNet      = Object.entries(extraK).reduce((a, [k, q]) => a + up(k) * q, 0);
  const starterTotNet = starterNet + extraNet;
  const customNet     = Object.entries(customK).reduce((a, [k, q]) => a + up(k) * q, 0);
  const activeNet     = product === "starter" ? starterTotNet : customNet;
  const vat           = isAT ? activeNet * VAT_RATE : 0;
  const grand         = activeNet + vat;

  const toggleK = (sel: KSel, setSel: (v: KSel) => void, k: string) => {
    const next = { ...sel };
    if (next[k]) delete next[k]; else next[k] = 1;
    setSel(next);
  };
  const changeKQty = (sel: KSel, setSel: (v: KSel) => void, k: string, d: number) =>
    setSel({ ...sel, [k]: Math.max(1, Math.min(999, (sel[k] || 1) + d)) });

  const checkVat = async (raw: string) => {
    const cc  = raw.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
    const num = raw.replace(/[A-Za-z\s-]/g, "");
    if (!cc || !num) { setVatStatus("idle"); return; }
    setVatStatus("checking");
    try {
      const res  = await fetch(`https://viesapi.eu/api/search/${cc}${num}`);
      const data = await res.json();
      if (data?.valid === true) { setVatStatus("valid"); setVatCompany(data.traderName || ""); }
      else { setVatStatus("invalid"); setVatCompany(""); }
    } catch { setVatStatus("unknown"); }
  };

  const onVatChange = (v: string) => {
    setVatNum(v); setVatStatus("idle"); setVatCompany("");
    if (vatTimer.current) clearTimeout(vatTimer.current);
    if (v.trim().length > 4) vatTimer.current = setTimeout(() => checkVat(v.trim()), 900);
  };

  const canContinueStep0 = product === "starter" || (product === "custom" && Object.keys(customK).length > 0);
  const contactValid = contactSchema.safeParse({
    shop_name: shopName, contact_name: contactName, email, phone, city, country,
    vat_number: vatNum || undefined, message: message || undefined,
  }).success;

  // ── WhatsApp notification via CallMeBot ──
  const sendWhatsAppNotification = async (orderData: {
    shopName: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    productLabel: string;
    grand: number;
    vatNum: string;
    isAT: boolean;
  }) => {
    const callmebotPhone = import.meta.env.VITE_CALLMEBOT_PHONE;
    const callmebotApikey = import.meta.env.VITE_CALLMEBOT_APIKEY;

    if (!callmebotPhone || !callmebotApikey) {
      console.warn("CallMeBot credentials missing");
      return;
    }

    const message = `🔔 Neue MagicBox Bestellung

📦 ${orderData.shopName}
📍 ${orderData.city}, ${orderData.country}
🌍 ${orderData.isAT ? "🇦🇹 Österreich" : "🇪🇺 EU"}
📧 ${orderData.email}
📞 ${orderData.phone}
${orderData.vatNum ? `🆔 ${orderData.vatNum}` : ""}

💰 ${fmt(orderData.grand)}

Admin: saidamagicbox.com/admin`;

    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${callmebotPhone}&text=${encodeURIComponent(message)}&apikey=${callmebotApikey}`;
      await fetch(url, { mode: "no-cors" });
    } catch (error) {
      console.error("WhatsApp notification failed:", error);
      // Silent fail — order already saved
    }
  };

  const handleSubmit = async () => {
    if (!contactValid) {
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

    const productLabel = product === "starter"
      ? `Starter Box ×${starterQty}${Object.keys(extraK).length ? ` + Extra: ${Object.keys(extraK).join(", ")}` : ""}`
      : Object.entries(customK).map(([k, q]) => `${k} × ${q}`).join(", ");

    const { error } = await supabase.from("orders").insert([{
      shop_name: shopName, contact_name: contactName,
      email, phone, city, country,
      vat_number: vatNum || null,
      message: message || null,
      k_series: productLabel,
      quantity: product === "starter" ? starterQty : Object.values(customK).reduce((a, b) => a + b, 0),
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
      setLoading(false);
      return;
    }

    // ── Email notification via Formspree ──
    try {
      await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: `🛒 New Order — ${shopName}`,
          shop_name:  shopName,
          contact:    contactName,
          email:      email,
          phone:      phone,
          location:   `${city}, ${country}`,
          product:    productLabel,
          total:      fmt(grand),
          vat:        isAT ? "Yes (20%)" : "No",
          vat_number: vatNum || "—",
          message:    message || "—",
        }),
      });
    } catch { /* silent — order already saved */ }

    // ── WhatsApp notification via CallMeBot ──
    await sendWhatsAppNotification({
      shopName,
      city,
      country,
      email,
      phone,
      productLabel,
      grand,
      vatNum,
      isAT,
    });

    setSubmitted(true);
    setLoading(false);
  };

  const STEPS = [de ? "Produkt" : "Product", de ? "Kontakt" : "Contact", de ? "Übersicht" : "Review"];
  const progress = submitted ? 100 : ((step + 1) / STEPS.length) * 100;

  // ── SUCCESS ──
  if (submitted) {
    const wa = `https://wa.me/436769617723?text=${encodeURIComponent(
      (de ? "Hallo SAIDA, ich habe gerade eine Bestellung abgesendet." : "Hello SAIDA, I just submitted an order.") + ` (${shopName})`
    )}`;
    return (
      <section id="order" className="relative py-28 sm:py-36 bg-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary-glow/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
            className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-primary-glow/30 blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-glow to-primary grid place-items-center shadow-glow">
              <motion.svg viewBox="0 0 50 50" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M14 26 L22 34 L37 17" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }} />
              </motion.svg>
            </div>
          </motion.div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-primary-glow mb-3">{de ? "Bestätigt" : "Confirmed"}</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {de ? "Vielen Dank für Ihre Anfrage" : "Thank you for your request"}
          </h2>
          <p className="text-white/60 text-lg max-w-md mx-auto mb-8">
            {de ? "Unser Team wird Sie in Kürze kontaktieren." : "Our team will reach out to you shortly."}
          </p>
          <div className="inline-flex items-center gap-3 glass-dark rounded-2xl px-6 py-4 mb-10">
            <span className="text-white/60 text-sm">{de ? "Bestellsumme" : "Order total"}</span>
            <span className="font-display text-2xl font-bold text-gradient">
              {fmt(grand)}{isAT ? (de ? " inkl. MwSt." : " incl. VAT") : ""}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={wa} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white font-semibold transition-all hover:scale-[1.02]">
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
            <button onClick={() => { setSubmitted(false); setStep(0); setExtraK({}); setCustomK({}); setStarterQty(1); }}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl glass-dark text-white font-semibold hover:bg-white/10 transition">
              {de ? "Neue Anfrage" : "New request"}
            </button>
            <a href="/" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-white/70 hover:text-white transition">
              {de ? "Zur Startseite" : "Back to home"} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> {de ? "Sichere Datenübertragung" : "Secure data transfer"}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Designed in Austria</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Professional Dealer System</span>
          </div>
        </motion.div>
      </section>
    );
  }

  // ── WIZARD ──
  return (
    <section id="order" className="relative py-24 sm:py-32 bg-deep text-white overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary-glow/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 pb-28 lg:pb-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/80">Dealer Onboarding</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {de ? "Ihre Bestellung" : "Your Order"}
          </h2>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">
            {de ? "Premium B2B Anfrageprozess. In 3 Schritten zur SAIDA Partnerschaft."
                : "Premium B2B request process. Three steps to your SAIDA partnership."}
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4 px-1">
            {STEPS.map((s, i) => {
              const done = i < step; const active = i === step;
              return (
                <button key={i} type="button" onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2.5 ${i < step ? "cursor-pointer" : "cursor-default"}`}>
                  <motion.span animate={{ scale: active ? 1.05 : 1 }}
                    className={`relative w-8 h-8 rounded-full grid place-items-center text-xs font-bold transition-all ${
                      done ? "bg-primary-glow text-primary-deep" : active ? "bg-white text-primary-deep shadow-glow" : "bg-white/5 text-white/40 border border-white/10"
                    }`}>
                    {done ? <Check className="w-4 h-4" /> : i + 1}
                    {active && (
                      <motion.span className="absolute inset-0 rounded-full ring-2 ring-primary-glow/50"
                        animate={{ scale: [1, 1.4], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
                    )}
                  </motion.span>
                  <span className={`text-xs sm:text-sm font-semibold transition-colors ${active ? "text-white" : done ? "text-primary-glow" : "text-white/40"}`}>{s}</span>
                </button>
              );
            })}
          </div>
          <div className="relative h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-glow"
              initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 0 */}
          {step === 0 && (
            <motion.div key="step-0" variants={stepVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">

              <Card label={de ? "Kundentyp" : "Customer Type"}>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button type="button" onClick={() => setIsAT(true)}
                    className={`py-3 text-sm font-semibold rounded-lg transition-all ${isAT ? "bg-white text-primary-deep shadow-soft" : "text-white/60 hover:text-white"}`}>
                    🇦🇹 {de ? "Österreich (+20% MwSt.)" : "Austria (+20% VAT)"}
                  </button>
                  <button type="button" onClick={() => setIsAT(false)}
                    className={`py-3 text-sm font-semibold rounded-lg transition-all ${!isAT ? "bg-white text-primary-deep shadow-soft" : "text-white/60 hover:text-white"}`}>
                    🇪🇺 {de ? "EU (ohne MwSt.)" : "EU (no VAT)"}
                  </button>
                </div>
              </Card>

              <Card label={de ? "Produkt auswählen" : "Select Product"}>
                <div className="space-y-3">
                  <motion.div whileHover={{ y: -2 }} onClick={() => setProduct("starter")}
                    className={`flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${product === "starter" ? "border-primary-glow/60 bg-primary-glow/10" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center flex-shrink-0 shadow-glow">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white">Starter Box</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-glow/15 text-primary-glow font-semibold">{de ? "Empfohlen" : "Recommended"}</span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">66 {de ? "Schubladen" : "drawers"} · 330 {de ? "Gläser" : "glasses"} · QR-System</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-lg font-bold text-white">{fmt(STARTER_NET)}</p>
                      <p className="text-[10px] text-white/50">{isAT ? (de ? "zzgl. MwSt." : "+ VAT") : (de ? "ohne MwSt." : "no VAT")}</p>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} onClick={() => setProduct("custom")}
                    className={`flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${product === "custom" ? "border-primary-glow/60 bg-primary-glow/10" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 grid place-items-center flex-shrink-0">
                      <Settings className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{de ? "Individuelle Bestellung" : "Custom Order"}</p>
                      <p className="text-xs text-white/60 mt-1">K-Serie {fmt(K_PRICE)} · K+-Serie {fmt(K_PLUS_PRICE)}</p>
                    </div>
                  </motion.div>
                </div>
              </Card>

              <AnimatePresence mode="wait">
                {product === "starter" && (
                  <motion.div key="starter-cfg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                    <Card label={de ? "Anzahl Starter Boxes" : "Number of Starter Boxes"}>
                      <div className="flex items-center gap-5">
                        <button type="button" onClick={() => setStarterQty(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:bg-white/10 transition"><Minus className="w-4 h-4" /></button>
                        <span className="font-display text-4xl font-bold w-14 text-center text-white tabular-nums">{starterQty}</span>
                        <button type="button" onClick={() => setStarterQty(q => Math.min(99, q + 1))} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:bg-white/10 transition"><Plus className="w-4 h-4" /></button>
                        <span className="text-sm text-white/60">= {starterQty * 66} {de ? "Schubladen" : "drawers"}, {starterQty * 330} {de ? "Gläser" : "glasses"}</span>
                      </div>
                      <button type="button" onClick={() => setShowExtra(v => !v)}
                        className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-glow hover:opacity-80 transition">
                        {showExtra ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showExtra ? (de ? "Extra K-Serien ausblenden" : "Hide extra K-Series") : (de ? "Zusätzliche K-Serien hinzufügen" : "Add extra K-Series")}
                      </button>
                      <AnimatePresence>
                        {showExtra && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                              <p className="text-xs text-white/60 mb-3">{de ? "Zusätzliche Gläser neben der Starter Box:" : "Extra glasses alongside the Starter Box:"}</p>
                              <KGrid selected={extraK} onToggle={k => toggleK(extraK, setExtraK, k)} onChangeQty={(k, d) => changeKQty(extraK, setExtraK, k, d)} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <SummaryBox
                        rows={[
                          { label: `Starter Box × ${starterQty}`, value: fmt(starterNet) },
                          ...(extraNet > 0 ? [{ label: de ? "Extra K-Serien" : "Extra K-Series", value: fmt(extraNet) }] : []),
                        ]}
                        vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined}
                        total={fmt(grand)}
                      />
                    </Card>
                  </motion.div>
                )}
                {product === "custom" && (
                  <motion.div key="custom-cfg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                    <Card label={de ? "K-Serien auswählen" : "Select K-Series"}>
                      <KGrid selected={customK} onToggle={k => toggleK(customK, setCustomK, k)} onChangeQty={(k, d) => changeKQty(customK, setCustomK, k, d)} />
                      {Object.keys(customK).length > 0 && (
                        <SummaryBox rows={[{ label: de ? "Netto" : "Net", value: fmt(customNet) }]}
                          vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined} total={fmt(grand)} />
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="hidden lg:block">
                <PrimaryNext disabled={!canContinueStep0} onClick={() => setStep(1)}>
                  {de ? "Weiter zu Kontaktdaten" : "Continue to Contact"}
                </PrimaryNext>
              </div>
            </motion.div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step-1" variants={stepVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
              <Card label={de ? "Shop-Informationen" : "Shop Information"}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input value={shopName}    onChange={e => setShopName(e.target.value)}    placeholder={de ? "Shop-Name *" : "Shop Name *"} required maxLength={150} className={inputCls} />
                  <Input value={contactName} onChange={e => setContactName(e.target.value)} placeholder={de ? "Ansprechpartner *" : "Contact Person *"} required maxLength={100} className={inputCls} />
                  <Input value={email}       onChange={e => setEmail(e.target.value)}       type="email" placeholder="E-Mail *" required maxLength={255} className={inputCls} />
                  <Input value={phone}       onChange={e => setPhone(e.target.value)}       placeholder={de ? "Telefon / WhatsApp *" : "Phone / WhatsApp *"} required maxLength={50} className={inputCls} />
                  <Input value={city}        onChange={e => setCity(e.target.value)}        placeholder={de ? "Stadt *" : "City *"} required maxLength={100} className={inputCls} />
                  <Input value={country}     onChange={e => setCountry(e.target.value)}     placeholder={de ? "Land *" : "Country *"} required maxLength={80} className={inputCls} />
                </div>
              </Card>

              <Card>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-glow/90 mb-3">
                  UID / VAT-{de ? "Nummer" : "Number"} <span className="normal-case font-normal tracking-normal text-white/40">({de ? "optional" : "optional"})</span>
                </p>
                <div className="relative">
                  <Input value={vatNum} onChange={e => onVatChange(e.target.value)}
                    placeholder={de ? "z.B. ATU12345678 oder DE123456789" : "e.g. ATU12345678 or DE123456789"}
                    className={`${inputCls} pr-36`} maxLength={30} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-medium">
                    {vatStatus === "checking" && <><Loader className="w-3.5 h-3.5 animate-spin text-white/60" /><span className="text-white/60">{de ? "Prüfe..." : "Checking..."}</span></>}
                    {vatStatus === "valid"    && <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">{de ? "Gültig" : "Valid"}</span></>}
                    {vatStatus === "invalid"  && <><AlertCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400">{de ? "Ungültig" : "Invalid"}</span></>}
                    {vatStatus === "unknown"  && <span className="text-white/50">{de ? "Nicht prüfbar" : "Unverifiable"}</span>}
                  </div>
                </div>
                {vatStatus === "valid" && vatCompany && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <Building className="w-3.5 h-3.5 flex-shrink-0" /><span>{vatCompany}</span>
                  </motion.div>
                )}
                {vatStatus === "invalid" && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{de ? "Keine gültige EU-Umsatzsteuer-ID gefunden." : "No valid EU VAT ID found."}</span>
                  </div>
                )}
                <p className="mt-3 text-xs text-white/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {de ? "Prüfung über das offizielle EU-VIES-System" : "Validated via official EU VIES system"}
                </p>
              </Card>

              <Card>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-glow/90 mb-3">
                  {de ? "Nachricht" : "Message"} <span className="normal-case font-normal tracking-normal text-white/40">({de ? "optional" : "optional"})</span>
                </p>
                <Textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder={de ? "Besondere Wünsche, Lieferhinweise..." : "Special requests, delivery notes..."}
                  maxLength={1000} rows={3} className={`${inputCls} h-auto py-3`} />
              </Card>

              <div className="hidden lg:flex gap-3">
                <SecondaryBack onClick={() => setStep(0)}>{de ? "Zurück" : "Back"}</SecondaryBack>
                <PrimaryNext disabled={!contactValid} onClick={() => setStep(2)}>{de ? "Zur Übersicht" : "Review Order"}</PrimaryNext>
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step-2" variants={stepVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">
              <Card label={de ? "Bestellübersicht" : "Order Summary"} onEdit={() => setStep(0)}>
                {product === "starter" ? (
                  <SummaryBox
                    rows={[{ label: `Starter Box × ${starterQty}`, value: fmt(starterNet) }, ...(extraNet > 0 ? [{ label: de ? "Extra K-Serien" : "Extra K-Series", value: fmt(extraNet) }] : [])]}
                    vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined} total={fmt(grand)} />
                ) : (
                  <SummaryBox rows={Object.entries(customK).map(([k, q]) => ({ label: `${k} × ${q}`, value: fmt(up(k) * q) }))}
                    vatRow={isAT ? { label: de ? "MwSt. 20%" : "VAT 20%", value: fmt(vat) } : undefined} total={fmt(grand)} />
                )}
              </Card>

              <Card label={de ? "Kontaktdaten" : "Contact Details"} onEdit={() => setStep(1)}>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <ReviewRow icon={<Store className="w-4 h-4" />}   label={de ? "Shop" : "Shop"}      value={shopName} />
                  <ReviewRow icon={<User className="w-4 h-4" />}    label={de ? "Kontakt" : "Contact"} value={contactName} />
                  <ReviewRow icon={<Mail className="w-4 h-4" />}    label="E-Mail"                     value={email} />
                  <ReviewRow icon={<Phone className="w-4 h-4" />}   label={de ? "Telefon" : "Phone"}   value={phone} />
                  <ReviewRow icon={<MapPin className="w-4 h-4" />}  label={de ? "Standort" : "Location"} value={`${city}, ${country}`} />
                  {vatNum && (
                    <ReviewRow icon={<Building className="w-4 h-4" />} label="UID" value={
                      <span className="inline-flex items-center gap-2">
                        {vatNum}
                        {vatStatus === "valid"   && <span className="text-emerald-400 text-xs">✓ {de ? "Gültig" : "Valid"}</span>}
                        {vatStatus === "invalid" && <span className="text-red-400 text-xs">✗ {de ? "Ungültig" : "Invalid"}</span>}
                      </span>
                    } />
                  )}
                </div>
                {message && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{de ? "Nachricht" : "Message"}</p>
                    <p className="text-sm text-white/80 whitespace-pre-wrap">{message}</p>
                  </div>
                )}
              </Card>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: <Lock className="w-4 h-4" />,   text: de ? "DSGVO-konform" : "GDPR Compliant" },
                  { icon: <MapPin className="w-4 h-4" />, text: "Designed in Austria" },
                  { icon: <Globe2 className="w-4 h-4" />, text: de ? "EU B2B Versand" : "EU B2B Shipping" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 glass-dark rounded-xl px-4 py-3 text-xs text-white/70">
                    <span className="text-primary-glow">{t.icon}</span>{t.text}
                  </div>
                ))}
              </div>

              <div className="hidden lg:flex gap-3">
                <SecondaryBack onClick={() => setStep(1)}>{de ? "Zurück" : "Back"}</SecondaryBack>
                <SubmitBtn loading={loading} onClick={handleSubmit}>{de ? "Bestellung absenden" : "Submit Order"}</SubmitBtn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-[hsl(222,80%,8%)]/90 border-t border-white/10 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="mx-auto max-w-3xl flex items-center gap-2">
          {step > 0 && (
            <button type="button" onClick={() => setStep(s => s - 1)}
              className="h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 grid place-items-center">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {step < 2 && (
            <button type="button" disabled={step === 0 ? !canContinueStep0 : !contactValid} onClick={() => setStep(s => s + 1)}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-deep font-bold disabled:opacity-50 shadow-glow flex items-center justify-center gap-2">
              {step === 0 ? (de ? "Weiter" : "Continue") : (de ? "Übersicht" : "Review")} <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === 2 && (
            <button type="button" disabled={loading} onClick={handleSubmit}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-deep font-bold disabled:opacity-60 shadow-glow flex items-center justify-center gap-2">
              {loading
                ? <><Loader className="w-4 h-4 animate-spin" /> {de ? "Wird gesendet…" : "Sending…"}</>
                : <>{de ? "Absenden" : "Submit"} <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Order;
