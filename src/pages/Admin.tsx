import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, LogOut, RefreshCw, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

type Order = {
  id: string;
  created_at: string;
  shop_name: string;
  contact_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  k_series: string;
  quantity: number;
  message: string | null;
  status: string;
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "cancelled"];

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

const ADMIN_EMAIL    = "office@saidamagicbox.com";
const ADMIN_PASSWORD = "SaidaMagicBox2025!";

const Admin = () => {
  const [authed, setAuthed]   = useState(false);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter]   = useState("all");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setLoginErr("");
      loadOrders();
    } else {
      setLoginErr("Invalid credentials");
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SAIDA Admin</span>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email" required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
            />
            {loginErr && <p className="text-red-500 text-sm">{loginErr}</p>}
            <button type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">SAIDA MagicBox</h1>
            <p className="text-xs text-gray-500">Order Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadOrders}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={() => setAuthed(false)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: orders.length, color: "bg-gray-100 text-gray-700" },
            { label: "Pending", value: counts.pending || 0, color: "bg-yellow-100 text-yellow-700" },
            { label: "Confirmed", value: counts.confirmed || 0, color: "bg-blue-100 text-blue-700" },
            { label: "Shipped", value: counts.shipped || 0, color: "bg-green-100 text-green-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color.split(" ")[1]}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                filter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && counts[s] ? ` (${counts[s]})` : ""}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No orders found</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{order.shop_name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLE[order.status]}`}>
                        {STATUS_ICON[order.status]} {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2">
                      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Contact:</span> {order.contact_name}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Email:</span> {order.email}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Phone:</span> {order.phone}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Location:</span> {order.city}, {order.country}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">K-Series:</span> {order.k_series}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Quantity:</span> {order.quantity}</p>
                      <p className="text-xs text-gray-500"><span className="font-medium text-gray-700">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    {order.message && (
                      <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg px-3 py-2">"{order.message}"</p>
                    )}
                  </div>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-white flex-shrink-0"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
