## Plan

### 1. Modernize the Problem / Dealer Advantage section
File: `src/components/sections/Problem.tsx`

Goal: make the two card grids (3 problem + 3 benefit) feel modern, with visual depth and motion, while staying fully responsive.

Visual changes:
- Replace flat bordered cards with layered glassmorphic cards: subtle gradient border (using `before:` pseudo with `bg-gradient-to-br`), inner `bg-card/60 backdrop-blur`, and soft `shadow-elevated` on hover.
- Add animated decorative blobs behind each grid (blurred primary/destructive radial gradients, hidden on small screens for performance).
- Problem cards: red→orange gradient icon tile with inner glow ring; small "01 / 02 / 03" index label in the corner.
- Benefit cards: cyan→primary-glow gradient icon tile with shadow-glow; animated arrow that slides in on hover; corner sparkle accent.
- Section header: split eyebrow + heading into a two-column intro on desktop (heading left, supporting paragraph right) for a more editorial feel.
- Add a thin gradient divider between the "Problem" and "Dealer Advantage" blocks instead of just spacing.
- Motion: stagger fade-up entrance via `animate-fade-up` with incremental `animationDelay`; hover lift + scale on icon already partially present, refine timing.
- Responsive: 1 col (mobile) → 2 col (sm/md) → 3 col (lg). Tighten paddings on mobile (`p-6 sm:p-8`). Decorative blobs `hidden sm:block`.
- Use only semantic tokens from `index.css` / `tailwind.config.ts` (primary, primary-glow, destructive, card, muted-foreground, etc.).

### 2. WhatsApp number update
Update the phone number in:
- `src/components/WhatsAppButton.tsx` (currently `4367696177230` → `436769617723`)
- `src/components/sections/Order.tsx` line 305 (same change)

### 3. Hero floating card label
`src/components/sections/Hero.tsx` line 96: change `iPhone 15 Pro Max` → `iPhone 17 Pro Max`.

### 4. Imprint email
`src/pages/Legal.tsx` impressum block (EN + DE): change `hello@saidamagicbox.eu` → `office@saidamagicbox.com`.

### 5. Replace "Innsbruck, Austria" with "Vienna, Austria" everywhere
- `src/components/sections/Contact.tsx` (MapPin label)
- `src/components/sections/Footer.tsx` (footer line, keep 🇦🇹)
- `src/pages/Index.tsx` (JSON-LD `addressLocality`: `Innsbruck` → `Vienna`)
- `src/pages/Legal.tsx`: all occurrences (Impressum address EN/DE, Datenschutz controller EN/DE, AGB jurisdiction EN/DE — including German "Innsbruck, Österreich" → "Wien, Österreich").

### 6. Right of Withdrawal email
`src/pages/Legal.tsx` widerruf block (EN + DE): change `hello@saidamagicbox.eu` → `office@saidamagicbox.com`.

### Notes
- Also update the remaining `hello@saidamagicbox.eu` occurrences in Datenschutz EN/DE to `office@saidamagicbox.com` for consistency (same domain change you requested in §4 and §6). Confirm if you'd rather keep `.eu` there.
- No backend, routing, or i18n key changes required.
