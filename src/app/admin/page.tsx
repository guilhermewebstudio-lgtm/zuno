"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  ListChecks,
  Star,
  Flag,
  Ban,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Send,
  Euro,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  BarChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface Stats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  featuredListings: number;
  pendingReports: number;
  totalRevenue: number;
  daily: { date: string; utilizadores: number; anuncios: number; receita: number }[];
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  city: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
  _count: { listings: number };
}

interface AdminListing {
  id: string;
  title: string;
  price: string;
  status: string;
  isFeatured: boolean;
  user: { name: string; email: string };
  category: { namePt: string };
  _count: { reports: number };
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"dashboard" | "users" | "listings" | "email">("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailTarget, setEmailTarget] = useState<"all" | "with_listings">("all");
  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/entrar");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    (async () => {
      setDataLoading(true);
      const [statsRes, usersRes, listingsRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/listings").then((r) => r.json()),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users || []);
      setListings(listingsRes.listings || []);
      setDataLoading(false);
    })();
  }, [user]);

  async function toggleBan(userId: string, isBanned: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isBanned: !isBanned }),
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: !isBanned } : u)));
  }

  async function toggleFeatured(listingId: string, isFeatured: boolean) {
    await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, isFeatured: !isFeatured }),
    });
    setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, isFeatured: !isFeatured } : l)));
  }

  async function removeListing(listingId: string) {
    if (!confirm("Tens a certeza que queres remover este anúncio?")) return;
    await fetch("/api/admin/listings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  }

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setEmailResult(null);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: emailSubject, message: emailMessage, target: emailTarget }),
      });
      const data = await res.json();
      setEmailResult(data);
    } finally {
      setSending(false);
    }
  }

  if (loading || !user?.isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">A verificar acesso...</div>;
  }

  const statCards = [
    { label: "Utilizadores", value: stats?.totalUsers ?? "—", icon: Users, color: "var(--zuno-navy)" },
    { label: "Anúncios totais", value: stats?.totalListings ?? "—", icon: ListChecks, color: "var(--zuno-navy)" },
    { label: "Anúncios ativos", value: stats?.activeListings ?? "—", icon: CheckCircle2, color: "var(--zuno-green)" },
    { label: "Em destaque", value: stats?.featuredListings ?? "—", icon: Star, color: "var(--zuno-gold)" },
    { label: "Receita total", value: stats ? `€${stats.totalRevenue.toFixed(2)}` : "—", icon: Euro, color: "var(--zuno-green)" },
    { label: "Denúncias pendentes", value: stats?.pendingReports ?? "—", icon: Flag, color: "#e0483e" },
  ];

  const tabs = [
    { key: "dashboard" as const, label: "Dashboard" },
    { key: "users" as const, label: "Utilizadores" },
    { key: "listings" as const, label: "Anúncios" },
    { key: "email" as const, label: "Emails" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--zuno-navy-dark)] via-[var(--background)] to-[var(--background)] px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-white" size={26} />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Painel de administração</h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white bg-white/10 px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft size={15} />
            Voltar à loja
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm"
            >
              <s.icon size={18} style={{ color: s.color }} />
              <p className="text-2xl font-bold text-[var(--zuno-navy-dark)] mt-2">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t.key ? "bg-[var(--zuno-navy)] text-white" : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <p className="text-gray-400 text-sm">A carregar dados...</p>
        ) : tab === "dashboard" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-black/5 shadow-sm p-6"
          >
            <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-1">Atividade nos últimos 14 dias</h3>
            <p className="text-xs text-gray-400 mb-6">Novos utilizadores e anúncios publicados por dia</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.daily || []}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f2951" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0f2951" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e2822f" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#e2822f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#999" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#999" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="utilizadores" stroke="#0f2951" fill="url(#colorUsers)" strokeWidth={2} />
                  <Area type="monotone" dataKey="anuncios" stroke="#e2822f" fill="url(#colorListings)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--zuno-navy)]" /> Utilizadores</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--zuno-gold)]" /> Anúncios</span>
            </div>
          </motion.div>
        ) : null}

        {tab === "dashboard" && !dataLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mt-6"
          >
            <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-1">Receita (destaques pagos)</h3>
            <p className="text-xs text-gray-400 mb-6">Euros recebidos por dia nos últimos 14 dias</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.daily || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#999" }} />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#999" }}
                    tickFormatter={(v) => `€${v}`}
                  />
                  <Tooltip formatter={(value) => [`€${Number(value).toFixed(2)}`, "Receita"]} />
                  <Bar dataKey="receita" radius={[6, 6, 0, 0]} maxBarSize={28}>
                    {(stats?.daily || []).map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.receita > 0 ? "#14926b" : "#e5e7eb"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {stats?.daily.every((d) => d.receita === 0) && (
              <p className="text-xs text-gray-400 mt-3 text-center">
                Ainda sem receita registada — vai aparecer aqui assim que os pagamentos de destaque estiverem ativos.
              </p>
            )}
          </motion.div>
        )}

        {!dataLoading && tab === "users" ? (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Anúncios</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-[var(--zuno-navy-dark)]">
                      {u.name} {u.isAdmin && <span className="text-[var(--zuno-gold)] text-xs ml-1">(admin)</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">{u._count.listings}</td>
                    <td className="px-4 py-3">
                      {u.isBanned ? (
                        <span className="text-red-500 text-xs font-semibold">Suspenso</span>
                      ) : (
                        <span className="text-green-600 text-xs font-semibold">Ativo</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!u.isAdmin && (
                        <button
                          onClick={() => toggleBan(u.id, u.isBanned)}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Ban size={14} />
                          {u.isBanned ? "Reativar" : "Suspender"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !dataLoading && tab === "listings" ? (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Vendedor</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Denúncias</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-[var(--zuno-navy-dark)]">
                      {l.title} {l.isFeatured && <Star size={12} className="inline text-[var(--zuno-gold)] ml-1" />}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{l.category?.namePt}</td>
                    <td className="px-4 py-3 text-gray-500">{l.status}</td>
                    <td className="px-4 py-3">
                      {l._count.reports > 0 ? <span className="text-red-500 font-semibold">{l._count.reports}</span> : "0"}
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => toggleFeatured(l.id, l.isFeatured)}
                        className="text-xs font-semibold text-gray-500 hover:text-[var(--zuno-gold)] transition-colors"
                      >
                        {l.isFeatured ? "Remover destaque" : "Destacar"}
                      </button>
                      <button
                        onClick={() => removeListing(l.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      Ainda não há anúncios criados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : !dataLoading && tab === "email" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-1">
              <Mail size={18} className="text-[var(--zuno-navy)]" />
              <h3 className="font-bold text-[var(--zuno-navy-dark)]">Enviar email a utilizadores</h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Envia novidades, promoções ou avisos para todos os utilizadores registados.
            </p>

            <form onSubmit={sendEmail} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Destinatários</label>
                <select
                  value={emailTarget}
                  onChange={(e) => setEmailTarget(e.target.value as "all" | "with_listings")}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                >
                  <option value="all">Todos os utilizadores</option>
                  <option value="with_listings">Só quem tem anúncios publicados</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Assunto</label>
                <input
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                  placeholder="Ex: Novidades no Zuno!"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Mensagem</label>
                <textarea
                  required
                  rows={6}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)] resize-none"
                  placeholder="Escreve a mensagem que queres enviar..."
                />
              </div>

              {emailResult && (
                <p className="text-sm text-green-600">
                  Enviado a {emailResult.sent} de {emailResult.total} utilizadores
                  {emailResult.failed > 0 && ` (${emailResult.failed} falharam)`}.
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 bg-[var(--zuno-navy)] text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-60"
              >
                <Send size={15} />
                {sending ? "A enviar..." : "Enviar email"}
              </motion.button>
            </form>
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}
