import { QrCode, Search, PackageOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import qrImg from "@/assets/qr-scan.jpg";

const QRWorkflow = () => {
  const { t } = useI18n();
  const steps = [
    { n: "01", icon: QrCode, t: t("qr_step_1_t"), d: t("qr_step_1_d") },
    { n: "02", icon: Search, t: t("qr_step_2_t"), d: t("qr_step_2_d") },
    { n: "03", icon: PackageOpen, t: t("qr_step_3_t"), d: t("qr_step_3_d") },
  ];
  return (
    <section id="how" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("qr_eyebrow")}</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("qr_title")}</h2>
        </div>

        <div className="mt-20 grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 to-primary-glow/30 rounded-full blur-3xl" />
            <img src={qrImg} alt="Phone scanning the MagicBox QR code" width={1280} height={1024} loading="lazy"
              className="relative rounded-3xl shadow-elevated w-full" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="group relative rounded-3xl border bg-card p-6 sm:p-8 flex gap-6 hover:shadow-elevated hover:-translate-y-0.5 transition-all">
                <div className="font-display text-5xl font-bold text-gradient-silver shrink-0">{s.n}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-glow">
                      <s.icon className="size-4 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{s.t}</h3>
                  </div>
                  <p className="text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default QRWorkflow;
