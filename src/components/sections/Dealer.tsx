import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const FORMSPREE_URL = "https://formspree.io/f/mzdokerz";

const schema = z.object({
  name:    z.string().trim().min(1).max(100),
  email:   z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(150),
  country: z.string().trim().min(1).max(80),
  volume:  z.string().trim().min(1).max(60),
  message: z.string().trim().max(1000).optional(),
});

const Dealer = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));

    if (!parsed.success) {
      toast({ title: "Please check the form", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          form_type: "🤝 Dealer Application",
          name:      parsed.data.name,
          email:     parsed.data.email,
          company:   parsed.data.company,
          country:   parsed.data.country,
          volume:    parsed.data.volume,
          message:   parsed.data.message ?? "—",
        }),
      });

      if (!res.ok) throw new Error("Failed");

      (e.target as HTMLFormElement).reset();
      toast({ title: t("sent_title"), description: t("sent_desc") });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us at office@saidamagicbox.com",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dealer" className="py-24 sm:py-32 bg-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute top-0 right-0 size-[500px] rounded-full bg-primary-glow/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              <Handshake className="size-3.5" /> {t("dealer_eyebrow")}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("dealer_title")}
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/70 max-w-lg">{t("dealer_sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#dealer-form" className="inline-flex items-center gap-2 rounded-full bg-primary-foreground text-primary-deep px-5 py-2.5 text-sm font-medium hover:bg-primary-foreground/90 transition">
                {t("dealer_cta_become")} <ArrowRight className="size-4" />
              </a>
              <a href="#dealer-form" className="inline-flex items-center gap-2 rounded-full glass-dark px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition">
                {t("dealer_cta_sample")}
              </a>
            </div>
          </div>

          {/* Right: form */}
          <form id="dealer-form" onSubmit={onSubmit} className="glass-dark rounded-3xl p-6 sm:p-10 space-y-4">
            <Input
              name="name"
              placeholder={t("f_name")}
              required
              maxLength={100}
              className="h-12 rounded-xl bg-white/5 border-white/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                name="email"
                type="email"
                placeholder={t("f_email")}
                required
                maxLength={255}
                className="h-12 rounded-xl bg-white/5 border-white/10 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Input
                name="company"
                placeholder={t("f_company")}
                required
                maxLength={150}
                className="h-12 rounded-xl bg-white/5 border-white/10 text-primary-foreground placeholder:text-primary-foreground/50"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                name="country"
                placeholder={t("f_country")}
                required
                maxLength={80}
                className="h-12 rounded-xl bg-white/5 border-white/10 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Input
                name="volume"
                placeholder={t("f_volume")}
                required
                maxLength={60}
                className="h-12 rounded-xl bg-white/5 border-white/10 text-primary-foreground placeholder:text-primary-foreground/50"
              />
            </div>
            <Textarea
              name="message"
              placeholder={t("f_msg")}
              maxLength={1000}
              rows={4}
              className="rounded-xl bg-white/5 border-white/10 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-12 rounded-xl bg-primary-foreground text-primary-deep hover:bg-primary-foreground/90"
            >
              {loading ? "Sending…" : t("f_send_dealer")}
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Dealer;
