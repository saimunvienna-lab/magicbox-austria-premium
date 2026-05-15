import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { Layers, Clock, Wallet, TrendingDown, Zap, TrendingUp, ArrowDown, ArrowUp, ArrowUpRight, Check } from "lucide-react";

import { useI18n } from "@/lib/i18n";

const CountUp = ({ value }: { value: string }) => {
  // Pulls leading + trailing non-digits as prefix/suffix; animates the numeric core.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const match = value.match(/^([^\d−-]*)([−-]?[\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numericRaw = match?.[2] ?? value;
  const suffix = match?.[3] ?? "";
  const negative = numericRaw.startsWith("−") || numericRaw.startsWith("-");
  const numClean = numericRaw.replace(/[−\-.,]/g, "");
  const target = parseInt(numClean || "0", 10);
  const useDot = numericRaw.includes(".");

  useEffect(() => {
    if (!ref.current) return;
    if (reduced || !inView) {
      if (reduced) ref.current.textContent = value;
      return;
    }
    const controls = animate(0, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => {
        const n = Math.round(v);
        const formatted = useDot ? n.toLocaleString("de-DE") : n.toString();
        if (ref.current) ref.current.textContent = `${prefix}${negative ? "−" : ""}${formatted}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, target, prefix, suffix, negative, useDot, reduced, value]);

  return <span ref={ref}>{reduced ? value : `${prefix}${negative ? "−" : ""}0${suffix}`}</span>;
};

const Problem = () => {
  const { t } = useI18n();
  const reduced = useReducedMotion();

  const problems = [
    { icon: Layers, stat: t("pc1_stat"), label: t("pc1_label"), title: t("pc1_t"), desc: t("pc1_d") },
    { icon: Clock, stat: t("pc2_stat"), label: t("pc2_label"), title: t("pc2_t"), desc: t("pc2_d") },
    { icon: Wallet, stat: t("pc3_stat"), label: t("pc3_label"), title: t("pc3_t"), desc: t("pc3_d") },
  ];
  const benefits = [
    { icon: TrendingDown, stat: t("bc1_stat"), label: t("bc1_label"), title: t("bc1_t"), desc: t("bc1_d") },
    { icon: Zap, stat: t("bc2_stat"), label: t("bc2_label"), title: t("bc2_t"), desc: t("bc2_d") },
    { icon: TrendingUp, stat: t("bc3_stat"), label: t("bc3_label"), title: t("bc3_t"), desc: t("bc3_d") },
  ];

  return (
    <>
      {/* ───────── PART 1 — DARK PROBLEM ───────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-deep text-primary-foreground">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-destructive/20 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-destructive/15 blur-3xl pointer-events-none animate-float" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* LEFT 60% */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-bold text-destructive mb-5">
                  <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
                  {t("problem_part1_eyebrow")}
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                  {t("problem_part1_title")}
                </h2>
                <p className="mt-5 text-lg text-primary-foreground/60 max-w-xl">{t("problem_part1_sub")}</p>
              </motion.div>

              <div className="mt-10 space-y-4">
                {problems.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-destructive/30 via-white/10 to-transparent hover:from-destructive/60 transition-all"
                  >
                    <div className="relative rounded-[calc(1rem-1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-7 hover:-translate-y-1 hover:shadow-elevated transition-all duration-500">
                      <div className="flex items-start gap-6">
                        <div className="shrink-0">
                          <div className="font-display text-5xl sm:text-6xl font-bold leading-none bg-gradient-to-br from-destructive to-orange-400 bg-clip-text text-transparent">
                            <CountUp value={p.stat} />
                          </div>
                          <div className="mt-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary-foreground/50">
                            {p.label}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                          <p className="mt-2 text-sm sm:text-base text-primary-foreground/70 leading-relaxed">{p.desc}</p>
                        </div>
                        <p.icon className="size-5 text-destructive/80 shrink-0" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT 40% — chaotic drawer SVG */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 order-1 lg:order-2 relative"
            >
              <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
              <div className={`relative ${reduced ? "" : "animate-float-slow"}`}>
                <ChaosDrawerSvg label={t("chaos_alt")} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── PART 2 — BRIDGE ───────── */}
      <section
        aria-hidden="true"
        className="relative h-20 sm:h-[120px] overflow-hidden bg-gradient-to-b from-[hsl(222_80%_12%)] via-[hsl(222_80%_18%)] to-[hsl(215_70%_28%)]"
      >
        {/* particles */}
        {!reduced && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute size-1 rounded-full bg-primary-glow/70"
                style={{ left: `${5 + i * 8}%`, bottom: 0 }}
                animate={{ y: [-0, -120], opacity: [0, 1, 0] }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
              />
            ))}
          </div>
        )}

        <div className="relative h-full mx-auto max-w-3xl px-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-bold text-destructive/70">
            <ArrowDown className="size-4" /> {t("bridge_before")}
          </div>
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center font-display font-bold text-primary-foreground text-xl">
            S
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-bold text-primary-glow drop-shadow-[0_0_8px_hsl(var(--primary-glow))]">
            {t("bridge_after")} <ArrowUp className="size-4" />
          </div>
        </div>
      </section>

      {/* ───────── PART 3 — BRIGHT SOLUTION ───────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-background to-secondary/40">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/20 blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-40 -left-40 size-[500px] rounded-full bg-primary-glow/20 blur-3xl pointer-events-none animate-float" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* LEFT 40% — visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <div className={`relative ${reduced ? "" : "animate-float-slow"}`}>
                <MagicBoxSvg label={t("magicbox_alt")} />
              </div>
            </motion.div>

            {/* RIGHT 60% */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-bold text-primary mb-5">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  {t("problem_part3_eyebrow")}
                </div>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
                  {t("problem_part3_title")}
                </h2>
                <p className="mt-5 text-lg text-muted-foreground max-w-xl">{t("problem_part3_sub")}</p>
              </motion.div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
                {benefits.map((b, i) => {
                  const isPricing = i === 2;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: i * 0.12 }}
                      className="group relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-primary/40 via-primary-glow/30 to-transparent hover:from-primary hover:via-primary-glow/60 transition-all"
                    >
                      <div className="relative h-full flex flex-col rounded-[calc(1rem-1px)] bg-card/90 backdrop-blur-xl border border-primary/10 p-6 sm:p-7 shadow-soft hover:-translate-y-1 hover:shadow-elevated transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                          <div className="size-11 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-glow">
                            <b.icon className="size-5 text-primary-foreground" />
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground text-right">
                            {b.label}
                          </div>
                        </div>

                        {isPricing ? (
                          <>
                            <h3 className="font-display text-xl font-bold text-foreground text-center">ROI in 30 Tagen</h3>
                            <div className="mt-3 text-center">
                              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">Umsatz pro Box</div>
                              <div className="mt-1 font-display text-4xl sm:text-5xl font-bold leading-none text-gradient">
                                €3.050–4.850
                              </div>
                            </div>
                            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                              {[
                                "305 Panzergläser: Standard 0,33mm bei €10–15 / Stk.",
                                "Plus Ultra-Dünn 0,25mm (Curved-Displays) bei €20 / Stk.",
                                "= €3.050–4.850 Umsatz aus einer einzigen Box",
                              ].map((line) => (
                                <li key={line} className="flex items-start gap-2">
                                  <Check className="size-4 text-primary shrink-0 mt-0.5" />
                                  <span className="leading-snug">{line}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            <div className="font-display text-5xl sm:text-6xl font-bold leading-none text-gradient">
                              <CountUp value={b.stat} />
                            </div>
                            <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{b.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/* ───────── inline illustrations ───────── */

const ChaosDrawerSvg = ({ label }: { label: string }) => (
  <svg
    role="img"
    aria-label={label}
    viewBox="0 0 400 360"
    className="w-full h-auto max-w-md mx-auto"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="chaos-bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="hsl(0 0% 100% / 0.04)" />
        <stop offset="100%" stopColor="hsl(0 0% 100% / 0.01)" />
      </linearGradient>
    </defs>
    {/* drawer */}
    <rect x="20" y="60" width="360" height="280" rx="14" fill="url(#chaos-bg)" stroke="hsl(0 0% 100% / 0.15)" strokeWidth="1.5" />
    {/* scattered boxes */}
    {[
      { x: 50, y: 100, w: 70, h: 50, r: -8 },
      { x: 140, y: 120, w: 80, h: 55, r: 5 },
      { x: 240, y: 95, w: 75, h: 48, r: -3 },
      { x: 60, y: 200, w: 90, h: 60, r: 12 },
      { x: 170, y: 220, w: 70, h: 50, r: -6 },
      { x: 260, y: 210, w: 85, h: 55, r: 4 },
      { x: 110, y: 285, w: 80, h: 40, r: -10 },
      { x: 220, y: 290, w: 90, h: 38, r: 7 },
    ].map((b, i) => (
      <g key={i} transform={`rotate(${b.r} ${b.x + b.w / 2} ${b.y + b.h / 2})`}>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill="hsl(0 0% 100% / 0.06)" stroke="hsl(0 84% 60% / 0.4)" strokeWidth="1" />
        <rect x={b.x + 8} y={b.y + 10} width={b.w * 0.4} height="6" rx="2" fill="hsl(0 0% 100% / 0.2)" />
        <text x={b.x + 8} y={b.y + 32} fill="hsl(0 0% 100% / 0.35)" fontSize="9" fontFamily="monospace">??</text>
      </g>
    ))}
    {/* question marks */}
    <text x="190" y="50" fill="hsl(0 84% 60% / 0.6)" fontSize="32" fontWeight="bold" fontFamily="serif">?</text>
    <text x="350" y="40" fill="hsl(0 84% 60% / 0.4)" fontSize="22" fontWeight="bold" fontFamily="serif">?</text>
    <text x="30" y="40" fill="hsl(0 84% 60% / 0.5)" fontSize="26" fontWeight="bold" fontFamily="serif">?</text>
  </svg>
);

const MagicBoxSvg = ({ label }: { label: string }) => (
  <svg
    role="img"
    aria-label={label}
    viewBox="0 0 400 360"
    className="w-full h-auto max-w-md mx-auto"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="mb-body" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="hsl(215 90% 52%)" />
        <stop offset="100%" stopColor="hsl(222 80% 28%)" />
      </linearGradient>
      <linearGradient id="mb-drawer" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="hsl(0 0% 100% / 0.95)" />
        <stop offset="100%" stopColor="hsl(220 30% 92%)" />
      </linearGradient>
    </defs>
    {/* body */}
    <rect x="40" y="40" width="320" height="280" rx="18" fill="url(#mb-body)" />
    <rect x="40" y="40" width="320" height="280" rx="18" fill="none" stroke="hsl(0 0% 100% / 0.2)" strokeWidth="1" />
    {/* compartment grid 6 cols x 10 rows */}
    {Array.from({ length: 60 }).map((_, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const x = 56 + col * 48;
      const y = 56 + row * 26;
      const isOpen = i === 26;
      return (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width={42}
            height={20}
            rx="3"
            fill={isOpen ? "url(#mb-drawer)" : "hsl(0 0% 100% / 0.08)"}
            stroke="hsl(0 0% 100% / 0.18)"
            strokeWidth="0.6"
          />
          <text x={x + 21} y={y + 13} textAnchor="middle" fill={isOpen ? "hsl(215 90% 30%)" : "hsl(0 0% 100% / 0.55)"} fontSize="6" fontFamily="monospace" fontWeight="bold">
            K{String(i + 1).padStart(2, "0")}
          </text>
        </g>
      );
    })}
    {/* open drawer extension */}
    <g>
      <rect x="56" y="170" width="62" height="22" rx="3" fill="url(#mb-drawer)" stroke="hsl(215 90% 52%)" strokeWidth="1.2" />
      <rect x="62" y="176" width="50" height="3" rx="1" fill="hsl(215 90% 52%)" />
      <rect x="62" y="182" width="38" height="3" rx="1" fill="hsl(200 100% 65%)" />
    </g>
    {/* badge */}
    <g>
      <rect x="265" y="335" width="80" height="18" rx="9" fill="hsl(0 0% 100%)" />
      <text x="305" y="347" textAnchor="middle" fill="hsl(215 90% 30%)" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
        SAIDA
      </text>
    </g>
  </svg>
);

export default Problem;