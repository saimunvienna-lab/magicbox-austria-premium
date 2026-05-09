import { ArrowUpRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { posts } from "@/lib/blog-data";

const Blog = () => {
  const { t } = useI18n();
  const items = posts.map((p) => ({ slug: p.slug, tag: p.category, title: p.title, desc: p.excerpt, read: p.readTime, image: p.image }));
  return (
    <section id="blog" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">{t("blog_eyebrow")}</div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{t("blog_title")}</h2>
            <p className="mt-6 text-lg text-muted-foreground">{t("blog_sub")}</p>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            {t("blog_read")} <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group relative rounded-3xl border bg-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-500">
              <div className="aspect-[16/10] relative overflow-hidden">
                <img src={p.image} alt={p.title} className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider">{p.tag}</div>
                <div className="absolute bottom-4 right-4 glass rounded-full px-3 py-1 text-[11px] font-medium flex items-center gap-1.5">
                  <Clock className="size-3" /> {p.read}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {t("blog_read")} <ArrowUpRight className="size-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Blog;
