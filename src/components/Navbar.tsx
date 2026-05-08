import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n, LANGS, Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#solution", label: t("nav_solution") },
    { href: "#technology", label: t("nav_technology") },
    { href: "#gallery", label: t("nav_gallery") },
    { href: "#contact", label: t("nav_contact") },
  ];

  return (
    <header className={cn("fixed top-0 inset-x-0 z-50 transition-all duration-500",
      scrolled ? "py-3" : "py-5")}>
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-500",
        scrolled ? "" : "")}>
        <nav className={cn("flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500",
          scrolled ? "glass shadow-soft" : "bg-transparent")}>
          <a href="#" className="flex items-center gap-2 group">
            <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center text-primary-foreground font-display font-bold">
              S
            </div>
            <span className="font-display font-semibold tracking-tight text-foreground">
              SAIDA <span className="text-gradient">MagicBox</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-muted/60 backdrop-blur p-1">
              {LANGS.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code as Lang)}
                  className={cn("text-xs font-medium px-2.5 py-1 rounded-full transition-all",
                    lang === l.code ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
                  {l.label}
                </button>
              ))}
            </div>
            <Button asChild size="sm" className="hidden sm:inline-flex rounded-full bg-foreground text-background hover:bg-foreground/90">
              <a href="#dealer">{t("nav_dealer")}</a>
            </Button>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 animate-fade-up">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm py-2">{l.label}</a>
              ))}
              <div className="flex items-center gap-1 rounded-full bg-muted/60 p-1 self-start">
                {LANGS.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code as Lang)}
                    className={cn("text-xs font-medium px-2.5 py-1 rounded-full",
                      lang === l.code ? "bg-foreground text-background" : "text-muted-foreground")}>
                    {l.label}
                  </button>
                ))}
              </div>
              <Button asChild size="sm" className="rounded-full bg-foreground text-background">
                <a href="#dealer" onClick={() => setOpen(false)}>{t("nav_dealer")}</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
