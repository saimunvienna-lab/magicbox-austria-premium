import { ArrowUpRight, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Blog = () => {
  const { t } = useI18n();
  const posts = [
    { tag: t("blog_1_tag"), title: t("blog_1_t"), desc: t("blog_1_d"), read: "6 min" },
    { tag: t("blog_2_tag"), title: t("blog_2_t"), desc: t("blog_2_d"), read: "4 min" },
    { tag: t("blog_3_tag"), title: t("blog_3_t"), desc: t("blog_3_d"), read: "8 min" },
  ];
  return (
    <section id="blog" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("blog_eyebrow")}</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("blog_title")}</h2>
            <p className="mt-6 text-lg text-muted-foreground">{t("blog_sub")}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article key={i} className="group relative rounded-3xl border bg-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-500">
              <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary-glow/10 to-transparent">
                <div className="absolute inset-0 bg-mesh opacity-70" />
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider">{p.tag}</div>
                <div className="absolute bottom-4 right-4 glass rounded-full px-3 py-1 text-[11px] font-medium flex items-center gap-1.5">
                  <Clock className="size-3" /> {p.read}
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="font-display text-6xl font-bold text-foreground/10 select-none">0{i + 1}</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  {t("blog_soon")} <ArrowUpRight className="size-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Blog;
