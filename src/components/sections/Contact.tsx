import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

// ─── Replace these with your EmailJS credentials ───────────────────────────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz456"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "user_abc123xyz"
// ───────────────────────────────────────────────────────────────────────────

const schema = z.object({
  name:    z.string().trim().min(1).max(100),
  email:   z.string().trim().email().max(255),
  company: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1).max(1000),
});

const Contact = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      toast({ title: "Please check the form", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  parsed.data.name,
          from_email: parsed.data.email,
          company:    parsed.data.company ?? "—",
          message:    parsed.data.message,
          to_email:   "office@saidamagicbox.com",
        },
        EMAILJS_PUBLIC_KEY
      );

      (e.target as HTMLFormElement).reset();
      toast({ title: t("sent_title"), description: t("sent_desc") });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left: info */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              {t("contact_eyebrow")}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("contact_title")}
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">{t("contact_sub")}</p>

            <div className="mt-10 space-y-5">
              {[
                { i: Mail,   l: "office@saidamagicbox.com" },
                { i: Phone,  l: "+43 676 9617723" },
                { i: MapPin, l: "Innsbruck, Austria" },
              ].map(({ i: Icon, l }) => (
                <div key={l} className="flex items-center gap-4">
                  <div className="size-11 rounded-2xl glass grid place-items-center">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <span className="font-medium">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border bg-card p-6 sm:p-10 shadow-soft space-y-4"
          >
            <Input
              name="name"
              placeholder={t("f_name")}
              required
              maxLength={100}
              className="h-12 rounded-xl"
            />
            <Input
              name="email"
              type="email"
              placeholder={t("f_email")}
              required
              maxLength={255}
              className="h-12 rounded-xl"
            />
            <Input
              name="company"
              placeholder={t("f_company")}
              maxLength={150}
              className="h-12 rounded-xl"
            />
            <Textarea
              name="message"
              placeholder={t("f_msg")}
              required
              maxLength={1000}
              rows={5}
              className="rounded-xl"
            />
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow shadow-glow"
            >
              {loading ? "Sending…" : t("f_send")}
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;
