import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const KEY = "saida_cookie_consent";

const CookieBanner = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const [showPrefs, setShowPrefs] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  const save = (data: { analytics: boolean; marketing: boolean }) => {
    localStorage.setItem(KEY, JSON.stringify({ ...data, ts: Date.now() }));
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-5 sm:bottom-24 sm:max-w-md z-[60] glass rounded-3xl p-5 sm:p-6 shadow-elevated animate-fade-up border-white/40">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-xl bg-primary/10 grid place-items-center shrink-0">
          <Cookie className="size-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="font-display font-semibold text-base">{t("cookie_title")}</div>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t("cookie_text")}</p>
          {showPrefs && (
            <div className="mt-4 space-y-2 text-sm">
              <label className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <span>{t("cookie_essential")}</span>
                <input type="checkbox" checked disabled className="accent-primary" />
              </label>
              <label className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 cursor-pointer">
                <span>{t("cookie_analytics")}</span>
                <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })} className="accent-primary" />
              </label>
              <label className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 cursor-pointer">
                <span>{t("cookie_marketing")}</span>
                <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })} className="accent-primary" />
              </label>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => save({ analytics: true, marketing: true })}>{t("cookie_accept")}</Button>
            <Button size="sm" variant="outline" className="rounded-full"
              onClick={() => save({ analytics: false, marketing: false })}>{t("cookie_reject")}</Button>
            {!showPrefs ? (
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setShowPrefs(true)}>{t("cookie_prefs")}</Button>
            ) : (
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => save(prefs)}>{t("cookie_save")}</Button>
            )}
          </div>
        </div>
        <button aria-label="Close" className="text-muted-foreground hover:text-foreground" onClick={() => save({ analytics: false, marketing: false })}>
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};
export default CookieBanner;
