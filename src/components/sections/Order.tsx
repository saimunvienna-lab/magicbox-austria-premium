import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

const K_PLUS = ["K14+","K15+","K16+","K17+","K18+","K19+","K20+","K55+","K56+","K59+","K60+","K62+","K63+","K64+","K65+"];

const K_ALL = [
  "K01","K02","K03","K04","K05","K06","K07","K08","K09","K10",
  "K11","K12","K13","K13-1","K14+","K15+","K16+","K17+","K18+","K19+",
  "K20+","K21","K22","K23","K24","K25","K26","K27","K28","K29",
  "K30","K31","K32","K33","K34","K35","K36","K37","K38","K39",
  "K40","K41","K42","K43","K44","K45","K46","K47","K48","K49",
  "K50","K51","K52","K53","K54","K55+","K56+","K57","K58","K59+",
  "K60+","K61","K62+","K63+","K64+","K65+",
];

const STARTER_NET = 399.90;
const K_PRICE = 6.25;
const K_PLUS_PRICE = 9.90;
const VAT = 0.20;

type KSelected = Record<string, number>;

const fmt = (n: number) => "€" + n.toFixed(2).replace(".", ",");

const contactSchema = z.object({
  shop_name:    z.string().trim().min(1).max(150),
  contact_name: z.string().trim().min(1).max(100),
  email:        z.string().trim().email().max(255),
  phone:        z.string().trim().min(1).max(50),
  city:         z.string().trim().min(1).max(100),
  country:      z.string().trim().min(1).max(80),
  message:      z.string().trim().max(1000).optional(),
});

