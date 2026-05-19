import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { ArrowRight, Play, QrCode, CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";
import boxFront from "@/assets/saida-box-front.webp";
import boxFrontMobile from "@/assets/saida-box-front-mobile.webp";

const SITE_URL = "https://saidamagicbox.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "SAIDA MagicBox",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      sameAs: [],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#localbusiness`,
      name: "SAIDA MagicBox",
      url: SITE_URL,
      image: `${SITE_URL}/og.jpg`,
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Wagramer Straße 195",
        postalCode: "1210",
        addressLocality: "Wien",
        addressCountry: "AT",
      },
      areaServed: [
        { "@type": "Country", name: "Austria" },
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Switzerland" },
      ],
    },
  ],
};

const CountUp = ({ to, suffix = "", duration = 1.5 }: { to: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.textContent = to.toLocaleString("de-AT") + suffix;
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("de-AT") + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration, reduced]);
  return <span ref={ref}>0{suffix}</span>;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } }),
};

const Hero = () => {
  const { t, lang } = useI18n();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const lite = reduced || isMobile;
  const [seoLang] = useState(lang);

  return (
    <section
      id="hero"
      aria-label="SAIDA MagicBox Hero"
      className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden bg-hero"
    >
      <Helmet>
        <html lang={seoLang === "de" ? "de-AT" : "en"} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Background layers */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      {!isMobile && (
        <>
          <div className="absolute -top-48 -left-32 size-[800px] rounded-full bg-primary/20 blur-3xl pointer-events-none animate-float-slow" />
          <div className="absolute -bottom-48 -right-32 size-[600px] rounded-full bg-primary-glow/15 blur-3xl pointer-events-none animate-float" />
        </>
      )}
      {/* SVG grid */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <radialGradient id="hero-grid-fade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-grid-mask">
            <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" mask="url(#hero-grid-mask)" className="text-foreground" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT: content */}
          <div className="lg:col-span-7 order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-foreground/80 shadow-soft"
            >
              <span aria-hidden className={reduced ? "" : "animate-pulse"}>🇦🇹</span>
              <span className="font-medium">{t("hero_pill")}</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              <span className="text-foreground">{t("hero_h1_a")}</span>
              <span className="text-gradient">{t("hero_h1_b")}</span>
            </motion.h1>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-5 text-xl sm:text-2xl text-muted-foreground font-medium"
            >
              <span className="font-bold text-foreground">2.000+</span> Modelle.{" "}
              <span className="font-bold text-foreground">48+</span> Marken. Eine intelligente Box.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {t("hero_para")}
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-border max-w-2xl mx-auto lg:mx-0"
            >
              {[
                { v: 2000, s: "+", l: t("hero_stat1_l") },
                { v: 48, s: "+", l: t("hero_stat2_l") },
                { v: 330, s: "", l: t("hero_stat3_l") },
                { v: 0.5, s: " m²", l: t("hero_stat4_l") },
              ].map((stat, i) => (
                <div key={i} className="sm:px-5 first:sm:pl-0 text-center sm:text-left">
                  <div className="font-display text-3xl sm:text-4xl font-bold text-gradient leading-none">
                    <CountUp to={stat.v} suffix={stat.s} />
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                    {stat.l}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={5}
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full h-14 px-8 text-base font-semibold bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-glow hover:scale-[1.03] hover:shadow-elevated transition-all"
              >
                <a href="#order" aria-label={t("hero_cta_dealer")}>
                  {t("hero_cta_dealer")} <ArrowRight className="ml-1.5 size-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-8 text-base border-2 border-border hover:border-primary hover:bg-card transition-all"
              >
                <a href="#how" aria-label={t("hero_cta_demo")}>
                  <Play className="mr-1.5 size-4" /> {t("hero_cta_demo")}
                </a>
              </Button>
            </motion.div>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={6}
              className="mt-5 text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 justify-center lg:justify-start"
            >
              {t("hero_trust_micro").split(" · ").map((line, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" /> {line.replace(/^✓\s*/, "")}
                </span>
              ))}
            </motion.p>

            {/* Social proof strip */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={7}
              className="mt-8 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {[
                  "from-primary to-primary-glow",
                  "from-primary-deep to-primary",
                  "from-accent to-primary-glow",
                  "from-primary-glow to-accent",
                  "from-primary to-primary-deep",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={`size-8 rounded-full bg-gradient-to-br ${g} ring-2 ring-background ${i >= 3 ? "hidden sm:block" : ""}`}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">{t("hero_social_proof")}</p>
            </motion.div>
          </div>

          {/* RIGHT: visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 order-1 lg:order-2 relative"
          >
            {/* halo */}
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-primary-glow/30 blur-3xl pointer-events-none" />

            <motion.div
              whileHover={reduced ? undefined : { rotateX: -4, rotateY: 6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ perspective: 1200 }}
              className="relative max-w-md mx-auto"
            >
              <picture>
                <source media="(max-width: 640px)" srcSet={boxFrontMobile} type="image/webp" />
                <img
                  src={boxFront}
                  alt="SAIDA MagicBox — Panzerglas-Lagersystem für Handy-Shops"
                  width={800}
                  height={712}
                  fetchPriority="high"
                  decoding="sync"
                  loading="eager"
                  className="relative w-full h-auto rounded-3xl shadow-elevated"
                />
              </picture>
            </motion.div>

            {/* Floating Card A — top right */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0] }}
              transition={{ opacity: { duration: 0.6, delay: 0.7 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
              className="absolute -top-2 -right-2 sm:-right-6 lg:-right-10 glass rounded-2xl p-3.5 shadow-elevated max-w-[200px] rotate-3"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <QrCode className="size-3.5 text-primary" /> QR scannen, Modell finden
              </div>
              <div className="mt-1 font-display font-bold text-sm text-foreground">Samsung Galaxy S26 Ultra</div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                K60+ ✓
              </div>
            </motion.div>

            {/* Floating Card B — middle left */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, -8, 0] }}
              transition={{ opacity: { duration: 0.6, delay: 0.9 }, y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 } }}
              className="absolute top-1/2 -left-2 sm:-left-6 lg:-left-10 -translate-y-1/2 glass rounded-2xl p-3.5 shadow-soft max-w-[200px] -rotate-3"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Schublade</div>
              <div className="mt-1 font-display font-bold text-2xl text-gradient leading-none">K42</div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground">
                <CheckCircle2 className="size-3.5 text-emerald-500" /> iPhone 17 Pro Max
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Perfekt passend</div>
            </motion.div>

            {/* Floating Card C — bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, -6, 0] }}
              transition={{ opacity: { duration: 0.6, delay: 1.1 }, y: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 } }}
              className="absolute -bottom-10 right-2 sm:right-6 rounded-2xl p-[1px] bg-gradient-to-br from-primary via-primary-glow to-accent shadow-elevated"
            >
              <div className="rounded-[calc(1rem-1px)] bg-card/95 backdrop-blur-xl px-4 py-3 flex items-center gap-2.5">
                <Package className="size-4 text-primary" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Inhalt</div>
                  <div className="font-display font-bold text-sm text-foreground">{t("hero_card_c")}</div>
                </div>
              </div>
            </motion.div>

            {/* Floating particles */}
            {!lite && (
              <div className="hidden sm:block absolute inset-0 pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute size-1.5 rounded-full bg-primary/50"
                    style={{ left: `${15 + i * 18}%`, top: `${70 + (i % 2) * 10}%` }}
                    animate={{ y: [0, -120, -200], opacity: [0, 0.6, 0] }}
                    transition={{ duration: 6 + i, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;