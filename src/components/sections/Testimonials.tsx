import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Testimonials = () => {
  const { t } = useI18n();
  const items = [
    { q: t("t1"), n: t("t1_n"), r: t("t1_r") },
    { q: t("t2"), n: t("t2_n"), r: t("t2_r") },
    { q: t("t3"), n: t("t3_n"), r: t("t3_r") },
  ];
  return (
    <section className="py-24 sm:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("test_eyebrow")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("test_title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <figure key={i} className="rounded-3xl bg-card border p-8 hover:shadow-elevated transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="size-4 fill-primary text-primary" />)}
              </div>
              <blockquote className="text-lg leading-relaxed text-foreground/90">"{it.q}"</blockquote>
              <figcaption className="mt-6 pt-6 border-t">
                <div className="font-semibold">{it.n}</div>
                <div className="text-sm text-muted-foreground">{it.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
