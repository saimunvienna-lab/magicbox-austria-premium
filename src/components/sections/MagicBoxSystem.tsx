import { Layers, Boxes, Database, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import sysImg from "@/assets/saida-banner.jpg";

const MagicBoxSystem = () => {
  const { t } = useI18n();
  const bullets = [
    { icon: Layers, label: t("sys_b1") },
    { icon: Boxes, label: t("sys_b2") },
    { icon: Database, label: t("sys_b3") },
    { icon: Sparkles, label: t("sys_b4") },
  ];
  const stats = [
    { n: "61", l: t("sys_stat_drawers") },
    { n: "305", l: t("sys_stat_pieces") },
    { n: "48+", l: t("sys_stat_brands") },
    { n: "2000+", l: t("sys_stat_models") },
  ];
  return (
    <section id="system" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("sys_eyebrow")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("sys_title")}</h2>
          <p className="mt-6 text-lg text-muted-foreground">{t("sys_sub")}</p>
        </div>

        <div className="mt-16 grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-elevated group">
            <img src={sysImg} alt="SAIDA MagicBox system overview" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border bg-card p-5 hover:shadow-soft transition-all">
                <div className="shrink-0 size-11 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-glow">
                  <b.icon className="size-5 text-primary-foreground" />
                </div>
                <div className="text-base font-medium leading-snug pt-1.5">{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div key={s.l} className="rounded-3xl border bg-card p-6 sm:p-8 text-center hover:shadow-elevated transition-all">
              <div className="font-display text-4xl sm:text-5xl font-bold text-gradient">{s.n}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default MagicBoxSystem;
