"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, SearchX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import VerifiedBadgeMini from "@/components/VerifiedBadgeMini";

interface Listing {
  id: string;
  title: string;
  price: string;
  city: string;
  isFeatured: boolean;
  images: { url: string }[];
  user: { isVerified?: boolean };
}

export default function PesquisaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">A carregar...</div>}>
      <PesquisaContent />
    </Suspense>
  );
}

function PesquisaContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(!!q);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!q) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/listings?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .finally(() => setLoading(false));
  }, [q]);

  useEffect(() => {
    fetch("/api/favorites/ids")
      .then((r) => r.json())
      .then((d) => setFavorites(d.ids || []));
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)]">
            Resultados para &quot;{q}&quot;
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "A procurar..." : `${listings.length} anúncio${listings.length === 1 ? "" : "s"} encontrado${listings.length === 1 ? "" : "s"}`}
          </p>
        </motion.div>

        {!loading && listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-400 flex flex-col items-center gap-3">
            <SearchX size={32} className="text-gray-300" />
            Não encontrámos nada para &quot;{q}&quot;. Tenta outra palavra-chave.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {listings.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
              >
                <Link
                  href={`/anuncio/${item.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {item.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--zuno-navy)]/10 to-[var(--zuno-green)]/10" />
                    )}
                    {item.isFeatured && (
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full text-white z-10 bg-[var(--zuno-gold)]">
                        Destaque
                      </span>
                    )}
                    <FavoriteButton
                      listingId={item.id}
                      initialFavorited={favorites.includes(item.id)}
                      className="absolute top-2.5 right-2.5 z-10"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="font-semibold text-sm text-[var(--zuno-navy-dark)] truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <p className="text-base font-bold text-[var(--zuno-navy)]">
                        €{Number(item.price).toFixed(2)}
                      </p>
                      {item.user?.isVerified && <VerifiedBadgeMini />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                      <MapPin size={12} />
                      {item.city}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
