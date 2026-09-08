"use client";

import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";

const mockListings = [
  { title: "iPhone 13 Pro 256GB", price: "€520", city: "Lisboa", tag: "Destaque", color: "var(--zuno-orange)" },
  { title: "Apartamento T2 - Alvalade", price: "€1200/mês", city: "Lisboa", tag: "Destaque", color: "var(--zuno-orange)" },
  { title: "Aulas de Inglês Online", price: "€15/hora", city: "Remoto", tag: "Aulas", color: "var(--zuno-navy)" },
  { title: "Bicicleta BTT Trek", price: "€350", city: "Porto", tag: "Desporto", color: "var(--zuno-navy)" },
  { title: "Sofá 3 lugares cinza", price: "€180", city: "Cascais", tag: "Casa", color: "var(--zuno-navy)" },
  { title: "PlayStation 5 + 2 comandos", price: "€430", city: "Sintra", tag: "Destaque", color: "var(--zuno-orange)" },
  { title: "Casaco de inverno North Face", price: "€65", city: "Braga", tag: "Moda", color: "var(--zuno-navy)" },
  { title: "Cadeira de escritório ergonómica", price: "€90", city: "Coimbra", tag: "Casa", color: "var(--zuno-navy)" },
];

export default function ListingsGrid() {
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
          Anúncios em destaque
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-1">
          Selecionados esta semana em todo o país.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {mockListings.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            whileHover={{ y: -6 }}
            className="group bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-90 group-hover:scale-105 transition-transform duration-500"
                style={{
                  background: `linear-gradient(135deg, ${item.color}33, ${item.color}0d)`,
                }}
              />
              <span
                className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full text-white z-10"
                style={{ backgroundColor: item.color }}
              >
                {item.tag}
              </span>
              <button className="absolute top-2.5 right-2.5 z-10 bg-white/90 backdrop-blur p-1.5 rounded-full hover:bg-white transition-colors">
                <Heart size={15} className="text-gray-500" />
              </button>
            </div>

            <div className="p-3.5">
              <p className="font-semibold text-sm text-[var(--zuno-navy-dark)] truncate">
                {item.title}
              </p>
              <p className="text-base font-bold mt-1" style={{ color: "var(--zuno-navy)" }}>
                {item.price}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                <MapPin size={12} />
                {item.city}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
