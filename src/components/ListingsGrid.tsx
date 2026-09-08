"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: string;
  city: string;
  isFeatured: boolean;
  images: { url: string }[];
  category: { namePt: string };
}

export default function ListingsGrid() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)]">
          Anúncios recentes
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-1">
          Os anúncios mais recentes em todo o país.
        </p>
      </motion.div>

      {loading ? (
        <p className="text-gray-400 text-sm">A carregar anúncios...</p>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/5 p-10 text-center text-gray-400">
          Ainda não há anúncios publicados. Sê o primeiro a{" "}
          <Link href="/vender" className="text-[var(--zuno-navy)] font-semibold">
            vender algo
          </Link>
          !
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {listings.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/anuncio/${item.id}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.images[0].url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--zuno-navy)]/10 to-[var(--zuno-orange)]/10" />
                  )}
                  {item.isFeatured && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full text-white z-10 bg-[var(--zuno-orange)]">
                      Destaque
                    </span>
                  )}
                  <button className="absolute top-2.5 right-2.5 z-10 bg-white/90 backdrop-blur p-1.5 rounded-full hover:bg-white transition-colors">
                    <Heart size={15} className="text-gray-500" />
                  </button>
                </div>

                <div className="p-3.5">
                  <p className="font-semibold text-sm text-[var(--zuno-navy-dark)] truncate">
                    {item.title}
                  </p>
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
    </section>
  );
}
