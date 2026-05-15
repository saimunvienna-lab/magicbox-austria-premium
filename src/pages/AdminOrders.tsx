import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RefreshCw, Download, LogOut, Search, Eye, UserPlus,
  Package, Clock, CheckCircle2, Truck, Euro, Mail, Phone, MapPin
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  product_name: string;
  k_series?: string | null;
  quantity: number;
  price: number;
  status: string;
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "cancelled"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const fmt = (n: number) => "€" + Number(n || 0).toFixed(2);

const AdminOrders = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableMissing, setTableMissing] = useState(false);
  const [view, setView] = useState<"orders" | "customers">("orders");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setTableMissing(true);
    } else {
      setOrders((data as Order[]) || []);
      setTableMissing(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    revenue: orders.filter(o => o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.price || 0) * (o.quantity || 1), 0),
  }), [orders]);

  const filtered = useMemo(() => {
    let r = orders;
    if (filter !== "all") r = r.filter(o => o.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(o =>
        o.customer_name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.product_name?.toLowerCase().includes(q) ||
        o.k_series?.toLowerCase().includes(q)
      );
    }
    return r;
  }, [orders, filter, search]);

  const customers = useMemo(() => {
    const map = new Map<string, {
      name: string; email: string; phone?: string | null; location?: string | null;
      orders: number; total: number; last: string;
    }>();
    orders.forEach(o => {
      const k = o.email;
      const ex = map.get(k);
      const lineTotal = Number(o.price || 0) * (o.quantity || 1);
      if (ex) {
        ex.orders += 1;
        ex.total += lineTotal;
        if (new Date(o.created_at) > new Date(ex.last)) ex.last = o.created_at;
      } else {
        map.set(k, {
          name: o.customer_name, email: o.email, phone: o.phone, location: o.location,
          orders: 1, total: lineTotal, last: o.created_at,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => +new Date(b.last) - +new Date(a.last));
  }, [orders]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast({ title: "Fehler beim Aktualisieren", variant: "destructive" }); return; }
    toast({ title: "Status aktualisiert" });
    setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));
    if (open?.id === id) setOpen({ ...open, status });
  };

  const addToCRM = async (o: Order) => {
    const { error } = await supabase.from("customers").upsert({
      name: o.customer_name, email: o.email, phone: o.phone, location: o.location,
    }, { onConflict: "email" });
    if (error) { toast({ title: "Fehler beim Hinzufügen", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Zum CRM hinzugefügt" });
  };

  const exportCSV = () => {
    const rows = [
      ["Date","Customer","Email","Phone","Location","Product","K-Series","Quantity","Price","Status"],
      ...filtered.map(o => [
        new Date(o.created_at).toLocaleDateString("de-DE"),
        o.customer_name, o.email, o.phone || "", o.location || "",
        o.product_name, o.k_series || "", String(o.quantity), String(o.price), o.status,
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO title="Bestellungen | Admin" noIndex />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="block">
            <h1 className="text-xl font-bold leading-tight">SAIDA MagicBox</h1>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={load} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { k: "orders", label: "Orders", count: orders.length },
            { k: "customers", label: "Customers", count: customers.length },
          ].map(t => (
            <button
              key={t.k}
              onClick={() => setView(t.k as "orders" | "customers")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                view === t.k ? "bg-blue-600 text-white shadow" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {t.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                view === t.k ? "bg-white/20" : "bg-slate-100"
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {tableMissing && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 mb-6">
            <p className="font-semibold text-amber-800 mb-2">Bestellungen-Tabelle nicht gefunden</p>
            <p className="text-sm text-amber-700">
              Bitte führen Sie das SQL-Skript im Supabase SQL Editor aus, um die Tabellen <code>orders</code>, <code>customers</code> und <code>dealers</code> zu erstellen.
            </p>
          </div>
        )}

        {view === "orders" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <StatCard icon={<Package className="w-5 h-5" />} label="Total Orders" value={String(stats.total)} color="text-slate-900" />
              <StatCard icon={<Clock className="w-5 h-5" />} label="Pending" value={String(stats.pending)} color="text-orange-600" />
              <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Confirmed" value={String(stats.confirmed)} color="text-blue-600" />
              <StatCard icon={<Truck className="w-5 h-5" />} label="Shipped" value={String(stats.shipped)} color="text-green-600" />
              <StatCard icon={<Euro className="w-5 h-5" />} label="Revenue" value={fmt(stats.revenue)} color="text-blue-600" />
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Shop, email, K-Series suchen..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { k: "all", label: "All", count: stats.total },
                { k: "pending", label: "Pending", count: stats.pending },
                { k: "confirmed", label: "Confirmed", count: stats.confirmed },
                { k: "shipped", label: "Shipped", count: stats.shipped },
                { k: "cancelled", label: "Cancelled", count: stats.cancelled },
              ].map(t => (
                <button
                  key={t.k}
                  onClick={() => setFilter(t.k)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === t.k ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {t.label}
                  {t.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filter === t.k ? "bg-white/20" : "bg-slate-100"
                    }`}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Order cards */}
            {loading ? (
              <p className="text-center py-12 text-slate-500">Wird geladen...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-12 text-slate-500">Keine Bestellungen gefunden.</p>
            ) : (
              <div className="space-y-3">
                {filtered.map(o => (
                  <div key={o.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      {/* Left: customer */}
                      <div className="lg:col-span-4">
                        <h3 className="font-bold text-lg text-slate-900">{o.customer_name}</h3>
                        <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1">
                          <Mail className="w-3.5 h-3.5" /> {o.email}
                        </p>
                        {o.k_series && (
                          <p className="text-sm text-slate-500 mt-1">K-Series: <span className="font-medium text-slate-700">{o.k_series}</span> ×{o.quantity}</p>
                        )}
                      </div>

                      {/* Middle: status & product */}
                      <div className="lg:col-span-4">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_BADGE[o.status] || "bg-slate-100"}`}>
                          {STATUS_LABEL[o.status] || o.status}
                        </span>
                        <p className="font-semibold text-slate-900 mt-2">{o.product_name}</p>
                        <p className="text-green-600 font-bold text-lg">{fmt(Number(o.price) * (o.quantity || 1))}</p>
                      </div>

                      {/* Right: details */}
                      <div className="lg:col-span-4 text-sm text-slate-600 space-y-1">
                        {o.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {o.phone}</p>}
                        {o.location && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {o.location}</p>}
                        <p>Qty: <span className="font-semibold text-slate-900">{o.quantity}</span></p>
                        <p className="text-slate-500">{new Date(o.created_at).toLocaleDateString("de-DE")}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button onClick={() => setOpen(o)} className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200">
                        <Eye className="w-4 h-4" /> Details
                      </button>
                      <button onClick={() => addToCRM(o)} className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-slate-200">
                        <UserPlus className="w-4 h-4" /> Add to CRM
                      </button>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        className="ml-auto text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === "customers" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">Customer Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Total Orders</th>
                  <th className="px-4 py-3 font-semibold">Total Spent</th>
                  <th className="px-4 py-3 font-semibold">Last Order</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-500">Keine Kunden gefunden.</td></tr>
                ) : customers.map(c => (
                  <tr key={c.email} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.email}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{c.location || "—"}</td>
                    <td className="px-4 py-3 font-semibold">{c.orders}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">{fmt(c.total)}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(c.last).toLocaleDateString("de-DE")}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setView("orders"); setSearch(c.email); }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50"
                      >
                        View Orders
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Dialog open={!!open} onOpenChange={v => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>Bestellung von {open.customer_name}</DialogTitle>
                <DialogDescription>
                  {new Date(open.created_at).toLocaleString("de-DE")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field label="E-Mail" value={open.email} />
                <Field label="Telefon" value={open.phone || "—"} />
                <Field label="Standort" value={open.location || "—"} />
                <Field label="Status" value={STATUS_LABEL[open.status] || open.status} />
                <Field label="Produkt" value={open.product_name} />
                <Field label="K-Series" value={open.k_series || "—"} />
                <Field label="Menge" value={String(open.quantity)} />
                <Field label="Gesamt" value={fmt(Number(open.price) * (open.quantity || 1))} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <select
                  value={open.status}
                  onChange={e => updateStatus(open.id, e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
                <Button variant="outline" onClick={() => addToCRM(open)}>
                  <UserPlus className="w-4 h-4 mr-2" /> Add to CRM
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-2">
      {icon} {label}
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-slate-500 text-xs mb-1">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default AdminOrders;
