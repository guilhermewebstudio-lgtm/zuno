"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import VerifiedBadgeMini from "@/components/VerifiedBadgeMini";
import { useAuth } from "@/context/AuthContext";

interface FavoriteRow {
  listing: {
    id: string;
    title: string;
    price: string;
    city: string;
    images: { url: string }[];
    category: { namePt: string };
    user: { isVerified?: boolean };
  };
}

export default function FavoritosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/entrar");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((d) => setFavorites(d.favorites || []))
      .finally(() => setDataLoading(false));
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">A carregar...</div>;
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2">
            <Heart size={22} className="text-red-500" fill="currentColor" />
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)]">Os meus favoritos</h1>
          </div>
        </motion.div>

        {dataLoading ? (
          <p className="text-gray-400 text-sm">A carregar...</p>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-400">
            Ainda não guardaste nenhum anúncio.{" "}
            <Link href="/" className="text-[var(--zuno-navy)] font-semibold">
              Explora o Zuno
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {favorites.map(({ listing }, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
              >
                <Link
                  href={`/anuncio/${listing.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {listing.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--zuno-navy)]/10 to-[var(--zuno-green)]/10" />
                    )}
                    <FavoriteButton
                      listingId={listing.id}
                      initialFavorited
                      className="absolute top-2.5 right-2.5 z-10"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="font-semibold text-sm text-[var(--zuno-navy-dark)] truncate">{listing.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <p className="text-base font-bold text-[var(--zuno-navy)]">
                        €{Number(listing.price).toFixed(2)}
                      </p>
                      {listing.user?.isVerified && <VerifiedBadgeMini />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                      <MapPin size={12} />
                      {listing.city}
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
