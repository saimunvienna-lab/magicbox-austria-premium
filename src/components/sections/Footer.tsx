import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-display font-bold">S</div>
              <span className="font-display font-semibold">SAIDA <span className="text-gradient">MagicBox</span></span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">{t("footer_tag")}</p>
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-3">Product</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#solution" className="hover:text-foreground">{t("nav_solution")}</a></li>
              <li><a href="#technology" className="hover:text-foreground">{t("nav_technology")}</a></li>
              <li><a href="#gallery" className="hover:text-foreground">{t("nav_gallery")}</a></li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#contact" className="hover:text-foreground">{t("nav_contact")}</a></li>
              <li><a href="#dealer" className="hover:text-foreground">{t("nav_dealer")}</a></li>
              <li>Innsbruck, Austria 🇦🇹</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} SAIDA MagicBox. {t("footer_rights")}</div>
          <div>Designed & engineered in Austria.</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
