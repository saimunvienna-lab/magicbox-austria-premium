import { ArrowRight, Play, Sparkles, MapPin, Globe2, Smartphone, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import boxFront from "@/assets/saida-box-front.jpg";
import boxSide from "@/assets/saida-box-side.jpg";

const Hero = () => {
  const { t } = useI18n();
  const trust = [
    { icon: MapPin, label: t("trust_1") },
    { icon: Globe2, label: t("trust_2") },
    { icon: Smartphone, label: t("trust_3") },
    { icon: Layers, label: t("trust_4") },
  ];
  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden bg-hero">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-primary-glow/20 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-60 -left-40 size-[600px] rounded-full bg-primary/15 blur-3xl pointer-events-none animate-float" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-primary-deep mb-8 animate-fade-up">
              <Sparkles className="size-3.5" />
              {t("hero_eyebrow")}
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tighter leading-[0.92] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <span className="block text-foreground">{t("hero_title")}</span>
              <span className="block text-gradient">{t("hero_title_2")}</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {t("hero_sub")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="rounded-full h-14 px-8 bg-foreground text-background hover:bg-foreground/90 shadow-elevated transition-all">
                <a href="#contact">{t("hero_cta")} <ArrowRight className="ml-1 size-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-8 border-foreground/20 hover:bg-foreground/5">
                <a href="#how"><Play className="mr-1 size-4" /> {t("hero_cta_2")}</a>
              </Button>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {trust.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="size-4 text-primary" />
                  <span className="font-medium text-foreground/70">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-primary-glow/40 blur-3xl" />
            <div className="relative animate-float">
              <img
                src={boxFront}
                alt="SAIDA MagicBox premium tempered glass packaging"
                width={600}
                height={750}
                fetchPriority="high"
                decoding="sync"
                loading="eager"
                className="w-full max-w-md mx-auto h-auto rounded-3xl shadow-elevated"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -left-6 lg:-left-12 w-32 lg:w-40 rotate-[-6deg] animate-float-slow">
              <img
                src={boxSide}
                alt="MagicBox side view"
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
                className="w-full h-auto rounded-2xl shadow-elevated border border-white/40"
              />
            </div>
            <div className="absolute -bottom-4 right-2 sm:right-4 glass rounded-2xl p-4 shadow-soft animate-float-slow max-w-[180px]">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Found in</div>
              <div className="font-display font-bold text-2xl text-gradient">2.4s</div>
              <div className="text-xs">iPhone 15 Pro Max</div>
            </div>
            <div className="absolute -top-4 -right-2 sm:-right-6 glass rounded-2xl p-4 shadow-soft animate-float max-w-[180px]" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs">Live inventory</div>
              </div>
              <div className="font-display font-bold text-base mt-1">99.4% accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
