import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n, LANGS, Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const prefix = onHome ? "" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `${prefix}#solution`, label: t("nav_solution") },
    { href: `${prefix}#technology`, label: t("nav_technology") },
    { href: `${prefix}#how`, label: t("nav_how") },
    { href: `${prefix}#gallery`, label: t("nav_gallery") },
    { href: `${prefix}#blog`, label: t("nav_blog") },
    { href: `${prefix}#contact`, label: t("nav_contact") },
  ];

  return (
    <header className={cn("fixed top-0 inset-x-0 z-50 transition-all duration-500", scrolled ? "py-2" : "py-4")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className={cn("flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500",
          scrolled ? "glass shadow-soft" : "bg-transparent")}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center text-primary-foreground font-display font-bold">S</div>
            <span className="font-display font-semibold tracking-tight text-foreground">
              SAIDA <span className="text-gradient">MagicBox</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
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
              <a href={`${prefix}#dealer`}>{t("nav_dealer")}</a>
            </Button>
            <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-4 animate-fade-up">
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm py-2">{l.label}</a>
              ))}
              <div className="flex items-center gap-1 rounded-full bg-muted/60 p-1 self-start mt-2">
                {LANGS.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code as Lang)}
                    className={cn("text-xs font-medium px-2.5 py-1 rounded-full",
                      lang === l.code ? "bg-foreground text-background" : "text-muted-foreground")}>
                    {l.label}
                  </button>
                ))}
              </div>
              <Button asChild size="sm" className="rounded-full bg-foreground text-background mt-2">
                <a href={`${prefix}#dealer`} onClick={() => setOpen(false)}>{t("nav_dealer")}</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
