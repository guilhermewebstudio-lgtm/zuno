"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Home,
  ShoppingBag,
  GraduationCap,
  Shirt,
  Blocks,
  Laptop,
  Car,
  Sofa,
  Dumbbell,
  Guitar,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Tecnologia", slug: "tecnologia", icon: Smartphone, color: "var(--zuno-navy)" },
  { name: "Imóveis", slug: "imoveis", icon: Home, color: "var(--zuno-gold)" },
  { name: "Compras", slug: "compras", icon: ShoppingBag, color: "var(--zuno-purple)" },
  { name: "Aulas", slug: "aulas", icon: GraduationCap, color: "var(--zuno-green)" },
  { name: "Moda", slug: "moda", icon: Shirt, color: "var(--zuno-purple)" },
  { name: "Brinquedos", slug: "brinquedos", icon: Blocks, color: "var(--zuno-green)" },
  { name: "Informática", slug: "informatica", icon: Laptop, color: "var(--zuno-navy)" },
  { name: "Veículos", slug: "veiculos", icon: Car, color: "var(--zuno-gold)" },
  { name: "Casa", slug: "casa", icon: Sofa, color: "var(--zuno-navy)" },
  { name: "Desporto", slug: "desporto", icon: Dumbbell, color: "var(--zuno-green)" },
  { name: "Instrumentos", slug: "instrumentos", icon: Guitar, color: "var(--zuno-purple)" },
  { name: "Serviços", slug: "servicos", icon: Wrench, color: "var(--zuno-gold)" },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--zuno-orange)]">
            Categorias
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)] mt-1">
            Explora por categoria
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-1.5">
            Tudo o que precisas, organizado para encontrares rápido.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <Link href={`/categoria/${cat.slug}`}>
              <motion.div
                whileHover={{ y: -5 }}
                className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-4 md:p-5 border border-black/[0.04] shadow-[0_1px_3px_rgba(18,32,63,0.06)] hover:shadow-[0_12px_24px_rgba(18,32,63,0.1)] transition-shadow cursor-pointer"
              >
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ backgroundColor: `${cat.color}14` }}
                >
                  <cat.icon size={23} style={{ color: cat.color }} strokeWidth={2} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-[var(--zuno-navy-dark)] text-center">
                  {cat.name}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
