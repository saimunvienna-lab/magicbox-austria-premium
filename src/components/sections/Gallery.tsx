import { useI18n } from "@/lib/i18n";
import hero from "@/assets/hero-product.jpg";
import tech from "@/assets/glass-tech.jpg";
import shop from "@/assets/shop-display.jpg";
import qr from "@/assets/qr-scan.jpg";

const Gallery = () => {
  const { t } = useI18n();
  return (
    <section id="gallery" className="py-24 sm:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("gallery_eyebrow")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("gallery_title")}</h2>
          <p className="mt-6 text-lg text-muted-foreground">{t("gallery_sub")}</p>
        </div>
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          <div className="col-span-12 sm:col-span-7 group relative overflow-hidden rounded-3xl aspect-[16/10]">
            <img src={hero} alt="MagicBox premium packaging" className="size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-background">
              <div className="text-xs uppercase tracking-widest opacity-80">Series 01</div>
              <div className="font-display text-2xl font-semibold">MagicBox Pro</div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-5 group relative overflow-hidden rounded-3xl aspect-[16/10] sm:aspect-auto">
            <img src={tech} alt="Electroplated glass" className="size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-6 left-6 text-background">
              <div className="text-xs uppercase tracking-widest opacity-80">Glass</div>
              <div className="font-display text-2xl font-semibold">Electroplated 9H</div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-5 group relative overflow-hidden rounded-3xl aspect-[16/10]">
            <img src={qr} alt="QR scanning workflow" className="size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-6 left-6 text-background">
              <div className="text-xs uppercase tracking-widest opacity-80">Workflow</div>
              <div className="font-display text-2xl font-semibold">QR Finder</div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-7 group relative overflow-hidden rounded-3xl aspect-[16/10]">
            <img src={shop} alt="MagicBox in store" className="size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-background">
              <div className="text-xs uppercase tracking-widest opacity-80">In Store</div>
              <div className="font-display text-2xl font-semibold">Counter-Ready Display</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Gallery;
