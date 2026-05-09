import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { I18nProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { posts } from "@/lib/blog-data";

const formatDate = (d: string) => new Date(d).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" });

const Inner = () => {
  const [featured, ...rest] = posts;
  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-60" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Blog</span>
          </nav>
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-5">SAIDA Insights</div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Smarter <span className="text-gradient">Mobilfunk-Handel</span> beginnt hier.
            </h1>
            <p className="mt-7 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              B2B-Insights zu Lager, Schutzglas-Technologie und europäischem Mobilfunk-Handel — geschrieben für Shop-Betreiber, Distributoren und Entscheider.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <Link
          to={`/blog/${featured.slug}`}
          className="group block rounded-3xl overflow-hidden border bg-card hover:shadow-elevated transition-all duration-700"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[16/11] lg:aspect-auto overflow-hidden">
              <img src={featured.image} alt={featured.title} className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-1000" loading="eager" />
              <div className="absolute top-5 left-5 glass rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">Featured</div>
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-5">
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold uppercase tracking-wider">{featured.category}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="size-3.5" /> {formatDate(featured.date)}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {featured.readTime}</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Artikel lesen <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group rounded-3xl border bg-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={p.image} alt={p.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold uppercase tracking-wider">{p.category}</span>
                  <span className="inline-flex items-center gap-1.5"><Calendar className="size-3.5" /> {formatDate(p.date)}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {p.readTime}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{p.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Mehr lesen <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

const BlogIndex = () => (
  <I18nProvider>
    <Inner />
  </I18nProvider>
);
export default BlogIndex;