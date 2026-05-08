import { TrendingUp, Timer, GraduationCap, Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Benefits = () => {
  const { t } = useI18n();
  const items = [
    { icon: TrendingUp, t: t("b1_t"), d: t("b1_d") },
    { icon: Timer, t: t("b2_t"), d: t("b2_d") },
    { icon: GraduationCap, t: t("b3_t"), d: t("b3_d") },
    { icon: Award, t: t("b4_t"), d: t("b4_d") },
  ];
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("benefits_eyebrow")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("benefits_title")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div key={i} className="group relative rounded-3xl border bg-card p-8 hover:shadow-elevated hover:-translate-y-1 transition-all duration-500 overflow-hidden">
              <div className="absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br from-primary/10 to-primary-glow/10 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center mb-6 shadow-glow">
                  <it.icon className="size-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{it.t}</h3>
                <p className="text-muted-foreground text-sm">{it.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Benefits;
