export type BodyBlock = {
  type: "h2" | "h3" | "p" | "quote" | "list";
  id?: string;
  text?: string;
  items?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  category: string;
  category_en: string;
  date: string;
  readTime: string;
  image: string;
  toc: { id: string; label: string }[];
  toc_en: { id: string; label: string }[];
  body: BodyBlock[];
  body_en: BodyBlock[];
  faq: { q: string; a: string }[];
  faq_en: { q: string; a: string }[];
  keywords: string[];
};

/* ── Images (Unsplash) ──────────────────────────────────── */
const IMG_INVENTORY = "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&auto=format&fit=crop&q=82";
const IMG_GLASS     = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&auto=format&fit=crop&q=82";
const IMG_SHOP      = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&auto=format&fit=crop&q=82";

/* ── Posts ──────────────────────────────────────────────── */
export const posts: BlogPost[] = [
  {
    slug: "lagerkosten-handyshop-reduzieren",

    /* DE */
    title:   "Wie Handyshops ihre Lagerkosten drastisch reduzieren können",
    excerpt: "Hunderte Schutzglas-SKUs binden Kapital, Zeit und Fläche. So senken moderne Handyshops ihre Lagerkosten um bis zu 70 % – mit einem intelligenten Inventarsystem statt klassischer Regalwand.",
    category: "Inventar",

    /* EN */
    title_en:   "How Mobile Phone Shops Can Drastically Reduce Inventory Costs",
    excerpt_en: "Hundreds of screen protector SKUs tie up capital, time and space. Here's how modern mobile shops reduce inventory costs by up to 70% — with a smart system instead of traditional shelving.",
    category_en: "Inventory",

    date: "2026-04-12",
    readTime: "7 min",
    image: IMG_INVENTORY,
    keywords: ["Panzerglas Großhandel Österreich", "Handyshop Zubehör", "Mobile Shop Inventory System"],

    toc: [
      { id: "warum",  label: "Warum klassisches Lager nicht mehr funktioniert" },
      { id: "kosten", label: "Die versteckten Kosten von Schutzglas-SKUs" },
      { id: "system", label: "Vom Regal zum intelligenten System" },
      { id: "praxis", label: "Praxisbeispiel: 70 % weniger Lager" },
      { id: "fazit",  label: "Fazit" },
    ],
    toc_en: [
      { id: "warum",  label: "Why traditional inventory no longer works" },
      { id: "kosten", label: "The hidden costs of screen protector SKUs" },
      { id: "system", label: "From shelves to an intelligent system" },
      { id: "praxis", label: "Real case: 70% less inventory" },
      { id: "fazit",  label: "Conclusion" },
    ],

    body: [
      { type: "p", text: "Schutzglas ist eines der margenstärksten Produkte im Handyshop – und gleichzeitig eines der am schlechtesten verwalteten. In den meisten europäischen Mobilfunkshops liegen heute mehrere hundert verschiedene Schutzglas-Varianten in Schubladen, Schachteln und auf Regalen. Was wie ein operativer Detail-Punkt aussieht, ist in Wirklichkeit ein massiver Kostenblock." },
      { type: "h2", id: "warum", text: "Warum klassisches Lager nicht mehr funktioniert" },
      { type: "p", text: "Mit jedem neuen Smartphone-Modell wächst die Anzahl der benötigten Schutzgläser. Ein typischer Handyshop führt heute Glas für 200 bis 600 Modelle. Das bedeutet: tausende Einzelartikel, hunderte Lieferanten-Bestellungen pro Jahr und ein Lager, das niemand wirklich überblickt." },
      { type: "list", items: [
        "Mitarbeiter verlieren 10–20 Minuten pro Kunde mit der Suche nach dem richtigen Modell.",
        "Slow-Mover blockieren bis zu 40 % des gesamten Zubehör-Bestands.",
        "Hot-Seller sind regelmäßig out-of-stock – genau dann, wenn die Marge am höchsten wäre.",
      ]},
      { type: "quote", text: "Wer im Mobilfunkhandel Lager nicht digital denkt, verliert jede Woche Geld – ohne es zu sehen." },
      { type: "h2", id: "kosten", text: "Die versteckten Kosten von Schutzglas-SKUs" },
      { type: "p", text: "Lagerkosten sind nicht nur die Einkaufskosten. Sie umfassen Kapitalbindung, Lagerfläche, Personalzeit, Inventurfehler und Abschreibungen auf veraltete Modelle. Rechnet man diese Faktoren zusammen, liegen die echten Kosten pro SKU oft bei 180–240 % des reinen Einkaufspreises." },
      { type: "h3", text: "Die häufigsten Kostenfallen" },
      { type: "list", items: [
        "Überbestände bei Modellen, die längst aus dem Markt sind.",
        "Mehrfachbestellungen, weil niemand weiß, was wirklich noch im Lager ist.",
        "Falsch beschriftete Schubladen, die zu Fehlinstallationen und Reklamationen führen.",
      ]},
      { type: "h2", id: "system", text: "Vom Regal zum intelligenten System" },
      { type: "p", text: "Moderne Handyshops setzen auf Inventarsysteme, die Hardware, Software und Datenbank verbinden. Statt 600 Einzelboxen reicht ein einziges Schubladensystem mit eindeutiger Codierung. Über einen QR-Code findet jeder Mitarbeiter in Sekunden das passende Schutzglas – auch ohne Schulung." },
      { type: "h2", id: "praxis", text: "Praxisbeispiel: 70 % weniger Lager" },
      { type: "p", text: "Ein Partner-Shop in Wien hat mit dem Umstieg auf das SAIDA MagicBox System seine Schutzglas-SKUs von 540 auf 305 reduziert – ohne Umsatzeinbußen. Im Gegenteil: Bearbeitungszeit pro Kunde sank um 80 %, die Marge stieg um 38 %." },
      { type: "h2", id: "fazit", text: "Fazit" },
      { type: "p", text: "Lagerkosten sind im Handyshop kein Schicksal, sondern eine Frage des Systems. Wer Schutzglas weiterhin wie 2010 verwaltet, zahlt 2026 jeden Monat dafür." },
    ],

    body_en: [
      { type: "p", text: "Screen protectors are among the highest-margin products in any mobile phone shop — and simultaneously among the most poorly managed. Most European mobile shops today have hundreds of different screen protector variants scattered across drawers, boxes and shelves. What looks like an operational detail is in reality a massive cost block." },
      { type: "h2", id: "warum", text: "Why traditional inventory no longer works" },
      { type: "p", text: "With every new smartphone model, the number of required screen protectors grows. A typical mobile phone shop today stocks glass for 200 to 600 models. That means thousands of individual items, hundreds of supplier orders per year, and inventory that nobody truly understands." },
      { type: "list", items: [
        "Staff lose 10–20 minutes per customer searching for the right model.",
        "Slow-movers block up to 40% of total accessory stock.",
        "Hot-sellers are regularly out of stock — exactly when margins would be highest.",
      ]},
      { type: "quote", text: "In mobile retail, anyone who doesn't think digitally about inventory is losing money every week — without seeing it." },
      { type: "h2", id: "kosten", text: "The hidden costs of screen protector SKUs" },
      { type: "p", text: "Inventory costs aren't just purchasing costs. They include tied-up capital, storage space, staff time, inventory errors and write-downs on outdated models. Add these up and the true cost per SKU is often 180–240% of the pure purchase price." },
      { type: "h3", text: "The most common cost traps" },
      { type: "list", items: [
        "Overstocks on models that have long left the market.",
        "Duplicate orders because nobody knows what's actually left in stock.",
        "Mislabelled drawers causing incorrect installations and complaints.",
      ]},
      { type: "h2", id: "system", text: "From shelves to an intelligent system" },
      { type: "p", text: "Modern mobile shops rely on inventory systems that connect hardware, software and database. Instead of 600 individual boxes, a single drawer system with clear coding is enough. Via QR code, any staff member finds the right screen protector in seconds — even without training." },
      { type: "h2", id: "praxis", text: "Real case: 70% less inventory" },
      { type: "p", text: "A partner shop in Vienna reduced its screen protector SKUs from 540 to 305 after switching to SAIDA MagicBox — without any loss in revenue. On the contrary: processing time per customer dropped by 80%, and margins rose by 38%." },
      { type: "h2", id: "fazit", text: "Conclusion" },
      { type: "p", text: "Inventory costs in mobile phone shops aren't inevitable — they're a question of the right system. Anyone still managing screen protectors the way they did in 2010 is paying for it every month in 2026." },
    ],

    faq: [
      { q: "Wie viel Lagerfläche spart das MagicBox System?", a: "Im Schnitt ersetzen wir eine ganze Regalwand durch ein einziges, counter-ready Schubladensystem – das entspricht 60–80 % weniger Fläche." },
      { q: "Funktioniert das auch in kleinen Shops?", a: "Ja. Gerade kleine Shops profitieren am stärksten, weil jede freie Fläche direkt in Umsatz oder Reparaturarbeitsplatz umgewandelt werden kann." },
      { q: "Wie lange dauert die Umstellung?", a: "Der Onboarding-Prozess dauert in der Regel weniger als einen Arbeitstag – inklusive Einrichtung der Datenbank und Mitarbeiter-Briefing." },
    ],
    faq_en: [
      { q: "How much storage space does the MagicBox system save?", a: "On average, we replace an entire shelving wall with a single counter-ready drawer system — that's 60–80% less space." },
      { q: "Does it work in small shops too?", a: "Yes. Especially small shops benefit most, because every freed-up space can be turned directly into revenue or a repair workstation." },
      { q: "How long does the switch take?", a: "The onboarding process typically takes less than one working day — including database setup and staff briefing." },
    ],
  },

  /* ──────────────────────────────────────────────────────── */

  {
    slug: "universelles-panzerglas-zukunft",

    title:   "Warum universelles Panzerglas die Zukunft von Handyshops ist",
    excerpt: "Universal-Panzerglas verändert die Wirtschaftlichkeit ganzer Handyshops. Wir zeigen, warum elektroplattiertes, falt-resistentes Glas der neue Standard im europäischen Mobilfunkhandel wird.",
    category: "Technologie",

    title_en:   "Why Universal Tempered Glass Is the Future of Mobile Phone Shops",
    excerpt_en: "Universal tempered glass is changing the economics of entire mobile phone shops. Here's why electroplated, fold-resistant glass is becoming the new standard in European mobile retail.",
    category_en: "Technology",

    date: "2026-03-28",
    readTime: "6 min",
    image: IMG_GLASS,
    keywords: ["Universal Panzerglas", "Panzerglas Großhandel Österreich", "Handy Zubehör B2B"],

    toc: [
      { id: "definition", label: "Was bedeutet universelles Panzerglas?" },
      { id: "vorteile",   label: "Vorteile für Handyshops" },
      { id: "technologie",label: "Die Technologie dahinter" },
      { id: "markt",      label: "Europäischer Markt 2026" },
      { id: "fazit",      label: "Fazit" },
    ],
    toc_en: [
      { id: "definition", label: "What is universal tempered glass?" },
      { id: "vorteile",   label: "Benefits for mobile phone shops" },
      { id: "technologie",label: "The technology behind it" },
      { id: "markt",      label: "European market 2026" },
      { id: "fazit",      label: "Conclusion" },
    ],

    body: [
      { type: "p", text: "Über Jahre galt: Jedes Smartphone braucht sein eigenes, exakt zugeschnittenes Panzerglas. Diese Logik kostet Handyshops jeden Monat Tausende Euro – in Form von Lager, Verschnitt und veralteten Beständen. Universal-Panzerglas bricht mit diesem Modell." },
      { type: "h2", id: "definition", text: "Was bedeutet universelles Panzerglas?" },
      { type: "p", text: "Universelles Panzerglas ist nicht 'ein Glas für alles' – es ist ein präzise abgestimmtes System aus wenigen Größen, das durch elektroplattierte Beschichtung und falt-resistente Kanten auf nahezu alle modernen Smartphones passt." },
      { type: "h2", id: "vorteile", text: "Vorteile für Handyshops" },
      { type: "list", items: [
        "Drastische Reduktion der SKUs – mehr Modelle mit weniger Lager.",
        "Schnellere Bedienung am Counter – kein Suchen, kein Bestellen.",
        "Geringere Reklamationsquote durch standardisierte Qualität.",
        "Höhere Marge pro verkauftem Stück.",
      ]},
      { type: "quote", text: "Universalität ist im Mobilfunkhandel kein Kompromiss – sie ist die einzige Antwort auf eine Modell-Explosion ohne Ende." },
      { type: "h2", id: "technologie", text: "Die Technologie dahinter" },
      { type: "p", text: "Hochwertiges Universal-Panzerglas basiert auf einer 9H-elektroplattierten Oberfläche mit Anti-Fingerprint-, Anti-Glare- und Oleophob-Beschichtung. Die falt-resistente Kantengeometrie sorgt dafür, dass das Glas auch nach Stürzen und Hosentaschen-Alltag intakt bleibt." },
      { type: "h3", text: "Was ein Premium-Glas ausmacht" },
      { type: "list", items: [
        "0,33 mm Präzisionsdicke",
        "99,9 % Klarheit",
        "Antistatischer ESD-Kleber",
        "Geprüfte Bruchfestigkeit nach europäischen Standards",
      ]},
      { type: "h2", id: "markt", text: "Europäischer Markt 2026" },
      { type: "p", text: "Der europäische Mobilfunk-Einzelhandel steht 2026 unter Margendruck. Wer überleben will, muss Lager, Personal und Zeit effizient einsetzen. Universal-Panzerglas ist dabei einer der größten Hebel – und eine der wenigen Möglichkeiten, gleichzeitig Kosten zu senken und Service zu verbessern." },
      { type: "h2", id: "fazit", text: "Fazit" },
      { type: "p", text: "Universal-Panzerglas ist keine Übergangslösung – es ist die strategische Standardausrüstung für jeden Handyshop, der 2026 profitabel bleiben will." },
    ],

    body_en: [
      { type: "p", text: "For years the rule was: every smartphone needs its own precisely cut screen protector. That logic costs mobile phone shops thousands of euros every month — in storage, waste and outdated stock. Universal tempered glass breaks this model." },
      { type: "h2", id: "definition", text: "What is universal tempered glass?" },
      { type: "p", text: "Universal tempered glass isn't 'one glass for everything' — it's a precisely coordinated system of a few sizes that, through electroplated coating and fold-resistant edges, fits almost all modern smartphones." },
      { type: "h2", id: "vorteile", text: "Benefits for mobile phone shops" },
      { type: "list", items: [
        "Dramatic reduction in SKUs — more models with less inventory.",
        "Faster counter service — no searching, no ordering delays.",
        "Lower complaint rate through standardised quality.",
        "Higher margin per unit sold.",
      ]},
      { type: "quote", text: "Universality in mobile retail is not a compromise — it's the only answer to a never-ending model explosion." },
      { type: "h2", id: "technologie", text: "The technology behind it" },
      { type: "p", text: "Premium universal tempered glass is based on a 9H electroplated surface with anti-fingerprint, anti-glare and oleophobic coating. The fold-resistant edge geometry ensures the glass remains intact after drops and daily pocket use." },
      { type: "h3", text: "What makes a premium glass" },
      { type: "list", items: [
        "0.33mm precision thickness",
        "99.9% clarity",
        "Anti-static ESD adhesive",
        "Verified impact resistance to European standards",
      ]},
      { type: "h2", id: "markt", text: "European market 2026" },
      { type: "p", text: "European mobile retail is under margin pressure in 2026. Those who want to survive must deploy inventory, staff and time efficiently. Universal tempered glass is one of the biggest levers — and one of the few ways to simultaneously cut costs and improve service." },
      { type: "h2", id: "fazit", text: "Conclusion" },
      { type: "p", text: "Universal tempered glass isn't a transitional solution — it's the strategic standard equipment for every mobile phone shop that wants to stay profitable in 2026." },
    ],

    faq: [
      { q: "Passt Universal-Panzerglas wirklich auf alle Modelle?", a: "Auf nahezu alle modernen Smartphones der letzten 5 Jahre. Über die SAIDA Datenbank ist jede Modell-Zuordnung in Sekunden abrufbar." },
      { q: "Ist die Schutzwirkung identisch zu Custom-Glas?", a: "Bei elektroplattiertem 9H-Glas ja. Sturz- und Bruchwerte liegen auf Premium-Niveau." },
      { q: "Wo wird SAIDA Glas produziert?", a: "Designed in Austria, produziert nach europäischen Qualitätsstandards mit RoHS- und REACH-Konformität." },
    ],
    faq_en: [
      { q: "Does universal tempered glass really fit all models?", a: "Almost all modern smartphones from the last 5 years. Every model assignment is accessible in seconds via the SAIDA database." },
      { q: "Is the protection the same as custom glass?", a: "With 9H electroplated glass, yes. Drop and impact values are at premium level." },
      { q: "Where is SAIDA glass produced?", a: "Designed in Austria, manufactured to European quality standards with RoHS and REACH compliance." },
    ],
  },

  /* ──────────────────────────────────────────────────────── */

  {
    slug: "probleme-moderner-handyshops",

    title:   "Die größten Probleme moderner Handyshops – und wie intelligente Systeme helfen",
    excerpt: "Personalmangel, Modell-Explosion, sinkende Margen: Moderne Handyshops kämpfen 2026 an mehreren Fronten. Welche operativen Probleme sich durch intelligente B2B-Systeme tatsächlich lösen lassen.",
    category: "Retail",

    title_en:   "The Biggest Problems of Modern Mobile Shops — and How Smart Systems Help",
    excerpt_en: "Staff shortages, model explosion, shrinking margins: modern mobile shops face pressure on multiple fronts in 2026. Which operational problems intelligent B2B systems can actually solve.",
    category_en: "Retail",

    date: "2026-03-10",
    readTime: "8 min",
    image: IMG_SHOP,
    keywords: ["Handyshop Zubehör", "Mobile Shop Inventory System", "Handy Zubehör B2B"],

    toc: [
      { id: "personal", label: "Problem 1: Personalmangel" },
      { id: "modelle",  label: "Problem 2: Modell-Explosion" },
      { id: "marge",    label: "Problem 3: Sinkende Margen" },
      { id: "loesung",  label: "Lösung: Intelligente Systeme" },
      { id: "fazit",    label: "Fazit" },
    ],
    toc_en: [
      { id: "personal", label: "Problem 1: Staff shortages" },
      { id: "modelle",  label: "Problem 2: Model explosion" },
      { id: "marge",    label: "Problem 3: Shrinking margins" },
      { id: "loesung",  label: "Solution: Smart systems" },
      { id: "fazit",    label: "Conclusion" },
    ],

    body: [
      { type: "p", text: "Der europäische Mobilfunk-Einzelhandel steht unter dreifachem Druck: weniger Personal, mehr Modelle, kleinere Margen. Wer 2026 profitabel arbeiten will, braucht keine größere Verkaufsfläche – sondern bessere Systeme." },
      { type: "h2", id: "personal", text: "Problem 1: Personalmangel" },
      { type: "p", text: "Qualifizierte Mitarbeiter sind im stationären Handel zur Mangelware geworden. Komplexes Produktwissen lässt sich nicht in zwei Wochen einlernen – außer das System reduziert die nötige Komplexität." },
      { type: "list", items: [
        "Neue Mitarbeiter brauchen oft Wochen, um Schutzglas-Lager zu verstehen.",
        "Fehler in der Modellzuordnung führen zu Reklamationen.",
        "Krankheitsausfälle legen ganze Verkaufsabläufe lahm.",
      ]},
      { type: "h2", id: "modelle", text: "Problem 2: Modell-Explosion" },
      { type: "p", text: "Apple, Samsung, Xiaomi, Honor, Nothing, Google, OnePlus, Motorola – die Anzahl relevanter Smartphone-Modelle ist in den letzten fünf Jahren um über 200 % gestiegen. Klassische Lagerlogik kann da nicht mehr mithalten." },
      { type: "quote", text: "Nicht der Markt ist zu schnell – die Systeme im Handyshop sind zu langsam." },
      { type: "h2", id: "marge", text: "Problem 3: Sinkende Margen" },
      { type: "p", text: "Hardware-Margen sind im freien Mobilfunkhandel seit Jahren rückläufig. Zubehör – insbesondere Schutzglas – ist eine der wenigen Marktnischen mit echtem Spielraum. Aber nur, wenn Lager und Prozess stimmen." },
      { type: "h2", id: "loesung", text: "Lösung: Intelligente Systeme" },
      { type: "p", text: "SAIDA MagicBox kombiniert Schubladen-Hardware, QR-Software und eine ständig aktualisierte Modell-Datenbank zu einem System, das bewusst für die Realität europäischer Handyshops gebaut ist." },
      { type: "h3", text: "Konkrete Effekte in der Praxis" },
      { type: "list", items: [
        "Bis zu 70 % weniger SKUs",
        "80 % schnellere Bedienung am Counter",
        "99 % Bestandsgenauigkeit statt Inventur-Chaos",
        "Bis zu +38 % höhere Zubehör-Marge",
      ]},
      { type: "h2", id: "fazit", text: "Fazit" },
      { type: "p", text: "Die Probleme moderner Handyshops sind real – aber lösbar. Nicht durch mehr Personal oder mehr Lager, sondern durch klügere Systeme. Genau hier setzt SAIDA MagicBox an." },
    ],

    body_en: [
      { type: "p", text: "European mobile retail faces triple pressure: fewer staff, more models, smaller margins. Those who want to operate profitably in 2026 don't need a larger shop floor — they need better systems." },
      { type: "h2", id: "personal", text: "Problem 1: Staff shortages" },
      { type: "p", text: "Qualified staff have become scarce in physical retail. Complex product knowledge can't be learned in two weeks — unless the system reduces the complexity required." },
      { type: "list", items: [
        "New staff often need weeks to understand screen protector inventory.",
        "Model assignment errors lead to complaints and returns.",
        "Sick leave can paralyse entire sales workflows.",
      ]},
      { type: "h2", id: "modelle", text: "Problem 2: Model explosion" },
      { type: "p", text: "Apple, Samsung, Xiaomi, Honor, Nothing, Google, OnePlus, Motorola — the number of relevant smartphone models has risen by over 200% in the last five years. Traditional inventory logic can no longer keep up." },
      { type: "quote", text: "The market isn't moving too fast — the systems inside mobile shops are moving too slow." },
      { type: "h2", id: "marge", text: "Problem 3: Shrinking margins" },
      { type: "p", text: "Hardware margins in independent mobile retail have been declining for years. Accessories — especially screen protectors — are one of the few market niches with genuine room to manoeuvre. But only when inventory and process are right." },
      { type: "h2", id: "loesung", text: "Solution: Smart systems" },
      { type: "p", text: "SAIDA MagicBox combines drawer hardware, QR software and a constantly updated model database into a system built intentionally for the reality of European mobile phone shops." },
      { type: "h3", text: "Concrete results in practice" },
      { type: "list", items: [
        "Up to 70% fewer SKUs",
        "80% faster counter service",
        "99% inventory accuracy instead of stocktake chaos",
        "Up to +38% higher accessory margin",
      ]},
      { type: "h2", id: "fazit", text: "Conclusion" },
      { type: "p", text: "The problems of modern mobile phone shops are real — but solvable. Not through more staff or more inventory, but through smarter systems. That's exactly where SAIDA MagicBox steps in." },
    ],

    faq: [
      { q: "Eignet sich MagicBox auch für Reparatur-Shops?", a: "Ja. Gerade Repair-Shops profitieren, weil Schutzglas oft direkt nach Display-Reparaturen verkauft wird." },
      { q: "Wie wird die Modell-Datenbank aktualisiert?", a: "Monatlich – inklusive aller relevanten Neuerscheinungen am europäischen Markt." },
      { q: "Gibt es Mindestabnahmen?", a: "Nein. Händler starten mit einer Sample Box und skalieren je nach Bedarf." },
    ],
    faq_en: [
      { q: "Is MagicBox suitable for repair shops too?", a: "Yes. Repair shops in particular benefit because screen protectors are often sold directly after display repairs." },
      { q: "How is the model database updated?", a: "Monthly — including all relevant new releases on the European market." },
      { q: "Are there minimum order quantities?", a: "No. Dealers start with a sample box and scale as needed." },
    ],
  },
];

export const getPost    = (slug: string) => posts.find((p) => p.slug === slug);
export const getRelated = (slug: string) => posts.filter((p) => p.slug !== slug).slice(0, 2);
