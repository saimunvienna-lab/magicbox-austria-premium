import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52V6.73a4.85 4.85 0 0 1-1.84-.04Z" />
  </svg>
);

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-display font-bold">S</div>
              <span className="font-display font-semibold">SAIDA <span className="text-gradient">MagicBox</span></span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">{t("footer_tag")}</p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: TikTokIcon, href: "https://tiktok.com", label: "TikTok" },
                { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="size-9 rounded-full border bg-card grid place-items-center hover:bg-foreground hover:text-background transition-colors">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <div className="font-semibold mb-3">{t("footer_product")}</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#solution" className="hover:text-foreground">{t("nav_solution")}</a></li>
              <li><a href="/#technology" className="hover:text-foreground">{t("nav_technology")}</a></li>
              <li><a href="/#gallery" className="hover:text-foreground">{t("nav_gallery")}</a></li>
            </ul>
          </div>

          <div className="text-sm">
            <div className="font-semibold mb-3">{t("footer_company")}</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/#contact" className="hover:text-foreground">{t("nav_contact")}</a></li>
              <li><a href="/#dealer" className="hover:text-foreground">{t("nav_dealer")}</a></li>
              <li><a href="/#blog" className="hover:text-foreground">{t("nav_blog")}</a></li>
              <li>Innsbruck, Austria 🇦🇹</li>
            </ul>
          </div>

          <div className="text-sm">
            <div className="font-semibold mb-3">{t("footer_legal")}</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/impressum" className="hover:text-foreground">{t("legal_impressum")}</Link></li>
              <li><Link to="/datenschutz" className="hover:text-foreground">{t("legal_privacy")}</Link></li>
              <li><Link to="/agb" className="hover:text-foreground">{t("legal_agb")}</Link></li>
              <li><Link to="/widerruf" className="hover:text-foreground">{t("legal_widerruf")}</Link></li>
              <li><Link to="/cookies" className="hover:text-foreground">{t("legal_cookies")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} SAIDA MagicBox. {t("footer_rights")}</div>
          <div>Designed & engineered in Austria.</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
