import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Package, LogOut, RefreshCw, CheckCircle, Clock, Truck, XCircle,
  Users, Star, Search, Download, MessageSquare, ChevronDown, X, Eye
} from "lucide-react";
import SEO from "@/components/SEO";

/* ── Types ─────────────────────────────────────────────── */
type Order = {
  id: string; created_at: string; shop_name: string; contact_name: string;
  email: string; phone: string; city: string; country: string;
  k_series: string; quantity: number; message: string | null;
  status: string; grand_total: number | null; vat_applied: boolean | null;
  product_type: string | null; vat_number: string | null;
};
type Customer = {
  id: string; created_at: string; shop_name: string; contact_name: string | null;
  email: string; phone: string | null; city: string | null; country: string | null;
  vat_number: string | null; rating: number; notes: string | null;
  total_orders: number; total_spent: number;
};

/* ── Constants ──────────────────────────────────────────── */
const ADMIN_EMAIL    = "office@saidamagicbox.com";
const ADMIN_PASSWORD = "SaidaMagicBox2025!";
const STATUS_OPTIONS = ["pending","confirmed","shipped","cancelled"];
const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped:   "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};
const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:   <Clock className="w-3 h-3" />,
  confirmed: <CheckCircle className="w-3 h-3" />,
  shipped:   <Truck className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

const fmt = (n: number | null) => n != null ? "€" + n.toFixed(2).replace(".", ",") : "—";
const Stars = ({ rating, onRate }: { rating: number; onRate?: (r: number) => void }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <button key={i} type="button" onClick={() => onRate?.(i)}
        className={`${onRate ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}>
        <Star className={`w-4 h-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
      </button>
    ))}
  </div>
);

