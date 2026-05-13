## Plan

Three coordinated changes. All visuals stay within the existing design system (semantic tokens: `primary`, `primary-glow`, `destructive`, `card`, `foreground`, `muted-foreground`, `shadow-elevated`, `bg-mesh`, `glass`, `text-gradient`). No new raw color classes — extend `tailwind.config.ts` only if a token is missing.

---

### 1. Hero — `src/components/sections/Hero.tsx` (full rewrite)

**SEO**
- Install `react-helmet-async` and wrap the app once in `src/main.tsx` with `<HelmetProvider>`.
- Inside Hero, render `<Helmet>` with:
  - `<title>Panzerglas Großhandel Österreich — 2000+ Modelle in einer Box | SAIDA MagicBox</title>`
  - meta description per spec
  - LocalBusiness + Organization JSON-LD (Wagramer Straße 195, 1210 Wien; areaServed AT/DE/CH; priceRange €€; url https://saidamagicbox.com).
- Remove the existing Product JSON-LD from `src/pages/Index.tsx` and the duplicate `<h1 class="sr-only">` so the new visible H1 is the only H1.

**Layout (full viewport, 12-col grid: 7 / 5)**
- `min-h-screen lg:min-h-screen` (90vh on mobile via `min-h-[90vh]`).
- Background: keep `bg-hero` + `bg-mesh`; add two large `primary` / `primary-glow` blurred blobs and a faint SVG noise/grid overlay (semantic tokens, not raw `blue-*`).
- LEFT (col-span-7): trust pill (🇦🇹 + "In Österreich entwickelt. Für ganz Europa."), H1, H2, supporting paragraph, 4-stat row (2.000+, 48+, 305, 1 m²) with count-up via `framer-motion` + IntersectionObserver, two CTAs (`Händler werden →` → `#order`/`#bestellung`, `Live-Demo ansehen ▶` → `#how`), trust microcopy line, social-proof avatar strip with 5 stub circles + "Wien, Graz, Linz, Salzburg & Klagenfurt".
- RIGHT (col-span-5): existing `boxFront` image as the hero unit + 3 floating glass cards (QR scan → iPhone 17 Pro Max K42; K26 Samsung Galaxy A14 5G ✓; "60 Schubladen · 305 Stück" gradient-border badge). Soft radial halo + a few faint floating particles via `framer-motion`.

**Copy (German primary)**
- H1: `Panzerglas Großhandel für Handy-Shops in Österreich` (last clause in `text-gradient`).
- H2: `2.000+ Modelle. 48+ Marken. Eine intelligente Box.` (numbers wrapped in bold).
- Paragraph + microcopy + CTA labels exactly per spec.
- Add new German + English keys to `src/lib/i18n.tsx` (`hero_h1`, `hero_h2`, `hero_para`, `hero_stat_*`, `hero_cta_dealer`, `hero_cta_demo`, `hero_trust_line`, `hero_social_proof`, `hero_announce`). German strings are the spec strings; English fallbacks are professional translations.

**Animations (framer-motion)**
- Staggered mount entrance (0.15s between trust pill → H1 → H2 → para → stats → CTAs → right column).
- Stats count up on viewport enter (1.5s ease-out).
- Floating cards: 4–6s y-axis loops, staggered.
- All animations gated by `useReducedMotion()`.

**Announcement bar**
- New `src/components/AnnouncementBar.tsx`: thin gradient bar (`bg-gradient-to-r from-primary to-primary-glow`) above Navbar with the 🇦🇹 message and an X dismiss (React state only). Render in `src/pages/Index.tsx` above `<Navbar />`. Navbar `top-0` becomes `top-[var(--announce-h)]` via simple offset class.

**Mobile (<768px)**
- Visual stacks above content at ~280px height; H1 `text-4xl`; stats become 2×2 grid; CTAs full-width stacked; only 3 social-proof avatars.

**Accessibility**
- German `alt` on all imagery; `aria-label` on icon CTAs; focus-visible ring using `ring-primary`; respects `prefers-reduced-motion`.

---

### 2. Problem section — `src/components/sections/Problem.tsx` (full rewrite into 3-part cinematic story)

Single component, three vertically stacked parts.

**Part 1 — "Die Realität in Österreichs Handyshops" (dark)**
- Background: `bg-foreground` / dark gradient via existing `bg-deep` token; two `destructive/20` blur blobs.
- 2-col split: LEFT 60% headline + 3 data cards stacked; RIGHT 40% SVG illustration of a chaotic drawer (inline SVG, no new asset) with subtle float.
- Eyebrow `DAS PROBLEM` (destructive, tracking-widest), H2 `Jeder Handyshop verliert €450 pro Woche — ohne es zu merken.`, sub `Wir haben 60 Handyshops in Wien analysiert. Das Ergebnis ist alarmierend.`
- 3 glass cards (`bg-card/5 backdrop-blur border-border/20`) with: 342 SKUs · "Endloses Chaos"; 12 Min · "Zeit ist Umsatz"; €2.800 · "Totes Kapital". Each: large gradient stat number (destructive→amber via existing tokens), label, description, lucide icon top-right (Layers / Clock / Wallet). Hover: destructive glow + `scale-[1.02]`.
- Stat numbers count up on viewport enter.

**Part 2 — Bridge (~120px, 80px mobile)**
- Full-width gradient (`from-foreground via-primary-deep to-primary` vertical).
- Centered SAIDA "S" mark (reuse Navbar logo style); above: `VORHER ↓` (destructive, opacity-50); below: `NACHHER ↑` (primary-glow, glowing).
- Faint particles drifting upward via framer-motion infinite loop.

**Part 3 — "Mit SAIDA MagicBox" (bright, mirrored)**
- Background: `from-background to-secondary/40` + `primary/20` blob mirrors Part 1.
- 2-col split mirrored: LEFT 40% MagicBox visual (reuse existing `saida-system.jpg` or simple isometric SVG with K01–K60 labels and one open drawer + pulse glow); RIGHT 60% headline + 3 benefit cards.
- Eyebrow `DIE LÖSUNG` (primary), H2 `Eine Box. 2.000+ Modelle. Null Chaos.`, sub per spec.
- 3 benefit cards (glass `bg-card/80 backdrop-blur-xl border-primary/10 shadow-elevated`): –90% "Maximaler Platz" (TrendingDown); 15 Sek "Sofort-Service" (Zap); €2.850 "ROI in 30 Tagen" (TrendingUp). Hover: primary glow + arrow slides right + `scale-[1.02]`.
- Stat numbers count up on viewport enter.

**Shared**
- All German strings added to `src/lib/i18n.tsx` (German primary, English fallback). Replace existing `p1_*`, `pb1_*` keys; add new keys for stats, eyebrows, bridge labels.
- Stagger fade-in via `framer-motion` `whileInView` (0.1s between cards).
- Cards stack on mobile, stat sizes scale down to `text-5xl`.

---

### 3. Swap section order — `src/pages/Index.tsx`

Inside the `<Suspense>` block, swap `<Solution />` and `<Technology />` so render order becomes:

```text
Problem
Technology   ← was Solution
Solution     ← was Technology
Order
QRWorkflow
...
```

The anchor IDs (`#solution`, `#technology`) stay on their respective components — only the on-page order changes. Navbar links continue to work because they target IDs, not position.

---

### Technical notes

- New dependency: `react-helmet-async`.
- New file: `src/components/AnnouncementBar.tsx`.
- Edits: `src/components/sections/Hero.tsx`, `src/components/sections/Problem.tsx`, `src/lib/i18n.tsx`, `src/pages/Index.tsx`, `src/main.tsx` (add `HelmetProvider`).
- No backend, routing, or schema changes. No new theme colors — only existing semantic tokens. `framer-motion` is already in the stack from earlier sections that use `animate-*` utilities; if not installed it will be added.
- Build will be verified after implementation (typecheck + visual preview).
