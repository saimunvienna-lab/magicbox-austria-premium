import { useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const AnnouncementBar = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative z-[60] bg-gradient-to-r from-primary via-primary to-primary-glow text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-center">
        <span aria-hidden>🇦🇹</span>
        <span>{t("hero_announce")}</span>
        <button
          onClick={() => setOpen(false)}
          aria-label="Dismiss announcement"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;