import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Clock, Linkedin, Twitter, Facebook, Link2 } from "lucide-react";
import { I18nProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { getPost, getRelated } from "@/lib/blog-data";
import { toast } from "@/hooks/use-toast";

const formatDate = (d: string) => new Date(d).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" });

const Progress = () => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setW(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-1 bg-transparent">
      <div className="h-full bg-gradient-to-r from-primary to-primary-glow transition-[width] duration-150" style={{ width: `${w}%` }} />
    </div>
  );
};

const Share = ({ title }: { title: string }) => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent;
  const links = [
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "Twitter", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); toast({ title: "Link kopiert" }); } catch { /* ignore */ }
  };
  return (
    <div className="flex items-center gap-2">
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Auf ${l.label} teilen`}
          className="size-10 rounded-full border bg-card grid place-items-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
          <l.icon className="size-4" />
        </a>
      ))}
      <button onClick={copy} aria-label="Link kopieren"
        className="size-10 rounded-full border bg-card grid place-items-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
        <Link2 className="size-4" />
      </button>
    </div>
  );
};

const Inner = () => {
  const { slug = "" } = useParams();
  const post = getPost(slug);
  if (!post) return <Navigate to="/blog" replace />;
  const related = getRelated(post.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    inLanguage: "de-AT",
    author: { "@type": "Organization", name: "SAIDA MagicBox" },
    publisher: { "@type": "Organization", name: "SAIDA MagicBox" },
    keywords: post.keywords.join(", "),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  useEffect(() => {
    document.title = `${post.title} — SAIDA MagicBox`;
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", post.excerpt);
  }, [post]);

  return (
    <main className="bg-background min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Progress />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-12">
        <div className="absolute inset-0 bg-mesh opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground line-clamp-1 inline-block max-w-[60%] align-bottom">{post.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6">
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold uppercase tracking-wider">{post.category}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="size-3.5" /> {formatDate(post.date)}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {post.readTime} Lesezeit</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">{post.title}</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-3xl">{post.excerpt}</p>
        </div>
      </section>

      {/* Cover */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-3xl overflow-hidden border shadow-elevated aspect-[16/9]">
          <img src={post.image} alt={post.title} className="size-full object-cover" />
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-[1fr_280px] gap-12">
        <article className="max-w-2xl mx-auto lg:mx-0 prose-lg">
          {/* Share top */}
          <div className="flex items-center justify-between mb-10 pb-8 border-b">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Teilen</span>
            <Share title={post.title} />
          </div>

          {post.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i} id={b.id} className="scroll-mt-28 font-display text-3xl sm:text-4xl font-bold tracking-tight mt-14 mb-5">{b.text}</h2>;
            if (b.type === "h3") return <h3 key={i} className="font-display text-2xl font-semibold mt-10 mb-4">{b.text}</h3>;
            if (b.type === "p") return <p key={i} className="text-[17px] leading-[1.8] text-foreground/85 mb-6">{b.text}</p>;
            if (b.type === "quote") return (
              <blockquote key={i} className="my-10 rounded-2xl border-l-4 border-primary bg-gradient-to-br from-primary/5 to-transparent p-7">
                <p className="font-display text-xl sm:text-2xl leading-snug text-foreground italic">"{b.text}"</p>
              </blockquote>
            );
            if (b.type === "list") return (
              <ul key={i} className="my-6 space-y-3">
                {b.items?.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[17px] leading-[1.7] text-foreground/85">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
            return null;
          })}

          {/* FAQ */}
          <div className="mt-20 pt-12 border-t">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-8">Häufige Fragen</h2>
            <div className="space-y-4">
              {post.faq.map((f, i) => (
                <details key={i} className="group rounded-2xl border bg-card p-6 open:shadow-soft transition-shadow">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                    <span className="font-display text-lg font-semibold">{f.q}</span>
                    <span className="size-7 rounded-full border grid place-items-center text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Share bottom */}
          <div className="mt-14 flex items-center justify-between pt-8 border-t">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Alle Artikel
            </Link>
            <Share title={post.title} />
          </div>
        </article>

        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4">Inhalt</div>
            <ul className="space-y-2.5 border-l">
              {post.toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="block pl-4 -ml-px border-l border-transparent hover:border-primary text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-deep p-10 sm:p-16 text-center">
          <div className="absolute inset-0 bg-mesh opacity-40" aria-hidden />
          <div className="relative max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.25em] text-primary-glow font-semibold mb-4">Partnerschaft</div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">Jetzt SAIDA MagicBox Partner werden</h2>
            <p className="mt-5 text-white/70 text-lg leading-relaxed">
              Großhandelspreise, Marketing-Support und exklusive Gebiete für ambitionierte Handyshops in Europa.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90">
                <Link to="/#dealer">Händler werden <ArrowRight className="ml-1.5 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link to="/#contact">Sample Box anfragen</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Weiterlesen</h2>
            <Link to="/blog" className="text-sm text-primary inline-flex items-center gap-1.5 font-semibold">Alle Artikel <ArrowUpRight className="size-3.5" /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`}
                className="group rounded-3xl border bg-card overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-500">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold uppercase tracking-wider">{p.category}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {p.readTime}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
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

const BlogPost = () => (
  <I18nProvider>
    <Inner />
  </I18nProvider>
);
export default BlogPost;