/* ── Main Component ─────────────────────────────────────── */
const Admin = () => {
  const [authed, setAuthed]     = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab]           = useState<"orders" | "customers">("orders");

  // Orders
  const [orders, setOrders]     = useState<Order[]>([]);
  const [oLoading, setOLoading] = useState(false);
  const [oFilter, setOFilter]   = useState("all");
  const [oSearch, setOSearch]   = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [orderNote, setOrderNote] = useState("");

  // Customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cLoading, setCLoading]   = useState(false);
  const [cSearch, setCSearch]     = useState("");
  const [selCust, setSelCust]     = useState<Customer | null>(null);
  const [custNote, setCustNote]   = useState("");
  const [custOrders, setCustOrders] = useState<Order[]>([]);

  /* Auth */
  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthed(true);
      loadOrders();
    } else {
      setLoginErr("Invalid credentials");
    }
  };

  /* Load orders */
  const loadOrders = useCallback(async () => {
    setOLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    setOLoading(false);
  }, []);

  /* Load customers */
  const loadCustomers = useCallback(async () => {
    setCLoading(true);
    const { data } = await supabase.from("customers").select("*").order("total_spent", { ascending: false });
    if (data) setCustomers(data);
    setCLoading(false);
  }, []);

  useEffect(() => {
    if (authed && tab === "customers") loadCustomers();
  }, [authed, tab, loadCustomers]);

  /* Update order status */
  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  /* Sync customer from order */
  const syncCustomer = async (order: Order) => {
    const { data: existing } = await supabase.from("customers").select("*").eq("email", order.email).single();
    if (existing) {
      await supabase.from("customers").update({
        total_orders: existing.total_orders + 1,
        total_spent:  (existing.total_spent || 0) + (order.grand_total || 0),
        shop_name:    order.shop_name,
        contact_name: order.contact_name,
        phone:        order.phone,
        city:         order.city,
        country:      order.country,
      }).eq("email", order.email);
    } else {
      await supabase.from("customers").insert([{
        shop_name:    order.shop_name,
        contact_name: order.contact_name,
        email:        order.email,
        phone:        order.phone,
        city:         order.city,
        country:      order.country,
        vat_number:   order.vat_number,
        total_orders: 1,
        total_spent:  order.grand_total || 0,
      }]);
    }
    loadCustomers();
  };

  /* Update customer rating */
  const rateCustomer = async (id: string, rating: number) => {
    await supabase.from("customers").update({ rating }).eq("id", id);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, rating } : c));
    if (selCust?.id === id) setSelCust(prev => prev ? { ...prev, rating } : null);
  };

  /* Save customer note */
  const saveCustNote = async (id: string, notes: string) => {
    await supabase.from("customers").update({ notes }).eq("id", id);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, notes } : c));
  };

  /* Load customer orders */
  const openCustomer = async (c: Customer) => {
    setSelCust(c);
    setCustNote(c.notes || "");
    const { data } = await supabase.from("orders").select("*").eq("email", c.email).order("created_at", { ascending: false });
    if (data) setCustOrders(data);
  };

  /* Export CSV */
  const exportCSV = () => {
    const rows = [
      ["Date","Shop","Contact","Email","Phone","City","Country","K-Series","Qty","Total","Status","VAT"],
      ...filteredOrders.map(o => [
        new Date(o.created_at).toLocaleDateString(),
        o.shop_name, o.contact_name, o.email, o.phone,
        o.city, o.country, o.k_series, o.quantity,
        o.grand_total ?? "", o.status, o.vat_number ?? "",
      ])
    ];
    const csv = rows.map(r => r.map(String).map(v => `"${v.replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `saida-orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  /* Filtered orders */
  const filteredOrders = orders.filter(o => {
    const matchStatus = oFilter === "all" || o.status === oFilter;
    const q = oSearch.toLowerCase();
    const matchSearch = !q || o.shop_name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.k_series.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filteredCustomers = customers.filter(c => {
    const q = cSearch.toLowerCase();
    return !q || c.shop_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const counts = STATUS_OPTIONS.reduce((a, s) => ({ ...a, [s]: orders.filter(o => o.status === s).length }), {} as Record<string, number>);
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((a, o) => a + (o.grand_total || 0), 0);

  /* ── LOGIN ── */
  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <SEO title="Admin | SAIDA MagicBox" noIndex />
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">SAIDA Admin</span>
        </div>
        <form onSubmit={login} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500" />
          {loginErr && <p className="text-red-500 text-sm">{loginErr}</p>}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );

  /* ── DASHBOARD ── */
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <SEO title="Admin | SAIDA MagicBox" noIndex />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">SAIDA MagicBox</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { tab === "orders" ? loadOrders() : loadCustomers(); }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          {tab === "orders" && (
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 transition">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          )}
          <button onClick={() => setAuthed(false)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {(["orders","customers"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t === "orders" ? <Package className="w-4 h-4" /> : <Users className="w-4 h-4" />}
              {t === "orders" ? "Orders" : "Customers"}
              {t === "orders" && <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{orders.length}</span>}
              {t === "customers" && <span className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded-full">{customers.length}</span>}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {[
                { label: "Total Orders", value: orders.length, color: "text-gray-700" },
                { label: "Pending", value: counts.pending || 0, color: "text-yellow-700" },
                { label: "Confirmed", value: counts.confirmed || 0, color: "text-blue-700" },
                { label: "Shipped", value: counts.shipped || 0, color: "text-green-700" },
                { label: "Revenue", value: fmt(totalRevenue), color: "text-blue-700" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={oSearch} onChange={e => setOSearch(e.target.value)}
                  placeholder="Shop, email, K-Series suchen..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", ...STATUS_OPTIONS].map(s => (
                  <button key={s} onClick={() => setOFilter(s)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                      oFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}>
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    {s !== "all" && counts[s] ? ` (${counts[s]})` : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Order list */}
            {oLoading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No orders found</div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition">
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-sm">{order.shop_name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLE[order.status]}`}>
                            {STATUS_ICON[order.status]} {order.status}
                          </span>
                          {order.product_type === "starter" && (
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full border border-purple-200">Starter Box</span>
                          )}
                          {order.grand_total != null && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">{fmt(order.grand_total)}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
                          <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Contact:</span> {order.contact_name}</p>
                          <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Email:</span> {order.email}</p>
                          <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Phone:</span> {order.phone}</p>
                          <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Location:</span> {order.city}, {order.country}</p>
                          <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">K-Series:</span> {order.k_series}</p>
                          <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Qty:</span> {order.quantity}</p>
                          <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                          {order.vat_number && <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">VAT:</span> {order.vat_number}</p>}
                        </div>
                        {order.message && (
                          <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg px-3 py-2 italic">"{order.message}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <button onClick={() => { setSelected(order); setOrderNote(""); }}
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition border border-gray-200">
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        <button onClick={() => syncCustomer(order)}
                          className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-50 transition border border-purple-200">
                          <Users className="w-3.5 h-3.5" /> Add to CRM
                        </button>
                        <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 bg-white">
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {tab === "customers" && (
          <>
            <div className="relative mb-4 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={cSearch} onChange={e => setCSearch(e.target.value)}
                placeholder="Shop oder Email suchen..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white" />
            </div>

            {cLoading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No customers yet. Use "Add to CRM" on orders.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCustomers.map(c => (
                  <div key={c.id} onClick={() => openCustomer(c)}
                    className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-sm">{c.shop_name.slice(0,2).toUpperCase()}</span>
                      </div>
                      <Stars rating={c.rating} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{c.shop_name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{c.email}</p>
                    <div className="flex gap-4 text-xs">
                      <div><p className="text-gray-400">Orders</p><p className="font-semibold text-gray-700">{c.total_orders}</p></div>
                      <div><p className="text-gray-400">Spent</p><p className="font-semibold text-green-600">{fmt(c.total_spent)}</p></div>
                      <div><p className="text-gray-400">Country</p><p className="font-semibold text-gray-700">{c.country || "—"}</p></div>
                    </div>
                    {c.notes && <p className="mt-3 text-xs text-gray-400 italic truncate">"{c.notes}"</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── ORDER DETAIL MODAL ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Order Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selected.shop_name}</h3>
                  <p className="text-xs text-gray-500">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[selected.status]}`}>
                  {STATUS_ICON[selected.status]} {selected.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Contact", selected.contact_name],
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  ["Location", `${selected.city}, ${selected.country}`],
                  ["K-Series", selected.k_series],
                  ["Quantity", selected.quantity],
                  ["Total", fmt(selected.grand_total)],
                  ["VAT", selected.vat_applied ? "Yes (20%)" : "No"],
                  ...(selected.vat_number ? [["VAT Number", selected.vat_number]] : []),
                ].map(([label, value], i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
              {selected.message && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-700">"{selected.message}"</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                        selected.status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { syncCustomer(selected); setSelected(null); setTab("customers"); }}
                className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> Add to Customer CRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMER DETAIL MODAL ── */}
      {selCust && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelCust(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Customer Profile</h2>
              <button onClick={() => setSelCust(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">{selCust.shop_name.slice(0,2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{selCust.shop_name}</h3>
                  <p className="text-sm text-gray-500">{selCust.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{selCust.city}, {selCust.country}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Customer Rating</p>
                <Stars rating={selCust.rating} onRate={r => rateCustomer(selCust.id, r)} />
                <p className="text-xs text-amber-600 mt-1">Click to rate</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Orders", value: selCust.total_orders, color: "text-blue-600" },
                  { label: "Total Spent", value: fmt(selCust.total_spent), color: "text-green-600" },
                  { label: "Member Since", value: new Date(selCust.created_at).toLocaleDateString(), color: "text-gray-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className={`text-sm font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="space-y-2 text-sm">
                {[
                  ["📞", selCust.phone],
                  ["🏢", selCust.vat_number],
                ].filter(([, v]) => v).map(([icon, val], i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600">
                    <span>{icon}</span><span>{val}</span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Internal Notes
                </p>
                <textarea value={custNote} onChange={e => setCustNote(e.target.value)}
                  placeholder="Add notes about this customer..."
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-400 resize-none" />
                <button onClick={() => saveCustNote(selCust.id, custNote)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                  Save Note
                </button>
              </div>

              {/* Order history */}
              {custOrders.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order History</p>
                  <div className="space-y-2">
                    {custOrders.map(o => (
                      <div key={o.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-xs font-medium text-gray-900">{o.k_series}</p>
                          <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {o.grand_total != null && <span className="text-xs font-semibold text-green-600">{fmt(o.grand_total)}</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLE[o.status]}`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
