import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import heroImg from "@/assets/hero-product.jpg";

const Hero = () => {
  const { t } = useI18n();
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-hero">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary-deep mb-6 animate-fade-up">
              <Sparkles className="size-3.5" />
              {t("hero_eyebrow")}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.95] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <span className="block text-foreground">{t("hero_title")}</span>
              <span className="block text-gradient">{t("hero_title_2")}</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {t("hero_sub")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="rounded-full h-14 px-8 bg-gradient-to-r from-primary to-primary-glow shadow-glow hover:shadow-elevated transition-all">
                <a href="#contact">{t("hero_cta")} <ArrowRight className="ml-1 size-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 border-foreground/20 hover:bg-foreground/5">
                <a href="#qr"><Play className="mr-1 size-4" /> {t("hero_cta_2")}</a>
              </Button>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {[
                ["2000+", t("stat_models")],
                ["48+", t("stat_brands")],
                ["10s", t("stat_seconds")],
                ["🇦🇹", t("stat_made")],
              ].map(([n, l]) => (
                <div key={l as string}>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-gradient">{n}</div>
                  <div className="text-xs text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-primary-glow/40 blur-3xl" />
            <div className="relative animate-float">
              <img src={heroImg} alt="SAIDA MagicBox premium tempered glass packaging" width={1536} height={1280}
                className="w-full h-auto rounded-3xl shadow-elevated" />
            </div>
            <div className="absolute -bottom-6 -left-4 sm:-left-10 glass rounded-2xl p-4 shadow-soft animate-float-slow max-w-[180px]">
              <div className="text-xs text-muted-foreground">Found in</div>
              <div className="font-display font-bold text-2xl text-gradient">2.4s</div>
              <div className="text-xs">iPhone 15 Pro Max</div>
            </div>
            <div className="absolute -top-4 -right-2 sm:-right-8 glass rounded-2xl p-4 shadow-soft animate-float max-w-[180px]" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs">Live inventory</div>
              </div>
              <div className="font-display font-bold text-lg mt-1">99.4% accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
