import { useI18n } from "@/lib/i18n";
import banner from "@/assets/saida-banner.jpg";
import boxFront from "@/assets/saida-box-front.jpg";
import system from "@/assets/saida-system.jpg";
import flex from "@/assets/saida-glass-flex.jpg";
import detail from "@/assets/saida-box-detail.jpg";
import qr from "@/assets/qr-scan.jpg";

const Gallery = () => {
  const { t } = useI18n();
  const items = [
    { src: banner, span: "sm:col-span-7", aspect: "aspect-[16/10]", tag: "MagicBox", title: "Premium Packaging" },
    { src: flex, span: "sm:col-span-5", aspect: "aspect-[16/10]", tag: "Glass", title: "Fold-Resistant 9H" },
    { src: system, span: "sm:col-span-5", aspect: "aspect-[16/10]", tag: "System", title: "Drawer Infrastructure" },
    { src: boxFront, span: "sm:col-span-7", aspect: "aspect-[16/10]", tag: "Retail", title: "Counter-Ready" },
    { src: qr, span: "sm:col-span-6", aspect: "aspect-[16/10]", tag: "Workflow", title: "QR Finder" },
    { src: detail, span: "sm:col-span-6", aspect: "aspect-[16/10]", tag: "Detail", title: "Industrial Design" },
  ];
  return (
    <section id="gallery" className="py-24 sm:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("gallery_eyebrow")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("gallery_title")}</h2>
          <p className="mt-6 text-lg text-muted-foreground">{t("gallery_sub")}</p>
        </div>
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {items.map((it, i) => (
            <div key={i} className={`col-span-12 ${it.span} group relative overflow-hidden rounded-3xl ${it.aspect}`}>
              <img src={it.src} alt={it.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute bottom-6 left-6 text-background">
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">{it.tag}</div>
                <div className="font-display text-xl sm:text-2xl font-semibold mt-1">{it.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Gallery;
