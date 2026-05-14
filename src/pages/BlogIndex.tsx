import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";

type Post = {
  slug: string;
  title: string;
  title_en: string;
  excerpt: string;
  excerpt_en: string;
  category: string;
  category_en: string;
  image: string;
  read_time: string;
  created_at: string;
};

const formatDate = (d: string, locale: string) =>
  new Date(d).toLocaleDateString(locale === "de" ? "de-AT" : "en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

const Inner = () => {
  const { lang } = useI18n();
  const de = lang === "de";
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const title    = (p: Post) => de ? p.title    : p.title_en;
  const excerpt  = (p: Post) => de ? p.excerpt  : p.excerpt_en;
  const category = (p: Post) => de ? p.category : p.category_en;
  const readMore = de ? "Artikel lesen" : "Read article";
  const more     = de ? "Mehr lesen"    : "Read more";

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <main className="bg-background min-h-screen">
        <SEO
          title="Blog | SAIDA MagicBox"
          description="B2B insights for mobile retailers"
          canonical="https://saidamagicbox.com/blog"
        />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">No posts yet</h1>
          <p className="text-muted-foreground">Check back soon for updates!</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <SEO
        title="Panzerglas & Handy-Shop Blog — Tipps für Mobilfunkhändler | SAIDA MagicBox"
        description="Aktuelle Insights für Handyshops in Österreich: Schutzfolien-Trends, Inventar-Management, Branchen-News und Praxistipps aus 14 Jahren Mobilfunk-Handel."
        canonical="https://saidamagicbox.com/blog"
      />
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
            <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-5">
              SAIDA Insights
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              {de ? (
                <>Smarter <span className="text-gradient">Mobilfunk-Handel</span> beginnt hier.</>
              ) : (
                <>Smarter <span className="text-gradient">mobile retail</span> starts here.</>
              )}
            </h1>
            <p className="mt-7 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {de
                ? "B2B-Insights zu Lager, Schutzglas-Technologie und europäischem Mobilfunk-Handel — geschrieben für Shop-Betreiber, Distributoren und Entscheider."
                : "B2B insights on inventory, screen protector technology and European mobile retail — written for shop owners, distributors and decision-makers."}
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
              <img
                src={featured.image}
                alt={title(featured)}
                className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-1000"
                loading="eager"
              />
              <div className="absolute top-5 left-5 glass rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
                Featured
              </div>
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-5 flex-wrap">
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold uppercase tracking-wider">
                  {category(featured)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> {formatDate(featured.created_at, lang)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {featured.read_time}
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">
                {title(featured)}
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                {excerpt(featured)}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {readMore} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Grid */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group rounded-3xl border bg-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-500"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={title(p)}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
                    <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold uppercase tracking-wider">
                      {category(p)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5" /> {formatDate(p.created_at, lang)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" /> {p.read_time}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold leading-snug group-hover:text-primary transition-colors">
                    {title(p)}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {excerpt(p)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {more} <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
