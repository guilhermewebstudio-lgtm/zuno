"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Tag, Lock, MessageCircle, Star, BadgeCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: string;
  city: string;
  condition: string;
  isFeatured: boolean;
  status: string;
  images: { url: string }[];
  category: { namePt: string };
  user: { id: string; name: string; city: string | null; isVerified: boolean };
}

export default function AnuncioPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => setListing(d.listing))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">A carregar...</div>
        <Footer />
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Anúncio não encontrado.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative">
            {listing.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.images[activeImage].url} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">Sem foto</div>
            )}
            {listing.isFeatured && (
              <span className="absolute top-3 left-3 flex items-center gap-1 bg-[var(--zuno-gold)] text-white text-xs font-bold px-3 py-1 rounded-full">
                <Star size={12} /> Destaque
              </span>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {listing.images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === activeImage ? "border-[var(--zuno-navy)]" : "border-transparent"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--zuno-navy)] bg-[var(--zuno-navy)]/10 px-3 py-1 rounded-full">
            <Tag size={12} /> {listing.category.namePt}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)] mt-3">
            {listing.title}
          </h1>
          <p className="text-3xl font-extrabold text-[var(--zuno-navy)] mt-2">
            €{Number(listing.price).toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-400 mt-2">
            <MapPin size={14} /> {listing.city}
            <span className="mx-1">·</span>
            {listing.condition === "NEW" ? "Novo" : "Usado"}
          </div>

          <p className="text-sm text-gray-600 mt-6 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 mb-2">Vendido por</p>
            <p className="font-semibold text-[var(--zuno-navy-dark)] flex items-center gap-1.5">
              {listing.user.name}
              {listing.user.isVerified && (
                <span className="flex items-center gap-1 text-[var(--zuno-navy)] bg-[var(--zuno-navy)]/10 text-xs font-bold px-2 py-0.5 rounded-full">
                  <BadgeCheck size={12} /> Verificado
                </span>
              )}
            </p>
          </div>

          {user ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--zuno-navy)] text-white font-semibold py-3.5 rounded-xl text-sm"
            >
              <MessageCircle size={18} />
              Contactar vendedor
            </motion.button>
          ) : (
            <Link href="/entrar">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--zuno-green)] text-white font-semibold py-3.5 rounded-xl text-sm cursor-pointer"
              >
                <Lock size={16} />
                Entra para contactar o vendedor
              </motion.div>
            </Link>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
