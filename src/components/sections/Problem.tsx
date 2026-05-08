import { Clock, Layers, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Problem = () => {
  const { t } = useI18n();
  const items = [
    { icon: Layers, t: t("p1_t"), d: t("p1_d") },
    { icon: Clock, t: t("p2_t"), d: t("p2_d") },
    { icon: Wallet, t: t("p3_t"), d: t("p3_d") },
  ];
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("problem_eyebrow")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {t("problem_title")}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">{t("problem_sub")}</p>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <div key={i} className="group relative rounded-3xl border bg-card p-8 hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 grid place-items-center mb-6 group-hover:scale-110 transition-transform">
                <it.icon className="size-6 text-destructive" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{it.t}</h3>
              <p className="text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Problem;
