import { Shield, Sparkles, Smartphone, Zap, Eye, Droplet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import techImg from "@/assets/saida-glass-flex.jpg";

const Technology = () => {
  const { t } = useI18n();
  const features = [
    { icon: Shield, label: t("tech_1") },
    { icon: Smartphone, label: t("tech_2") },
    { icon: Droplet, label: t("tech_3") },
    { icon: Zap, label: t("tech_4") },
    { icon: Eye, label: t("tech_5") },
    { icon: Sparkles, label: t("tech_6") },
  ];
  return (
    <section id="technology" className="py-24 sm:py-32 bg-deep text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full bg-primary-glow/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary-glow font-semibold mb-4">{t("tech_eyebrow")}</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("tech_title")}</h2>
            <p className="mt-6 text-lg text-primary-foreground/70">{t("tech_sub")}</p>
            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div key={i} className="glass-dark rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
                  <div className="size-9 rounded-lg bg-gradient-to-br from-primary-glow to-primary grid place-items-center shrink-0">
                    <f.icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary-glow/30 blur-3xl rounded-full" />
            <img src={techImg} alt="Electroplated tempered glass — fold-resistant" width={1280} height={720} loading="lazy"
              className="relative rounded-3xl w-full animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Technology;
