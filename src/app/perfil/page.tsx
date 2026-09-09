"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, RotateCcw, Eye, Calendar, Pencil, Trash2, Pause, Play, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingInfoModal from "@/components/PricingInfoModal";
import VerifiedBadgeMini from "@/components/VerifiedBadgeMini";
import { useAuth } from "@/context/AuthContext";

interface ListingRow {
  id: string;
  title: string;
  price: string;
  status: string;
  viewsCount: number;
  createdAt: string;
  expiresAt: string;
  images: { url: string }[];
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function timeAgoLabel(createdAt: string) {
  const days = daysBetween(new Date(createdAt), new Date());
  if (days <= 0) return "publicado hoje";
  if (days === 1) return "publicado há 1 dia";
  return `publicado há ${days} dias`;
}

function expiresLabel(expiresAt: string, status: string) {
  if (status !== "ACTIVE") return null;
  const days = daysBetween(new Date(), new Date(expiresAt));
  if (days <= 0) return "expira hoje";
  if (days === 1) return "expira em 1 dia";
  return `expira em ${days} dias`;
}

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [modalType, setModalType] = useState<"featured" | "verified" | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push("/entrar");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setListings(d.listings || []);
        setName(d.user?.name || "");
        setPhone(d.user?.phone || "");
        setCity(d.user?.city || "");
        setRating(d.rating);
        setRatingCount(d.ratingCount || 0);
      })
      .finally(() => setDataLoading(false));
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, city }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function republish(id: string) {
    await fetch(`/api/listings/${id}/republish`, { method: "POST" });
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "ACTIVE" } : l))
    );
  }

  async function togglePause(id: string, currentStatus: string) {
    const newStatus = currentStatus === "PAUSED" ? "ACTIVE" : "PAUSED";
    await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
  }

  async function cancelListing(id: string) {
    if (!confirm("Tens a certeza que queres cancelar e remover este anúncio? Esta ação não pode ser desfeita.")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">A carregar...</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] px-4 py-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[280px_1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-fit"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--zuno-navy)]/10 flex items-center justify-center mb-4">
              <User size={28} className="text-[var(--zuno-navy)]" />
            </div>
            <h1 className="font-bold text-[var(--zuno-navy-dark)] text-lg flex items-center gap-1.5">
              {user.name}
              {user.isVerified && (
                <span className="flex items-center gap-1 text-[var(--zuno-navy)] text-xs font-semibold">
                  <VerifiedBadgeMini /> Verificado
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Mail size={12} /> {user.email}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={12}
                  className={rating && n <= Math.round(rating) ? "text-[var(--zuno-gold)]" : "text-gray-200"}
                  fill={rating && n <= Math.round(rating) ? "currentColor" : "none"}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">
                {ratingCount > 0 ? `${rating!.toFixed(1)} (${ratingCount})` : "Sem avaliações"}
              </span>
            </div>

            {!user.isVerified && (
              <button
                onClick={() => setModalType("verified")}
                className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[var(--zuno-navy)] bg-[var(--zuno-navy)]/10 px-3 py-2 rounded-xl w-full justify-center hover:bg-[var(--zuno-navy)]/15 transition-colors"
              >
                <VerifiedBadgeMini /> Pedir selo de Verificado
              </button>
            )}

            <form onSubmit={handleSave} className="mt-6 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Phone size={11} /> Telemóvel
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                  placeholder="9xx xxx xxx"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <MapPin size={11} /> Cidade
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
                  placeholder="Ex: Lisboa"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-1.5 bg-[var(--zuno-navy)] text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-60"
              >
                <Save size={14} />
                {saving ? "A guardar..." : saved ? "Guardado!" : "Guardar alterações"}
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-bold text-[var(--zuno-navy-dark)] text-lg mb-4">
              Os meus anúncios
            </h2>

            {dataLoading ? (
              <p className="text-gray-400 text-sm">A carregar...</p>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/5 p-8 text-center text-gray-400">
                Ainda não tens anúncios.{" "}
                <Link href="/vender" className="text-[var(--zuno-navy)] font-semibold">
                  Publica o primeiro
                </Link>
                .
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((l) => {
                  const expLabel = expiresLabel(l.expiresAt, l.status);
                  return (
                    <div
                      key={l.id}
                      className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                        {l.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.images[0].url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/anuncio/${l.id}`} className="font-semibold text-sm text-[var(--zuno-navy-dark)] hover:underline">
                            {l.title}
                          </Link>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                              l.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : l.status === "EXPIRED"
                                ? "bg-red-100 text-red-600"
                                : l.status === "PAUSED"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {l.status === "ACTIVE" ? "Ativo" : l.status === "EXPIRED" ? "Expirado" : l.status === "PAUSED" ? "Pausado" : l.status}
                          </span>
                        </div>

                        <p className="text-base font-bold text-[var(--zuno-navy)] mt-0.5">
                          €{Number(l.price).toFixed(2)}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {l.viewsCount} visualizaç{l.viewsCount === 1 ? "ão" : "ões"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {timeAgoLabel(l.createdAt)}
                          </span>
                          {expLabel && (
                            <span className={expLabel.includes("hoje") ? "text-red-500 font-medium" : ""}>
                              · {expLabel}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {l.status === "EXPIRED" && (
                            <button
                              onClick={() => republish(l.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-[var(--zuno-navy)] bg-[var(--zuno-navy)]/10 px-3 py-1.5 rounded-full"
                            >
                              <RotateCcw size={12} /> Republicar
                            </button>
                          )}
                          {l.status === "ACTIVE" && (
                            <button
                              onClick={() => setModalType("featured")}
                              className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[var(--zuno-gold)] to-[#c9852f] px-3.5 py-1.5 rounded-full shadow-sm shadow-amber-900/20 hover:brightness-105 transition-all"
                            >
                              <Star size={12} fill="currentColor" /> Destacar
                            </button>
                          )}
                          {(l.status === "ACTIVE" || l.status === "PAUSED") && (
                            <button
                              onClick={() => togglePause(l.id, l.status)}
                              className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              {l.status === "PAUSED" ? <Play size={12} /> : <Pause size={12} />}
                              {l.status === "PAUSED" ? "Reativar" : "Pausar"}
                            </button>
                          )}
                          <Link
                            href={`/anuncio/${l.id}/editar`}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Pencil size={12} /> Editar
                          </Link>
                          <button
                            onClick={() => cancelListing(l.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={12} /> Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
      <PricingInfoModal open={modalType !== null} onClose={() => setModalType(null)} type={modalType || "featured"} />
    </>
  );
}
