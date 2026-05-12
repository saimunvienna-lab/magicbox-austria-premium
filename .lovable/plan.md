## Goal
Keep the existing "Handyshops verlieren Stunden mit Glas-Sortierung" heading and the 3 current problem cards (Endless Inventory, Lost Time, Tied Up Capital), and add 3 new benefit cards below them in the same section.

## Changes

**File: `src/components/sections/Problem.tsx`**
- Keep the existing 3 problem cards (red/destructive icon style) untouched.
- Add a second array of 3 benefit cards rendered below, with positive styling (primary/cyan gradient icons instead of destructive red) to visually contrast.
- Optional small divider/eyebrow ("DIE LÖSUNG FÜR HÄNDLER" / "The dealer advantage") between the two rows for clarity.
- Grid stays `md:grid-cols-3` so both rows align.

**New benefit cards:**

| Icon | Title | Description |
|---|---|---|
| `TrendingUp` | High Profit Potential | Buy low. Sell fast. Earn per unit. Strong resale margin designed for mobile shop owners. |
| `Zap` | Fast Selling Product | High customer demand in every mobile shop. Moves quickly — no dead stock issues. |
| `PackageCheck` | Ready Stock Supply | Available in bulk with consistent supply. Perfect for repeat orders and shop scaling. |

**File: `src/lib/i18n.tsx`**
- Add 6 new translation keys (title + description for each of the 3 benefit cards) plus an eyebrow key, in all supported languages, mirroring the existing `p1_t`/`p1_d` pattern (e.g. `pb1_t`, `pb1_d`, …).

## Layout
```text
[ DAS PROBLEM ]
Handyshops verlieren Stunden mit Glas-Sortierung.
Hunderte SKUs. ...

[ Endless Inventory ] [ Lost Time ] [ Tied Up Capital ]   ← red icons

[ DEALER ADVANTAGE ]   ← small eyebrow

[ High Profit ]      [ Fast Selling ]   [ Ready Stock ]   ← cyan icons
```

No other sections, routes, or business logic are touched.