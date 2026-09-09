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

// Cores vivas e variadas (inspirado no estilo de categorias do OLX),
// mantendo os tons da marca Zuno como base.
const categories = [
  { name: "Tecnologia", slug: "tecnologia", icon: Smartphone, color: "#123a8c" },
  { name: "Imóveis", slug: "imoveis", icon: Home, color: "#d9a13d" },
  { name: "Compras", slug: "compras", icon: ShoppingBag, color: "#6d54b8" },
  { name: "Aulas", slug: "aulas", icon: GraduationCap, color: "#14926b" },
  { name: "Moda", slug: "moda", icon: Shirt, color: "#e05a7a" },
  { name: "Brinquedos", slug: "brinquedos", icon: Blocks, color: "#2fa4c9" },
  { name: "Informática", slug: "informatica", icon: Laptop, color: "#0f2951" },
  { name: "Veículos", slug: "veiculos", icon: Car, color: "#e2822f" },
  { name: "Casa", slug: "casa", icon: Sofa, color: "#7a8c3a" },
  { name: "Desporto", slug: "desporto", icon: Dumbbell, color: "#14926b" },
  { name: "Instrumentos", slug: "instrumentos", icon: Guitar, color: "#6d54b8" },
  { name: "Serviços", slug: "servicos", icon: Wrench, color: "#c9762f" },
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
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--zuno-green)]">
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

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
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
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center gap-2.5 cursor-pointer"
              >
                <div
                  className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-[1.08]"
                  style={{ backgroundColor: cat.color }}
                >
                  <cat.icon size={28} className="text-white" strokeWidth={1.8} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-[var(--zuno-navy-dark)] text-center leading-tight">
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
