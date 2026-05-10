import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

const K_SERIES = [
  "K01","K02","K03","K04","K05","K06","K07","K08","K09","K10",
  "K11","K12","K13","K13-1","K14+","K15+","K16+","K17+","K18+","K19+",
  "K20+","K21","K22","K23","K24","K25","K26","K27","K28","K29",
  "K30","K31","K32","K33","K34","K35","K36","K37","K38","K39",
  "K40","K41","K42","K43","K44","K45","K46","K47","K48","K49",
  "K50","K51","K52","K53","K54","K55+","K56+","K57","K58","K59+",
  "K60+","K61","K62+","K63+","K64+","K65+",
];

const schema = z.object({
  shop_name:    z.string().trim().min(1).max(150),
  contact_name: z.string().trim().min(1).max(100),
  email:        z.string().trim().email().max(255),
  phone:        z.string().trim().min(1).max(50),
  city:         z.string().trim().min(1).max(100),
  country:      z.string().trim().min(1).max(80),
  k_series:     z.string().min(1),
  quantity:     z.coerce.number().int().min(1).max(9999),
  message:      z.string().trim().max(1000).optional(),
});

const Order = () => {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const de = lang === "de";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));

    if (!parsed.success) {
      toast({ title: de ? "Bitte alle Felder prüfen" : "Please check all fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("orders").insert([parsed.data]);

    if (error) {
      toast({
        title: de ? "Fehler beim Senden" : "Something went wrong",
        description: de ? "Bitte versuche es erneut." : "Please try again.",
        variant: "destructive",
      });
    } else {
      (e.target as HTMLFormElement).reset();
      toast({
        title: de ? "Bestellung eingegangen! ✅" : "Order received! ✅",
        description: de ? "Wir melden uns innerhalb von 24 Stunden." : "We'll be in touch within 24 hours.",
      });
    }

    setLoading(false);
  };

  return (
    <section id="order" className="py-24 sm:py-32 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-primary mb-4">
            <Package className="size-4" />
            {de ? "Jetzt bestellen" : "Place an Order"}
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            {de ? "Bestellung aufgeben" : "Request Your Order"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            {de
              ? "Füllen Sie das Formular aus — wir melden uns innerhalb von 24 Stunden."
              : "Fill out the form and we'll get back to you within 24 hours."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="max-w-2xl mx-auto bg-background border border-border rounded-3xl p-6 sm:p-10 space-y-4 shadow-sm">

          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="shop_name" placeholder={de ? "Shop-Name *" : "Shop Name *"} required maxLength={150} className="h-12 rounded-xl" />
            <Input name="contact_name" placeholder={de ? "Ansprechpartner *" : "Contact Person *"} required maxLength={100} className="h-12 rounded-xl" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="email" type="email" placeholder={de ? "E-Mail *" : "Email *"} required maxLength={255} className="h-12 rounded-xl" />
            <Input name="phone" placeholder={de ? "Telefon / WhatsApp *" : "Phone / WhatsApp *"} required maxLength={50} className="h-12 rounded-xl" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="city" placeholder={de ? "Stadt *" : "City *"} required maxLength={100} className="h-12 rounded-xl" />
            <Input name="country" placeholder={de ? "Land *" : "Country *"} required maxLength={80} className="h-12 rounded-xl" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <select name="k_series" required
              className="h-12 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">{de ? "K-Serie auswählen *" : "Select K-Series *"}</option>
              {K_SERIES.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <Input name="quantity" type="number" min={1} max={9999}
              placeholder={de ? "Menge *" : "Quantity *"} required className="h-12 rounded-xl" />
          </div>

          <Textarea name="message" placeholder={de ? "Nachricht (optional)" : "Message (optional)"} maxLength={1000} rows={4} className="rounded-xl" />

          <Button type="submit" disabled={loading} size="lg"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow shadow-glow">
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
