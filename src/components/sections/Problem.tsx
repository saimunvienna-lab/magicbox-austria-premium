import { Clock, Layers, Wallet, TrendingUp, Zap, PackageCheck, ArrowUpRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Problem = () => {
  const { t } = useI18n();
  const items = [
    { icon: Layers, t: t("p1_t"), d: t("p1_d") },
    { icon: Clock, t: t("p2_t"), d: t("p2_d") },
    { icon: Wallet, t: t("p3_t"), d: t("p3_d") },
  ];
  const benefits = [
    { icon: TrendingUp, t: t("pb1_t"), d: t("pb1_d") },
    { icon: Zap, t: t("pb2_t"), d: t("pb2_d") },
    { icon: PackageCheck, t: t("pb3_t"), d: t("pb3_d") },
  ];
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="hidden sm:block absolute top-20 -left-32 size-[420px] rounded-full bg-destructive/10 blur-3xl pointer-events-none animate-float-slow" />
      <div className="hidden sm:block absolute bottom-20 -right-32 size-[480px] rounded-full bg-primary/15 blur-3xl pointer-events-none animate-float" />
      <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Editorial header */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-destructive mb-5 animate-fade-up">
              <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
              {t("problem_eyebrow")}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] animate-fade-up" style={{ animationDelay: "0.05s" }}>
              {t("problem_title")}
            </h2>
          </div>
          <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("problem_sub")}</p>
          </div>
        </div>

        {/* PROBLEM CARDS */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((it, i) => (
            <div
              key={i}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-destructive/30 via-border to-transparent hover:from-destructive/60 hover:via-destructive/20 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-card/80 backdrop-blur-xl p-6 sm:p-8 overflow-hidden hover:-translate-y-1 transition-transform duration-500">
                <div className="absolute -top-16 -right-16 size-40 rounded-full bg-destructive/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-destructive/30 blur-xl opacity-50 group-hover:opacity-90 transition-opacity" />
                    <div className="relative size-14 rounded-2xl bg-gradient-to-br from-destructive to-destructive/70 grid place-items-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                      <it.icon className="size-6 text-destructive-foreground" />
                    </div>
                  </div>
                  <span className="font-display text-3xl font-bold text-muted-foreground/20 group-hover:text-destructive/40 transition-colors">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="relative font-display text-xl sm:text-2xl font-semibold mb-3 tracking-tight">{it.t}</h3>
                <p className="relative text-muted-foreground leading-relaxed">{it.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="relative my-20 sm:my-24 flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-primary">
            <Sparkles className="size-3.5" />
            {t("benefit_eyebrow")}
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* BENEFIT CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {benefits.map((it, i) => (
            <div
              key={i}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-primary/40 via-primary-glow/30 to-transparent hover:from-primary hover:via-primary-glow/60 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-card/80 backdrop-blur-xl p-6 sm:p-8 overflow-hidden hover:-translate-y-1 transition-transform duration-500">
                <div className="absolute -top-20 -right-20 size-48 rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/20 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-primary-glow/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="relative size-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-glow group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                      <it.icon className="size-6 text-primary-foreground" />
                    </div>
                  </div>
                  <ArrowUpRight className="size-5 text-primary opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500" />
                </div>
                <h3 className="relative font-display text-xl sm:text-2xl font-semibold mb-3 tracking-tight">{it.t}</h3>
                <p className="relative text-muted-foreground leading-relaxed">{it.d}</p>
                <div className="relative mt-6 h-px bg-gradient-to-r from-primary/40 via-primary-glow/30 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Problem;
