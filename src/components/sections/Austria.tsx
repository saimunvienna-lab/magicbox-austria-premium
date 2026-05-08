import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import austria from "@/assets/austria.jpg";

const Austria = () => {
  const { t } = useI18n();
  const bullets = [t("austria_b1"), t("austria_b2"), t("austria_b3")];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={austria} alt="Austrian Alps" className="size-full object-cover" loading="lazy" width={1536} height={1024} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary-deep/80 to-primary-deep/40" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-32 text-primary-foreground">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs font-medium mb-6">
            <span className="text-base">🇦🇹</span> {t("austria_eyebrow")}
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("austria_title")}</h2>
          <p className="mt-6 text-lg text-primary-foreground/80">{t("austria_sub")}</p>
          <ul className="mt-10 space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="size-6 rounded-full bg-primary-glow grid place-items-center">
                  <Check className="size-3.5 text-primary-deep" />
                </div>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
export default Austria;