const Order = () => {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const de = lang === "de";

  const [loading, setLoading]     = useState(false);
  const [isAT, setIsAT]           = useState(true);
  const [product, setProduct]     = useState<"starter" | "custom">("starter");
  const [starterQty, setStarterQty] = useState(1);
  const [selected, setSelected]   = useState<KSelected>({});

  const isPlus = (k: string) => K_PLUS.includes(k);
  const unitPrice = (k: string) => isPlus(k) ? K_PLUS_PRICE : K_PRICE;

  const starterNet  = STARTER_NET * starterQty;
  const starterVat  = isAT ? starterNet * VAT : 0;
  const starterTotal = starterNet + starterVat;

  const customNet   = Object.entries(selected).reduce((a, [k, q]) => a + unitPrice(k) * q, 0);
  const customVat   = isAT ? customNet * VAT : 0;
  const customTotal = customNet + customVat;

  const toggleK = (k: string) => {
    setSelected(prev => {
      const next = { ...prev };
      if (next[k]) delete next[k]; else next[k] = 1;
      return next;
    });
  };

  const changeKQty = (k: string, d: number) => {
    setSelected(prev => ({ ...prev, [k]: Math.max(1, Math.min(999, (prev[k] || 1) + d)) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse(Object.fromEntries(fd.entries()));

    if (!parsed.success) {
      toast({ title: de ? "Bitte alle Felder prüfen" : "Please check all fields", variant: "destructive" });
      return;
    }

    if (product === "custom" && Object.keys(selected).length === 0) {
      toast({ title: de ? "Bitte K-Serien auswählen" : "Please select K-Series", variant: "destructive" });
      return;
    }

    setLoading(true);

    const items = product === "starter"
      ? [{ type: "starter_box", qty: starterQty, unit_price: STARTER_NET }]
      : Object.entries(selected).map(([k, q]) => ({ k_series: k, qty: q, unit_price: unitPrice(k) }));

    const net   = product === "starter" ? starterNet : customNet;
    const vat   = isAT ? net * VAT : 0;
    const total = net + vat;

    const { error } = await supabase.from("orders").insert([{
      ...parsed.data,
      k_series:     product === "starter" ? "Starter Box" : Object.keys(selected).join(", "),
      quantity:     product === "starter" ? starterQty : Object.values(selected).reduce((a, b) => a + b, 0),
      product_type: product,
      items,
      vat_applied:  isAT,
      net_total:    net,
      vat_amount:   vat,
      grand_total:  total,
    }]);

    if (error) {
      toast({
        title: de ? "Fehler beim Senden" : "Something went wrong",
        description: de ? "Bitte versuche es erneut." : "Please try again.",
        variant: "destructive",
      });
    } else {
      (e.target as HTMLFormElement).reset();
      setSelected({});
      setStarterQty(1);
      toast({
        title: de ? "Bestellung eingegangen! ✅" : "Order received! ✅",
        description: de
          ? `Gesamtbetrag: ${fmt(total)}${isAT ? " (inkl. MwSt.)" : ""}. Wir melden uns innerhalb von 24 Stunden.`
          : `Total: ${fmt(total)}${isAT ? " (incl. VAT)" : ""}. We'll be in touch within 24 hours.`,
      });
    }
    setLoading(false);
  };

  return (
    <section id="order" className="py-24 sm:py-32 bg-secondary/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary mb-4">
            {de ? "Jetzt bestellen" : "Place an Order"}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            {de ? "Bestellung aufgeben" : "Request Your Order"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            {de
              ? "Wählen Sie Ihr Produkt und füllen Sie das Formular aus."
              : "Choose your product and fill out the form below."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">

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

          {/* Product selection */}
          <div className="bg-background border border-border rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {de ? "Produkt auswählen" : "Select Product"}
            </p>

            {/* Starter Box */}
            <div onClick={() => setProduct("starter")}
              className={`flex gap-4 p-4 rounded-xl border cursor-pointer mb-3 transition-all ${product === "starter" ? "border-primary/40 bg-primary/5" : "border-border hover:border-border"}`}>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${product === "starter" ? "text-primary" : "text-foreground"}`}>
                  Starter Box
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  61 {de ? "Schubladen" : "drawers"} · 5 {de ? "Gläser/Schublade" : "glasses/drawer"} · 305 {de ? "Gläser gesamt" : "glasses total"}
                </p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  {de ? "Empfohlen" : "Recommended"}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm text-primary">{fmt(STARTER_NET)}</p>
                <p className="text-xs text-muted-foreground">{isAT ? (de ? "zzgl. MwSt." : "+ VAT") : (de ? "ohne MwSt." : "no VAT")}</p>
              </div>
            </div>

            {/* Custom */}
            <div onClick={() => setProduct("custom")}
              className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all ${product === "custom" ? "border-primary/40 bg-primary/5" : "border-border hover:border-border"}`}>
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${product === "custom" ? "text-primary" : "text-foreground"}`}>
                  {de ? "Individuelle Bestellung" : "Custom Order"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  K-Serie {fmt(K_PRICE)} · K+-Serie {fmt(K_PLUS_PRICE)}
                </p>
              </div>
            </div>
          </div>

          {/* Starter Box options */}
          {product === "starter" && (
            <div className="bg-background border border-border rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {de ? "Anzahl Starter Boxes" : "Number of Starter Boxes"}
              </p>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setStarterQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-xl font-light hover:bg-secondary transition">−</button>
                <span className="text-2xl font-bold text-foreground w-12 text-center">{starterQty}</span>
                <button type="button" onClick={() => setStarterQty(q => Math.min(99, q + 1))}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-xl font-light hover:bg-secondary transition">+</button>
                <span className="text-sm text-muted-foreground ml-2">
                  = {starterQty * 61} {de ? "Schubladen" : "drawers"}, {starterQty * 305} {de ? "Gläser" : "glasses"}
                </span>
              </div>
              <div className="mt-4 bg-secondary/50 rounded-xl p-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Starter Box × {starterQty}</span>
                  <span>{fmt(starterNet)}</span>
                </div>
                {isAT && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>{de ? "MwSt. 20%" : "VAT 20%"}</span>
                    <span>{fmt(starterVat)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>{de ? "Gesamt" : "Total"}</span>
                  <span className="text-primary">{fmt(starterTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Custom order */}
          {product === "custom" && (
            <div className="space-y-4">
              <div className="bg-background border border-border rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  {de ? "K-Serien auswählen" : "Select K-Series"}
                </p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5">
                  {K_ALL.map(k => (
                    <button key={k} type="button" onClick={() => toggleK(k)}
                      className={`py-2 px-1 rounded-lg border text-center transition-all ${selected[k] ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border"}`}>
                      <span className="block text-xs font-semibold">{k}</span>
                      <span className="block text-[10px] mt-0.5 opacity-70">{fmt(unitPrice(k))}</span>
                    </button>
                  ))}
                </div>
              </div>

              {Object.keys(selected).length > 0 && (
                <div className="bg-background border border-border rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    {de ? "Menge & Berechnung" : "Quantity & Calculation"}
                  </p>
                  <div className="space-y-3">
                    {Object.entries(selected).map(([k, q]) => (
                      <div key={k} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground w-16">{k}</span>
                        <span className="text-xs text-muted-foreground flex-1">{fmt(unitPrice(k))} × {q} = {fmt(unitPrice(k) * q)}</span>
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button type="button" onClick={() => changeKQty(k, -1)}
                            className="w-8 h-8 flex items-center justify-center text-base hover:bg-secondary transition">−</button>
                          <span className="w-8 text-center text-sm font-medium">{q}</span>
                          <button type="button" onClick={() => changeKQty(k, 1)}
                            className="w-8 h-8 flex items-center justify-center text-base hover:bg-secondary transition">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-secondary/50 rounded-xl p-4 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{de ? "Netto" : "Net"}</span>
                      <span>{fmt(customNet)}</span>
                    </div>
                    {isAT && (
                      <div className="flex justify-between text-sm text-amber-600">
                        <span>{de ? "MwSt. 20%" : "VAT 20%"}</span>
                        <span>{fmt(customVat)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                      <span>{de ? "Gesamt" : "Total"}</span>
                      <span className="text-primary">{fmt(customTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact details */}
          <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {de ? "Kontaktdaten" : "Contact Details"}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input name="shop_name" placeholder={de ? "Shop-Name *" : "Shop Name *"} required maxLength={150} className="h-11 rounded-xl" />
              <Input name="contact_name" placeholder={de ? "Ansprechpartner *" : "Contact Person *"} required maxLength={100} className="h-11 rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input name="email" type="email" placeholder="E-Mail *" required maxLength={255} className="h-11 rounded-xl" />
              <Input name="phone" placeholder={de ? "Telefon / WhatsApp *" : "Phone / WhatsApp *"} required maxLength={50} className="h-11 rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input name="city" placeholder={de ? "Stadt *" : "City *"} required maxLength={100} className="h-11 rounded-xl" />
              <Input name="country" placeholder={de ? "Land *" : "Country *"} required maxLength={80} className="h-11 rounded-xl" />
            </div>
            <Textarea name="message" placeholder={de ? "Nachricht (optional)" : "Message (optional)"} maxLength={1000} rows={3} className="rounded-xl" />
          </div>

          <Button type="submit" disabled={loading} size="lg"
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 shadow-lg shadow-primary/20">
            {loading
              ? (de ? "Wird gesendet…" : "Sending…")
              : (de ? "Bestellung absenden" : "Submit Order")}
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Order;
