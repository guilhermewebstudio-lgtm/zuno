"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  featuredListings: number;
  pendingReports: number;
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
  const [tab, setTab] = useState<"users" | "listings">("users");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: !isBanned } : u))
    );
  }

  async function toggleFeatured(listingId: string, isFeatured: boolean) {
    await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, isFeatured: !isFeatured }),
    });
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, isFeatured: !isFeatured } : l))
    );
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

  if (loading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        A verificar acesso...
      </div>
    );
  }

  const statCards = [
    { label: "Utilizadores", value: stats?.totalUsers ?? "—", icon: Users, color: "var(--zuno-navy)" },
    { label: "Anúncios totais", value: stats?.totalListings ?? "—", icon: ListChecks, color: "var(--zuno-navy)" },
    { label: "Anúncios ativos", value: stats?.activeListings ?? "—", icon: CheckCircle2, color: "var(--zuno-orange)" },
    { label: "Em destaque", value: stats?.featuredListings ?? "—", icon: Star, color: "var(--zuno-orange)" },
    { label: "Denúncias pendentes", value: stats?.pendingReports ?? "—", icon: Flag, color: "#e0483e" },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <ShieldCheck className="text-[var(--zuno-navy)]" size={26} />
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)]">
            Painel de administração
          </h1>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
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

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === "users"
                ? "bg-[var(--zuno-navy)] text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            Utilizadores
          </button>
          <button
            onClick={() => setTab("listings")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === "listings"
                ? "bg-[var(--zuno-navy)] text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            Anúncios
          </button>
        </div>

        {dataLoading ? (
          <p className="text-gray-400 text-sm">A carregar dados...</p>
        ) : tab === "users" ? (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
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
                      {u.name} {u.isAdmin && <span className="text-[var(--zuno-orange)] text-xs ml-1">(admin)</span>}
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
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
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
                      {l.title} {l.isFeatured && <Star size={12} className="inline text-[var(--zuno-orange)] ml-1" />}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{l.category?.namePt}</td>
                    <td className="px-4 py-3 text-gray-500">{l.status}</td>
                    <td className="px-4 py-3">
                      {l._count.reports > 0 ? (
                        <span className="text-red-500 font-semibold">{l._count.reports}</span>
                      ) : (
                        "0"
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => toggleFeatured(l.id, l.isFeatured)}
                        className="text-xs font-semibold text-gray-500 hover:text-[var(--zuno-orange)] transition-colors"
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
        )}
      </div>
    </main>
  );
}
