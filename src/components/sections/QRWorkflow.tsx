import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DB = [
  {"b":"Apple","m":"iPhone X","k":"K01"},{"b":"Apple","m":"iPhone XS","k":"K01"},{"b":"Apple","m":"iPhone 11 Pro","k":"K01"},
  {"b":"Apple","m":"iPhone 11","k":"K02"},{"b":"Apple","m":"iPhone XR","k":"K02"},
  {"b":"Apple","m":"iPhone 11 Pro Max","k":"K03"},{"b":"Apple","m":"iPhone XS Max","k":"K03"},
  {"b":"Apple","m":"iPhone 12","k":"K04"},{"b":"Apple","m":"iPhone 12 Pro","k":"K04"},
  {"b":"Apple","m":"iPhone 12 Pro Max","k":"K05"},
  {"b":"Apple","m":"iPhone 13","k":"K06"},{"b":"Apple","m":"iPhone 13 Pro","k":"K06"},{"b":"Apple","m":"iPhone 14","k":"K06"},{"b":"Apple","m":"iPhone 16E","k":"K06"},
  {"b":"Apple","m":"iPhone 13 Pro Max","k":"K07"},{"b":"Apple","m":"iPhone 14 Plus","k":"K07"},
  {"b":"Apple","m":"iPhone 14 Pro","k":"K08"},{"b":"Apple","m":"iPhone 15","k":"K08"},{"b":"Apple","m":"iPhone 16","k":"K08"},
  {"b":"Apple","m":"iPhone 14 Pro Max","k":"K09"},{"b":"Apple","m":"iPhone 15 Plus","k":"K09"},{"b":"Apple","m":"iPhone 16 Plus","k":"K09"},
  {"b":"Apple","m":"iPhone 15 Pro","k":"K10"},{"b":"Apple","m":"iPhone 15 Pro Max","k":"K11"},
  {"b":"Apple","m":"iPhone 16 Pro","k":"K12"},{"b":"Apple","m":"iPhone 17","k":"K12"},{"b":"Apple","m":"iPhone 17 PRO","k":"K12"},
  {"b":"Apple","m":"iPhone 16 Pro Max","k":"K13"},{"b":"Apple","m":"iPhone 17 PRO MAX","k":"K13"},
  {"b":"Apple","m":"iPhone 17 AIR","k":"K13-1"},
  {"b":"Samsung","m":"Samsung Galaxy S21 5G","k":"K14+"},
  {"b":"Google","m":"Google Pixel 7a","k":"K14+"},{"b":"Google","m":"Google Pixel 9","k":"K14+"},{"b":"Google","m":"Google Pixel 9 PRO","k":"K14+"},
  {"b":"Samsung","m":"Samsung Galaxy A24 4G","k":"K15+"},{"b":"Samsung","m":"Samsung Galaxy A25","k":"K15+"},{"b":"Samsung","m":"Samsung Galaxy S21+ 5G","k":"K15+"},{"b":"Samsung","m":"Samsung Galaxy M31s","k":"K15+"},
  {"b":"Vivo","m":"vivo T2","k":"K15+"},{"b":"Oppo","m":"Oppo A54","k":"K15+"},{"b":"Huawei","m":"Huawei Y9s","k":"K15+"},{"b":"Redmi","m":"Redmi Note 9 5G","k":"K15+"},{"b":"Nothing Phone","m":"Nothing Phone (1)","k":"K15+"},
  {"b":"Samsung","m":"Samsung Galaxy S23","k":"K16+"},{"b":"Samsung","m":"Samsung Galaxy S22 5G","k":"K16+"},{"b":"LG","m":"LG K31","k":"K16+"},{"b":"Tecno","m":"Tecno Pop 5S","k":"K16+"},
  {"b":"Samsung","m":"Samsung Galaxy S23 FE","k":"K17+"},{"b":"Samsung","m":"Samsung Galaxy S23+","k":"K17+"},{"b":"Samsung","m":"Samsung Galaxy S22+ 5G","k":"K17+"},{"b":"Samsung","m":"Samsung Galaxy A54","k":"K17+"},{"b":"Meizu","m":"Meizu 21","k":"K17+"},{"b":"Meizu","m":"Meizu 20","k":"K17+"},{"b":"Huawei","m":"HUAWEI PURA 80","k":"K17+"},
  {"b":"Samsung","m":"Samsung Galaxy S24","k":"K18+"},{"b":"Huawei","m":"Huawei P30","k":"K18+"},{"b":"Huawei","m":"Huawei P40","k":"K18+"},
  {"b":"Samsung","m":"Samsung Galaxy S24+","k":"K19+"},{"b":"Samsung","m":"Samsung Galaxy M15","k":"K19+"},{"b":"Samsung","m":"Samsung Galaxy A15","k":"K19+"},{"b":"Honor","m":"Honor 8X","k":"K19+"},{"b":"LG","m":"LG Q60","k":"K19+"},
  {"b":"Samsung","m":"Samsung Galaxy S24 Ultra","k":"K20+"},
  {"b":"Vivo","m":"vivo Y77e","k":"K21"},{"b":"Vivo","m":"vivo Y35","k":"K21"},{"b":"Vivo","m":"vivo Y22","k":"K21"},{"b":"Vivo","m":"vivo Y21","k":"K21"},{"b":"Vivo","m":"vivo Y20","k":"K21"},{"b":"Vivo","m":"vivo Y16","k":"K21"},{"b":"Vivo","m":"vivo iQOO Z6","k":"K21"},
  {"b":"Oppo","m":"Oppo A16s","k":"K21"},{"b":"Oppo","m":"Oppo A15","k":"K21"},{"b":"Oppo","m":"Oppo A38","k":"K21"},{"b":"Oppo","m":"Oppo A57","k":"K21"},{"b":"Oppo","m":"Oppo A78","k":"K21"},{"b":"Oppo","m":"Oppo A9 (2020)","k":"K21"},
  {"b":"Redmi","m":"Redmi A2","k":"K21"},{"b":"Redmi","m":"Redmi A1","k":"K21"},{"b":"Redmi","m":"Redmi 10A","k":"K21"},{"b":"Redmi","m":"Redmi 9C","k":"K21"},{"b":"Redmi","m":"Redmi 9A","k":"K21"},
  {"b":"Realme","m":"Realme C15","k":"K21"},{"b":"Realme","m":"Realme C3","k":"K21"},{"b":"Realme","m":"Realme C25","k":"K21"},{"b":"Realme","m":"Realme C30","k":"K21"},{"b":"Realme","m":"Realme 5","k":"K21"},{"b":"Realme","m":"Realme Narzo 50A","k":"K21"},
  {"b":"Samsung","m":"Samsung Galaxy A70","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy M33","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A42 5G","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A23","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A13","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A12","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A04","k":"K21"},{"b":"Samsung","m":"Samsung Galaxy A03","k":"K21"},
  {"b":"Nokia","m":"Nokia G22","k":"K21"},{"b":"Nokia","m":"Nokia G21","k":"K21"},{"b":"Nokia","m":"Nokia G11","k":"K21"},
  {"b":"Honor","m":"Honor X8 5G","k":"K21"},{"b":"Honor","m":"Honor X6","k":"K21"},{"b":"Honor","m":"Honor X5","k":"K21"},
  {"b":"Xiaomi","m":"Xiaomi Poco M4 5G","k":"K21"},{"b":"Xiaomi","m":"Xiaomi Poco M5","k":"K21"},{"b":"Xiaomi","m":"Xiaomi Poco C51","k":"K21"},
  {"b":"OnePlus","m":"OnePlus Nord N300","k":"K21"},
  {"b":"Motorola","m":"Motorola Moto G20","k":"K21"},{"b":"Motorola","m":"Motorola Moto G50","k":"K21"},{"b":"Motorola","m":"Motorola Moto E13","k":"K21"},
  {"b":"Tecno","m":"Tecno Spark 10","k":"K21"},{"b":"Tecno","m":"Tecno Spark 8","k":"K21"},{"b":"Tecno","m":"Tecno Pop 7","k":"K21"},
  {"b":"Infinix","m":"Infinix Note 12","k":"K21"},{"b":"Infinix","m":"Infinix Hot 11","k":"K21"},{"b":"Huawei","m":"Huawei nova Y61","k":"K21"},
  {"b":"Vivo","m":"vivo Y100 4G","k":"K22"},{"b":"Vivo","m":"vivo T3","k":"K22"},{"b":"Vivo","m":"vivo iQOO Z9","k":"K22"},{"b":"Vivo","m":"vivo Y200e","k":"K22"},
  {"b":"Oppo","m":"Oppo A80","k":"K22"},{"b":"Oppo","m":"Oppo Reno12 F","k":"K22"},{"b":"Oppo","m":"Oppo A53","k":"K22"},
  {"b":"Redmi","m":"Redmi Note 12 Pro+","k":"K22"},{"b":"Redmi","m":"Redmi Note 11 Pro","k":"K22"},{"b":"Redmi","m":"Redmi Note 10 Pro","k":"K22"},{"b":"Redmi","m":"Redmi K60 Pro","k":"K22"},{"b":"Redmi","m":"Redmi Note 13 4G","k":"K22"},
  {"b":"Realme","m":"Realme GT3","k":"K22"},{"b":"Realme","m":"Realme GT2","k":"K22"},{"b":"Realme","m":"Realme Narzo 70","k":"K22"},
  {"b":"Samsung","m":"Samsung Galaxy Note20","k":"K22"},{"b":"Samsung","m":"Samsung Galaxy F52 5G","k":"K22"},
  {"b":"Xiaomi","m":"Xiaomi Poco X5 Pro","k":"K22"},{"b":"Xiaomi","m":"Xiaomi Poco F5","k":"K22"},{"b":"Xiaomi","m":"Xiaomi Poco F3","k":"K22"},{"b":"Xiaomi","m":"Xiaomi 13T Pro","k":"K22"},{"b":"Xiaomi","m":"Xiaomi Poco X6","k":"K22"},
  {"b":"Nothing Phone","m":"Nothing Phone (2)","k":"K22"},{"b":"OnePlus","m":"OnePlus 10T","k":"K22"},{"b":"Motorola","m":"Motorola Edge 20","k":"K22"},
  {"b":"Tecno","m":"Tecno Spark 20","k":"K22"},{"b":"Infinix","m":"Infinix GT 10 Pro","k":"K22"},{"b":"Honor","m":"Honor 90 Lite","k":"K22"},
  {"b":"Vivo","m":"vivo S19","k":"K23"},{"b":"Vivo","m":"vivo iQOO 12","k":"K23"},{"b":"Vivo","m":"vivo Y27","k":"K23"},
  {"b":"Oppo","m":"Oppo A96","k":"K23"},{"b":"Oppo","m":"Oppo K10","k":"K23"},
  {"b":"Redmi","m":"Redmi Note 12","k":"K23"},{"b":"Redmi","m":"Redmi Note 9 Pro","k":"K23"},{"b":"Redmi","m":"Redmi K60 Ultra","k":"K23"},
  {"b":"Realme","m":"Realme GT5","k":"K23"},{"b":"Realme","m":"Realme 12+","k":"K23"},{"b":"Realme","m":"Realme C65","k":"K23"},
  {"b":"Samsung","m":"Samsung Galaxy M55","k":"K23"},{"b":"Samsung","m":"Samsung Galaxy A71","k":"K23"},{"b":"Samsung","m":"Samsung Galaxy Note10 Lite","k":"K23"},
  {"b":"Xiaomi","m":"Xiaomi Poco X4 Pro 5G","k":"K23"},{"b":"Xiaomi","m":"Xiaomi 11T","k":"K23"},
  {"b":"OnePlus","m":"OnePlus Nord 4","k":"K23"},{"b":"Motorola","m":"Motorola Moto G35","k":"K23"},
  {"b":"Tecno","m":"Tecno Pova 6 Pro","k":"K23"},{"b":"Infinix","m":"Infinix Note 40","k":"K23"},{"b":"Asus","m":"Asus Zenfone 11 Ultra","k":"K23"},
  {"b":"Vivo","m":"vivo Y300i","k":"K24"},{"b":"Vivo","m":"vivo Y58","k":"K24"},{"b":"Vivo","m":"vivo iQOO 11","k":"K24"},
  {"b":"Oppo","m":"Oppo A3","k":"K24"},{"b":"Oppo","m":"Oppo A60","k":"K24"},{"b":"Oppo","m":"Oppo A79","k":"K24"},{"b":"Oppo","m":"Oppo F23","k":"K24"},
  {"b":"Redmi","m":"Redmi Note 12 4G","k":"K24"},
  {"b":"Realme","m":"Realme 13","k":"K24"},{"b":"Realme","m":"Realme 12","k":"K24"},{"b":"Realme","m":"Realme C55","k":"K24"},{"b":"Realme","m":"Realme 11","k":"K24"},
  {"b":"Samsung","m":"Samsung Galaxy A80","k":"K24"},{"b":"Samsung","m":"Samsung Galaxy A05s","k":"K24"},{"b":"Samsung","m":"Samsung Galaxy M54","k":"K24"},{"b":"Samsung","m":"Samsung Galaxy M51","k":"K24"},{"b":"Samsung","m":"Samsung Galaxy A72","k":"K24"},
  {"b":"Xiaomi","m":"Xiaomi Poco X5","k":"K24"},{"b":"Xiaomi","m":"Xiaomi Poco X3 Pro","k":"K24"},{"b":"Xiaomi","m":"Xiaomi Poco X3 NFC","k":"K24"},
  {"b":"Meizu","m":"Meizu 20 Pro","k":"K24"},{"b":"Tecno","m":"Tecno Camon 30","k":"K24"},{"b":"Tecno","m":"Tecno Pova 6","k":"K24"},{"b":"Honor","m":"Honor X9","k":"K24"},
  {"b":"Xiaomi","m":"Xiaomi 14 Civi","k":"K25"},{"b":"OnePlus","m":"OnePlus Nord 2T","k":"K25"},
  {"b":"Realme","m":"Realme 9 Pro+","k":"K25"},{"b":"Realme","m":"Realme 8 Pro","k":"K25"},{"b":"Realme","m":"Realme 8","k":"K25"},
  {"b":"Oppo","m":"Oppo Reno8","k":"K25"},{"b":"Oppo","m":"Oppo A95","k":"K25"},
  {"b":"OnePlus","m":"OnePlus Nord","k":"K25"},{"b":"Google","m":"Google Pixel 6","k":"K25"},
  {"b":"Redmi","m":"Redmi Note 10S","k":"K25"},{"b":"Redmi","m":"Redmi Note 10","k":"K25"},{"b":"Vivo","m":"vivo V20 Pro","k":"K25"},
  {"b":"Samsung","m":"Samsung Galaxy A14","k":"K26"},{"b":"Samsung","m":"Samsung Galaxy M14","k":"K26"},
  {"b":"Redmi","m":"Redmi A3","k":"K26"},{"b":"Redmi","m":"Redmi 12C","k":"K26"},{"b":"Xiaomi","m":"Xiaomi Poco C40","k":"K26"},
  {"b":"Samsung","m":"Samsung Galaxy A50s","k":"K27"},{"b":"Samsung","m":"Samsung Galaxy M31","k":"K27"},{"b":"Samsung","m":"Samsung Galaxy A32","k":"K27"},{"b":"Samsung","m":"Samsung Galaxy A22","k":"K27"},{"b":"Samsung","m":"Samsung Galaxy A20","k":"K27"},
  {"b":"Vivo","m":"vivo V21","k":"K27"},{"b":"Redmi","m":"Redmi Note 8 Pro","k":"K27"},{"b":"Redmi","m":"Redmi Note 7","k":"K27"},
  {"b":"Samsung","m":"Samsung Galaxy A34","k":"K28"},{"b":"Samsung","m":"Samsung Galaxy M34 5G","k":"K28"},
  {"b":"Redmi","m":"Redmi 13","k":"K29"},{"b":"Redmi","m":"Redmi 12","k":"K29"},{"b":"Redmi","m":"Redmi 13C","k":"K29"},
  {"b":"Realme","m":"Realme C53","k":"K29"},{"b":"Samsung","m":"Samsung Galaxy A05","k":"K29"},{"b":"Infinix","m":"Infinix Hot 40","k":"K29"},{"b":"Honor","m":"Honor X7","k":"K29"},
  {"b":"Motorola","m":"Motorola Moto G51 5G","k":"K29"},{"b":"Tecno","m":"Tecno Pova 7 5G","k":"K29"},
  {"b":"Samsung","m":"Samsung Galaxy S20 FE","k":"K30"},{"b":"Samsung","m":"Samsung Galaxy A53 5G","k":"K30"},{"b":"Samsung","m":"Samsung Galaxy A52","k":"K30"},{"b":"Samsung","m":"Samsung Galaxy A51","k":"K30"},
  {"b":"Redmi","m":"Redmi Note 11","k":"K30"},{"b":"Xiaomi","m":"Xiaomi Poco M4 Pro","k":"K30"},{"b":"Tecno","m":"Tecno Pova 3","k":"K31"},
  {"b":"Samsung","m":"Samsung Galaxy F41","k":"K32"},{"b":"OnePlus","m":"OnePlus 9","k":"K32"},{"b":"OnePlus","m":"OnePlus 8T","k":"K32"},
  {"b":"Motorola","m":"Motorola Moto G84","k":"K32"},{"b":"Motorola","m":"Motorola Moto G72","k":"K32"},{"b":"Motorola","m":"Motorola Moto G55","k":"K32"},
  {"b":"Samsung","m":"Samsung Galaxy A55","k":"K33"},{"b":"Samsung","m":"Samsung Galaxy A35","k":"K33"},{"b":"Samsung","m":"Samsung Galaxy M35","k":"K33"},
  {"b":"Google","m":"Google Pixel 8 Pro","k":"K33"},{"b":"Xiaomi","m":"Xiaomi 12T Pro","k":"K33"},
  {"b":"Vivo","m":"vivo V20","k":"K34"},{"b":"OnePlus","m":"OnePlus 7T","k":"K34"},{"b":"HMD","m":"HMD Skyline","k":"K34"},
  {"b":"Samsung","m":"Samsung Galaxy S21 FE 5G","k":"K35"},{"b":"Google","m":"Google Pixel 7","k":"K35"},
  {"b":"Realme","m":"Realme Narzo 50","k":"K36"},{"b":"Motorola","m":"Motorola Moto G04","k":"K36"},{"b":"Motorola","m":"Motorola Moto G34","k":"K36"},{"b":"Motorola","m":"Motorola Moto G53","k":"K36"},{"b":"Infinix","m":"Infinix Smart 8","k":"K36"},
  {"b":"Xiaomi","m":"Xiaomi Mi 11 Lite 5G","k":"K37"},{"b":"Vivo","m":"vivo X60","k":"K37"},
  {"b":"Xiaomi","m":"Xiaomi Poco M3 Pro","k":"K38"},{"b":"Realme","m":"Realme 6","k":"K38"},{"b":"Motorola","m":"Motorola Moto G64","k":"K38"},
  {"b":"Samsung","m":"Samsung Galaxy A56","k":"K43"},{"b":"Samsung","m":"Samsung Galaxy A36","k":"K43"},{"b":"Samsung","m":"Samsung Galaxy A26","k":"K43"},
  {"b":"Nothing Phone","m":"Nothing Phone (3a)","k":"K43"},{"b":"Nothing Phone","m":"Nothing Phone (3a)Pro","k":"K43"},
  {"b":"Huawei","m":"Huawei Mate 60","k":"K43"},{"b":"Tecno","m":"Tecno Spark 40","k":"K43"},
  {"b":"Xiaomi","m":"Xiaomi 14","k":"K44"},{"b":"Google","m":"Google Pixel 4a 5G","k":"K44"},{"b":"Motorola","m":"Motorola Edge 50 Neo","k":"K44"},
  {"b":"Google","m":"Google Pixel 9 Pro XL","k":"K45"},{"b":"Nothing Phone","m":"Nothing Phone (2a)","k":"K45"},{"b":"Huawei","m":"Huawei nova 12","k":"K45"},
  {"b":"Redmi","m":"Redmi Note 13 Pro","k":"K46"},{"b":"Redmi","m":"Redmi K70 Ultra","k":"K46"},{"b":"Redmi","m":"Redmi K70 Pro","k":"K46"},
  {"b":"Xiaomi","m":"Xiaomi Poco X6 Pro","k":"K46"},{"b":"Xiaomi","m":"Xiaomi Poco F6","k":"K46"},{"b":"Xiaomi","m":"Xiaomi 13T","k":"K46"},{"b":"Realme","m":"Realme 13+","k":"K46"},
  {"b":"Motorola","m":"Motorola Moto G54","k":"K51"},{"b":"Motorola","m":"Motorola Moto G73","k":"K51"},
  {"b":"Asus","m":"Asus ROG Phone 7","k":"K54"},{"b":"Asus","m":"Asus ROG Phone 6","k":"K54"},
  {"b":"Samsung","m":"Samsung Galaxy S25 Ultra","k":"K55+"},{"b":"Samsung","m":"Samsung S25 EDGE","k":"K56+"},{"b":"Redmi","m":"Redmi 15 5G","k":"K57"},
  {"b":"Samsung","m":"S26","k":"K59+"},{"b":"Samsung","m":"S26 ULTRA","k":"K60+"},
  {"b":"Huawei","m":"Huawei Nova 14 5G","k":"K61"},{"b":"Oppo","m":"Oppo Reno 14F","k":"K62+"},
  {"b":"Vivo","m":"Vivo X300 Pro","k":"K63+"},{"b":"Vivo","m":"Vivo iqoo 15","k":"K64+"},{"b":"Honor","m":"Honor X6C","k":"K64+"},{"b":"Motorola","m":"Motorola Moto G67 Power","k":"K64+"},
  {"b":"Redmi","m":"Redmi K80 Ultra","k":"K65+"},{"b":"Xiaomi","m":"Xiaomi Poco F7","k":"K65+"},{"b":"Xiaomi","m":"Xiaomi 15T Pro","k":"K65+"},{"b":"Xiaomi","m":"Xiaomi 15T","k":"K65+"},
];

