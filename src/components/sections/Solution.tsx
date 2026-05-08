import { Box, Search, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import shopImg from "@/assets/shop-display.jpg";

const Solution = () => {
  const { t } = useI18n();
  const items = [
    { icon: Box, t: t("sol_1_t"), d: t("sol_1_d") },
    { icon: Search, t: t("sol_2_t"), d: t("sol_2_d") },
    { icon: TrendingUp, t: t("sol_3_t"), d: t("sol_3_d") },
  ];
  return (
    <section id="solution" className="py-24 sm:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-primary-glow/20 blur-3xl rounded-full" />
            <img src={shopImg} alt="MagicBox in a modern phone shop" width={1280} height={1024} loading="lazy"
              className="relative rounded-3xl shadow-elevated w-full" />
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("sol_eyebrow")}</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("sol_title")}</h2>
            <p className="mt-6 text-lg text-muted-foreground">{t("sol_sub")}</p>
            <div className="mt-10 space-y-6">
              {items.map((it, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="shrink-0 size-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
                    <it.icon className="size-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{it.t}</h3>
                    <p className="text-muted-foreground mt-1">{it.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Solution;
