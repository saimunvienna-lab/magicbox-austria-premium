import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  created_at: string;
  order_number?: string | null;
  contact_name?: string | null;
  shop_name?: string | null;
  email: string;
  phone?: string | null;
  product_type?: string | null;
  k_series?: string | null;
  quantity?: number | null;
  grand_total?: number | null;
  status: string;
  message?: string | null;
  city?: string | null;
  country?: string | null;
};

const TABS = [
  { key: "all", label: "Alle" },
  { key: "pending", label: "Neu" },
  { key: "confirmed", label: "In Bearbeitung" },
  { key: "shipped", label: "Versendet" },
  { key: "completed", label: "Abgeschlossen" },
] as const;

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "completed", "cancelled"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Neu",
  confirmed: "In Bearbeitung",
  shipped: "Versendet",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-blue-500/20 text-blue-200 border border-blue-400/30",
  confirmed: "bg-amber-500/20 text-amber-200 border border-amber-400/30",
  shipped: "bg-purple-500/20 text-purple-200 border border-purple-400/30",
  completed: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30",
  cancelled: "bg-red-500/20 text-red-200 border border-red-400/30",
};

const fmt = (n?: number | null) => n != null ? "€" + Number(n).toFixed(2) : "—";

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableMissing, setTableMissing] = useState(false);
  const [tab, setTab] = useState<string>("all");
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
      setOrders(data || []);
      setTableMissing(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(
    () => orders.filter((o) => tab === "all" || o.status === tab),
    [orders, tab]
  );

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Fehler beim Aktualisieren", variant: "destructive" });
      return;
    }
    toast({ title: "Status aktualisiert" });
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, status } : o)));
    if (open?.id === id) setOpen({ ...open, status });
  };

  const remove = async (id: string) => {
    if (!confirm("Diese Bestellung löschen?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      toast({ title: "Fehler beim Löschen", variant: "destructive" });
      return;
    }
    toast({ title: "Bestellung gelöscht" });
    setOrders((p) => p.filter((o) => o.id !== id));
    setOpen(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <SEO title="Bestellungen | Admin" noIndex />
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 text-sm text-blue-200 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </Link>
          <button onClick={load} className="flex items-center gap-1.5 text-sm text-blue-200 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">
            <RefreshCw className="w-4 h-4" /> Aktualisieren
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Bestellungen verwalten</h1>

        {tableMissing ? (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-400/30 p-8 text-center text-amber-100">
            Bestellungen-Tabelle nicht gefunden. Bitte kontaktieren Sie den Administrator.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 border border-white/10 p-1 w-fit mb-6">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    tab === t.key ? "bg-white text-slate-900" : "text-blue-200 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-center py-12 text-blue-200">Wird geladen...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-12 text-blue-200">Keine Bestellungen gefunden.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl bg-white/5 border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-blue-200">
                    <tr>
                      <th className="text-left px-4 py-3">Nr.</th>
                      <th className="text-left px-4 py-3">Datum</th>
                      <th className="text-left px-4 py-3">Kunde</th>
                      <th className="text-left px-4 py-3">E-Mail</th>
                      <th className="text-left px-4 py-3">Telefon</th>
                      <th className="text-left px-4 py-3">Produkt</th>
                      <th className="text-left px-4 py-3">Menge</th>
                      <th className="text-left px-4 py-3">Gesamt</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-right px-4 py-3">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => (
                      <tr key={o.id} className="border-t border-white/5 hover:bg-white/5 transition">
                        <td className="px-4 py-3 text-blue-200">{o.order_number || o.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-blue-200 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString("de-DE")}</td>
                        <td className="px-4 py-3 font-semibold">{o.contact_name || o.shop_name || "—"}</td>
                        <td className="px-4 py-3 text-blue-100">{o.email}</td>
                        <td className="px-4 py-3 text-blue-100">{o.phone || "—"}</td>
                        <td className="px-4 py-3 text-blue-100">{o.product_type || o.k_series || "—"}</td>
                        <td className="px-4 py-3 text-blue-100">{o.quantity ?? "—"}</td>
                        <td className="px-4 py-3 text-blue-100">{fmt(o.grand_total)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[o.status] || "bg-white/10"} bg-transparent`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="bg-slate-900">{STATUS_LABEL[s] || s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setOpen(o)} title="Details"
                              className="p-2 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => remove(o.id)} title="Löschen"
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>Bestellung {open.order_number || open.id.slice(0, 8)}</DialogTitle>
                <DialogDescription className="text-blue-200">
                  {new Date(open.created_at).toLocaleString("de-DE")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-blue-300 text-xs mb-1">Kunde</p><p>{open.contact_name || "—"}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Shop</p><p>{open.shop_name || "—"}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">E-Mail</p><p>{open.email}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Telefon</p><p>{open.phone || "—"}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Stadt</p><p>{open.city || "—"}, {open.country || ""}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Produkt</p><p>{open.product_type || open.k_series || "—"}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Menge</p><p>{open.quantity ?? "—"}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Gesamt</p><p>{fmt(open.grand_total)}</p></div>
              </div>
              {open.message && (
                <div>
                  <p className="text-blue-300 text-xs mb-2">Nachricht</p>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4 whitespace-pre-wrap text-sm">{open.message}</div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <select
                  value={open.status}
                  onChange={(e) => updateStatus(open.id, e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-slate-900">{STATUS_LABEL[s] || s}</option>
                  ))}
                </select>
                <Button variant="destructive" onClick={() => remove(open.id)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Löschen
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;