type Model = { b: string; m: string; k: string };

const BRANDS = [
  "Apple","Samsung","Xiaomi","Redmi","Realme","Oppo","Vivo",
  "OnePlus","Motorola","Huawei","Honor","Google","Nokia","Nothing Phone","Infinix","Tecno",
];

function hl(text: string, q: string) {
  if (!q.trim()) return <>{text}</>;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        re.test(part)
          ? <mark key={i} className="bg-primary/15 text-primary rounded-sm px-0.5 not-italic">{part}</mark>
          : part
      )}
    </>
  );
}

const QRWorkflow = () => {
  const { t } = useI18n();

  const STEPS = [
    { n: "01", label: t("qr_s1_label"), heading: t("qr_s1_h"), desc: t("qr_s1_d") },
    { n: "02", label: t("qr_s2_label"), heading: t("qr_s2_h"), desc: t("qr_s2_d") },
    { n: "03", label: t("qr_s3_label"), heading: t("qr_s3_h"), desc: t("qr_s3_d") },
    { n: "04", label: t("qr_s4_label"), heading: t("qr_s4_h"), desc: t("qr_s4_d") },
  ];

  const [tab, setTab]               = useState<"how" | "find">("how");
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused]         = useState(false);
  const [query, setQuery]           = useState("");
  const [brand, setBrand]           = useState("");
  const [selected, setSelected]     = useState<Model | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused]);

  const goStep = (n: number) => {
    setPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveStep(n);
  };

  const results = DB.filter((d) =>
    (!brand || d.b === brand) &&
    (!query.trim() || d.m.toLowerCase().includes(query.toLowerCase()) || d.k.toLowerCase().includes(query.toLowerCase()))
  );
  const showResults = !!(query.trim() || brand);

  return (
    <section id="how" className="relative py-28 sm:py-36 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6">
            <span className="block w-8 h-px bg-primary/60" />
            {t("qr_new_eyebrow")}
            <span className="block w-8 h-px bg-primary/60" />
          </p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight">
            {t("qr_new_title")}{" "}
            <span className="text-gradient">{t("qr_new_title2")}</span>
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("qr_new_sub")}
          </p>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex gap-1.5 bg-secondary/60 backdrop-blur-sm border border-border/50 rounded-2xl p-1.5">
            {(["how", "find"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tab === key ? "bg-background text-primary shadow-sm border border-border/60" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {key === "how" ? t("qr_tab_how") : t("qr_tab_find")}
              </button>
            ))}
          </div>
        </div>

        {/* TAB: HOW IT WORKS */}
        {tab === "how" && (
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">

            {/* LEFT: PHOTO */}
            <div className="relative">
              <div className="absolute -top-5 -right-4 z-20 hidden sm:flex items-center gap-4 bg-background/95 backdrop-blur-sm border border-border rounded-2xl px-5 py-3.5 shadow-xl">
                <div className="text-center"><p className="text-2xl font-bold text-primary leading-none">2086</p><p className="text-xs text-muted-foreground mt-0.5">{t("qr_stat_models")}</p></div>
                <div className="w-px h-9 bg-border" />
                <div className="text-center"><p className="text-2xl font-bold text-primary leading-none">48+</p><p className="text-xs text-muted-foreground mt-0.5">{t("qr_stat_brands")}</p></div>
                <div className="w-px h-9 bg-border" />
                <div className="text-center"><p className="text-2xl font-bold text-primary leading-none">K65+</p><p className="text-xs text-muted-foreground mt-0.5">{t("qr_stat_series")}</p></div>
              </div>

              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl ring-1 ring-border/20">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&auto=format&fit=crop&q=85"
                  alt={t("qr_img_alt")}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />
                <div className="absolute inset-0 bg-primary/[0.08]" />
                <div className="absolute left-8 right-8 top-[12%] bottom-[38%] rounded-2xl border border-primary/40 overflow-hidden">
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: "qrScan 2.2s ease-in-out infinite" }} />
                  <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/70 rounded-tl-lg" />
                  <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/70 rounded-tr-lg" />
                  <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/70 rounded-bl-lg" />
                  <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/70 rounded-br-lg" />
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-background/85 backdrop-blur-md border border-border/60 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex-shrink-0 flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-bold">{STEPS[activeStep].n}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary mb-0.5">{STEPS[activeStep].label}</p>
                        <p className="text-sm font-bold text-foreground truncate">{STEPS[activeStep].heading}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {STEPS.map((_, i) => (
                          <button key={i} onClick={() => goStep(i)} aria-label={`${t("qr_step_label")} ${i + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: STEPS */}
            <div className="flex flex-col gap-3 lg:pt-8">
              {STEPS.map((step, i) => (
                <div key={i} role="button" tabIndex={0} onClick={() => goStep(i)} onKeyDown={e => e.key === "Enter" && goStep(i)}
                  className={`flex gap-5 rounded-2xl border cursor-pointer transition-all duration-300 p-5 select-none ${
                    activeStep === i ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border/60 bg-background/60 hover:border-border hover:bg-secondary/30"
                  }`}
                >
                  <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    activeStep === i ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-secondary text-muted-foreground"
                  }`}>
                    {step.n}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-xs font-bold uppercase tracking-[0.12em] mb-1 transition-colors ${activeStep === i ? "text-primary" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <h3 className="text-lg font-bold text-foreground leading-snug">{step.heading}</h3>
                    <div className={`overflow-hidden transition-all duration-300 ${activeStep === i ? "max-h-28 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  {activeStep === i && <div className="flex-shrink-0 w-1 self-stretch rounded-full bg-primary/50" />}
                </div>
              ))}

              <button onClick={() => setTab("find")}
                className="mt-3 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                {t("qr_find_cta")}
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* TAB: FINDER */}
        {tab === "find" && (
          <div className="max-w-3xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input autoFocus value={query} onChange={e => { setQuery(e.target.value); setSelected(null); }}
                placeholder={t("qr_search_ph")}
                className="w-full py-4 rounded-2xl border border-border bg-background text-base focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                style={{ paddingLeft: "3.25rem", paddingRight: query ? "3rem" : "1.25rem" }} />
              {query && (
                <button onClick={() => { setQuery(""); setSelected(null); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => { setBrand(""); setSelected(null); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!brand ? "bg-primary text-primary-foreground border-primary shadow-sm" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}>
                {t("qr_all")}
              </button>
              {BRANDS.map(b => (
                <button key={b} onClick={() => { setBrand(brand === b ? "" : b); setSelected(null); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${brand === b ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}>
                  {b}
                </button>
              ))}
            </div>

            {selected && (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-6 animate-fade-up">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-1">{selected.b}</p>
                    <h3 className="text-2xl font-bold text-foreground">{selected.m}</h3>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-4xl font-bold text-primary leading-none">{selected.k}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">K-{t("qr_series")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  {[
                    ["📱", t("qr_detail_scan"), t("qr_detail_box")],
                    ["📦", t("qr_detail_drawer"), selected.k],
                    ["✅", t("qr_detail_install"), t("qr_detail_fit")],
                  ].map(([icon, label, val], i) => (
                    <div key={i} className="bg-background border border-border rounded-2xl p-4 text-center">
                      <p className="text-2xl mb-2">{icon}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-bold text-foreground mt-1">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showResults ? (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-bold text-primary">{results.length}</span>{" "}
                  {results.length === 1 ? t("qr_found_s") : t("qr_found_p")}
                </p>
                {results.length === 0 ? (
                  <div className="text-center py-14 text-muted-foreground text-base">{t("qr_no_result")}</div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[440px] overflow-y-auto">
                    {results.slice(0, 60).map((d, i) => (
                      <button key={i} onClick={() => setSelected(d)}
                        className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl border w-full text-left transition-all ${
                          selected?.m === d.m ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-background hover:border-primary/30 hover:bg-secondary/20"
                        }`}>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{d.b}</p>
                          <p className="text-sm font-semibold text-foreground truncate">{hl(d.m, query)}</p>
                        </div>
                        <div className="flex-shrink-0 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 text-center min-w-[62px]">
                          <p className="text-sm font-bold text-primary leading-none">{d.k}</p>
                          <p className="text-xs text-primary/60 mt-0.5">K-{t("qr_series")}</p>
                        </div>
                      </button>
                    ))}
                    {results.length > 60 && (
                      <p className="text-center text-sm text-muted-foreground py-3 border-t border-border">
                        + {results.length - 60} {t("qr_more")}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4">
                <Search className="w-12 h-12 opacity-20" />
                <p className="text-base">{t("qr_empty")}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes qrScan {
          0%   { top: 2%;  opacity: 1; }
          45%  { top: 90%; opacity: 1; }
          50%  { top: 90%; opacity: 0; }
          52%  { top: 2%;  opacity: 0; }
          55%  { top: 2%;  opacity: 1; }
          100% { top: 2%;  opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default QRWorkflow;
