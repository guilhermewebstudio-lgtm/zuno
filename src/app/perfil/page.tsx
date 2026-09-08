"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface ListingRow {
  id: string;
  title: string;
  price: string;
  status: string;
  expiresAt: string;
  images: { url: string }[];
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
            <h1 className="font-bold text-[var(--zuno-navy-dark)] text-lg">{user.name}</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Mail size={12} /> {user.email}
            </p>

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
                {listings.map((l) => (
                  <div
                    key={l.id}
                    className="bg-white rounded-2xl border border-black/5 shadow-sm p-3 flex items-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {l.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.images[0].url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/anuncio/${l.id}`} className="font-semibold text-sm text-[var(--zuno-navy-dark)] truncate block">
                        {l.title}
                      </Link>
                      <p className="text-sm font-bold text-[var(--zuno-navy)]">€{Number(l.price).toFixed(2)}</p>
                      <span
                        className={`text-[10px] font-semibold uppercase ${
                          l.status === "ACTIVE" ? "text-green-600" : l.status === "EXPIRED" ? "text-red-500" : "text-gray-400"
                        }`}
                      >
                        {l.status === "ACTIVE" ? "Ativo" : l.status === "EXPIRED" ? "Expirado" : l.status}
                      </span>
                    </div>
                    {l.status === "EXPIRED" && (
                      <button
                        onClick={() => republish(l.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-[var(--zuno-navy)] bg-[var(--zuno-navy)]/10 px-3 py-1.5 rounded-full shrink-0"
                      >
                        <RotateCcw size={12} /> Republicar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
