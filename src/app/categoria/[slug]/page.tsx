"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";

interface Listing {
  id: string;
  title: string;
  price: string;
  city: string;
  isFeatured: boolean;
  images: { url: string }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  tecnologia: "Tecnologia",
  imoveis: "Imóveis",
  compras: "Compras",
  aulas: "Aulas",
  moda: "Moda",
  brinquedos: "Brinquedos",
  informatica: "Informática",
  veiculos: "Veículos",
  casa: "Casa",
  desporto: "Desporto",
  instrumentos: "Instrumentos",
  servicos: "Serviços",
};

export default function CategoriaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/listings?category=${slug}`)
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    fetch("/api/favorites/ids")
      .then((r) => r.json())
      .then((d) => setFavorites(d.ids || []));
  }, []);

  const label = CATEGORY_LABELS[slug] || slug;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--zuno-navy)] mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Voltar à página inicial
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)] mb-1"
        >
          {label}
        </motion.h1>
        <p className="text-gray-500 text-sm mb-8">
          {loading ? "A carregar..." : `${listings.length} anúncio${listings.length === 1 ? "" : "s"} encontrado${listings.length === 1 ? "" : "s"}`}
        </p>

        {!loading && listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-400">
            Ainda não há anúncios nesta categoria.{" "}
            <Link href="/vender" className="text-[var(--zuno-navy)] font-semibold">
              Sê o primeiro a vender
            </Link>
            !
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {listings.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                whileHover={{ y: -6 }}
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
                      <div className="w-full h-full bg-gradient-to-br from-[var(--zuno-navy)]/10 to-[var(--zuno-gold)]/10" />
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
                    <p className="text-base font-bold mt-1 text-[var(--zuno-navy)]">
                      €{Number(item.price).toFixed(2)}
                    </p>
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
