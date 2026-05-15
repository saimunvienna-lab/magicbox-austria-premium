import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, FileText, ShoppingCart, LogOut, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/SEO";

const Admin = () => {
  const [contactCount, setContactCount] = useState(0);
  const [todayContacts, setTodayContacts] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    (async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);

      const { data: msgs } = await supabase.from("contact_messages").select("id, status, created_at");
      if (msgs) {
        setContactCount(msgs.filter((m: any) => !m.status || m.status === "new").length);
        setTodayContacts(msgs.filter((m: any) => new Date(m.created_at) >= today).length);
      }

      const { count: pCount } = await supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true);
      if (pCount != null) setPostCount(pCount);

      const { data: orders } = await supabase.from("orders").select("id, status");
      if (orders) {
        setOrderCount(orders.length);
        setPendingOrders(orders.filter((o: any) => o.status === "pending" || o.status === "new").length);
      }
    })();
  }, []);

  const cards = [
    { icon: Mail, title: "Kontaktanfragen", count: contactCount, label: "neue Anfragen", href: "/admin/contacts", color: "from-blue-500 to-blue-700" },
    { icon: FileText, title: "Blog Beiträge", count: postCount, label: "veröffentlicht", href: "/admin/blog", color: "from-purple-500 to-purple-700" },
    { icon: ShoppingCart, title: "Bestellungen", count: orderCount, label: "gesamt", href: "/admin/orders", color: "from-emerald-500 to-emerald-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <SEO title="Admin Dashboard | SAIDA MagicBox" noIndex />
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 grid place-items-center font-bold">S</div>
            <span className="font-bold tracking-tight">SAIDA Admin</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-blue-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
            <LogOut className="w-4 h-4" /> Logout
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-blue-200">Willkommen im Verwaltungsbereich</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cards.map((c) => (
            <Link key={c.title} to={c.href}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-white/30 transition-all hover:-translate-y-1">
              <div className={`absolute -top-6 -right-6 size-32 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl`} />
              <div className={`size-12 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center mb-4`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-1">{c.title}</h3>
              <p className="text-4xl font-bold mb-1">{c.count}</p>
              <p className="text-sm text-blue-200 mb-4">{c.label}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all">
                Verwalten <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-blue-200 mb-2">Heute neue Kontakte</p>
            <p className="text-3xl font-bold">{todayContacts}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-blue-200 mb-2">Veröffentlichte Beiträge</p>
            <p className="text-3xl font-bold">{postCount}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-blue-200 mb-2">Offene Bestellungen</p>
            <p className="text-3xl font-bold">{pendingOrders}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;