import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Mail, Phone, MessageCircle, Trash2, CheckCircle, Eye, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Msg = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status?: string | null;
};

const TABS = [
  { key: "all", label: "Alle" },
  { key: "new", label: "Neu" },
  { key: "answered", label: "Beantwortet" },
] as const;

const AdminContacts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "new" | "answered">("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Msg | null>(null);
  const [tableMissing, setTableMissing] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setTableMissing(true);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      const status = m.status || "new";
      if (tab !== "all" && status !== tab) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        (m.company || "").toLowerCase().includes(q)
      );
    });
  }, [items, tab, search]);

  const markAnswered = async (id: string) => {
    const { error } = await supabase.from("contact_messages").update({ status: "answered" }).eq("id", id);
    if (error) {
      toast({ title: "Status-Spalte fehlt", description: "Bitte 'status' Spalte in contact_messages anlegen.", variant: "destructive" });
      return;
    }
    toast({ title: "Als beantwortet markiert" });
    setItems((p) => p.map((m) => (m.id === id ? { ...m, status: "answered" } : m)));
    if (open?.id === id) setOpen({ ...open, status: "answered" });
  };

  const remove = async (id: string) => {
    if (!confirm("Diese Nachricht löschen?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast({ title: "Fehler beim Löschen", variant: "destructive" });
      return;
    }
    toast({ title: "Nachricht gelöscht" });
    setItems((p) => p.filter((m) => m.id !== id));
    setOpen(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <SEO title="Kontaktanfragen | Admin" noIndex />
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
        <h1 className="text-3xl font-bold mb-6">Kontaktanfragen verwalten</h1>

        {tableMissing && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 p-4 mb-6 text-amber-100">
            contact_messages-Tabelle nicht gefunden oder kein Zugriff.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1 rounded-xl bg-white/5 border border-white/10 p-1">
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
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, E-Mail, Firma..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-300 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center py-12 text-blue-200">Wird geladen...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-blue-200">Keine Anfragen gefunden.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white/5 border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-blue-200">
                <tr>
                  <th className="text-left px-4 py-3">Datum</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">E-Mail</th>
                  <th className="text-left px-4 py-3">Telefon</th>
                  <th className="text-left px-4 py-3">Firma</th>
                  <th className="text-left px-4 py-3">Nachricht</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const status = m.status || "new";
                  return (
                    <tr key={m.id} className="border-t border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-blue-200 whitespace-nowrap">
                        {new Date(m.created_at).toLocaleString("de-DE")}
                      </td>
                      <td className="px-4 py-3 font-semibold">{m.name}</td>
                      <td className="px-4 py-3 text-blue-100">{m.email}</td>
                      <td className="px-4 py-3 text-blue-100">{m.phone || "—"}</td>
                      <td className="px-4 py-3 text-blue-100">{m.company || "—"}</td>
                      <td className="px-4 py-3 text-blue-100 max-w-[280px]">
                        <button onClick={() => setOpen(m)} className="text-left hover:underline">
                          {m.message.slice(0, 50)}{m.message.length > 50 ? "..." : ""}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          status === "answered"
                            ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
                            : "bg-blue-500/20 text-blue-200 border border-blue-400/30"
                        }`}>
                          {status === "answered" ? "Beantwortet" : "Neu"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setOpen(m)} title="Details"
                            className="p-2 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </button>
                          {status !== "answered" && (
                            <button onClick={() => markAnswered(m.id)} title="Als beantwortet markieren"
                              className="p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-300">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => remove(m.id)} title="Löschen"
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>Nachricht von {open.name}</DialogTitle>
                <DialogDescription className="text-blue-200">
                  {new Date(open.created_at).toLocaleString("de-DE")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-blue-300 text-xs mb-1">E-Mail</p><p>{open.email}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Telefon</p><p>{open.phone || "—"}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Firma</p><p>{open.company || "—"}</p></div>
                <div><p className="text-blue-300 text-xs mb-1">Status</p><p>{open.status === "answered" ? "Beantwortet" : "Neu"}</p></div>
              </div>
              <div>
                <p className="text-blue-300 text-xs mb-2">Nachricht</p>
                <div className="rounded-lg bg-white/5 border border-white/10 p-4 whitespace-pre-wrap text-sm">
                  {open.message}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {open.phone && (
                  <Button asChild variant="outline" className="bg-emerald-500/10 border-emerald-400/30 text-emerald-100 hover:bg-emerald-500/20">
                    <a href={`https://wa.me/${open.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp öffnen
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="bg-blue-500/10 border-blue-400/30 text-blue-100 hover:bg-blue-500/20">
                  <a href={`mailto:${open.email}`}>
                    <Mail className="w-4 h-4 mr-2" /> E-Mail senden
                  </a>
                </Button>
                {open.phone && (
                  <Button asChild variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <a href={`tel:${open.phone}`}>
                      <Phone className="w-4 h-4 mr-2" /> Anrufen
                    </a>
                  </Button>
                )}
                {open.status !== "answered" && (
                  <Button onClick={() => markAnswered(open.id)} className="bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4 mr-2" /> Als beantwortet markieren
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContacts;