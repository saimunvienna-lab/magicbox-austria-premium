## Plan: Move Order section after Technology & update navbar

### 1. Reorder homepage sections
In `src/pages/Index.tsx`, move `<Order />` from its current position (after Testimonials) to immediately after `<Technology />`.

Current order: Hero → Problem → Solution → Technology → QRWorkflow → ... → Order → Contact → Dealer  
New order: Hero → Problem → Solution → Technology → Order → QRWorkflow → ... → Contact → Dealer

### 2. Update navbar menu
In `src/components/Navbar.tsx`, replace the Gallery link (`#gallery`) with an Order link (`#order`).

### 3. Add translation keys
In `src/lib/i18n.tsx`, add `nav_order` key:
- EN: "Order"
- DE: "Bestellung"

Remove the now-unused `nav_gallery` key from both language objects to keep i18n clean.