"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Home,
  ShoppingBag,
  GraduationCap,
  Shirt,
  Baby,
  Laptop,
  Car,
  Sofa,
  Dumbbell,
  Guitar,
  Wrench,
} from "lucide-react";

const categories = [
  { name: "Tecnologia", icon: Smartphone, color: "var(--zuno-orange)" },
  { name: "Imóveis", icon: Home, color: "var(--zuno-orange)" },
  { name: "Compras", icon: ShoppingBag, color: "var(--zuno-purple)" },
  { name: "Aulas", icon: GraduationCap, color: "var(--zuno-green)" },
  { name: "Moda", icon: Shirt, color: "var(--zuno-purple)" },
  { name: "Bebés", icon: Baby, color: "var(--zuno-green)" },
  { name: "Informática", icon: Laptop, color: "var(--zuno-navy)" },
  { name: "Veículos", icon: Car, color: "var(--zuno-navy)" },
  { name: "Casa", icon: Sofa, color: "var(--zuno-orange)" },
  { name: "Desporto", icon: Dumbbell, color: "var(--zuno-green)" },
  { name: "Instrumentos", icon: Guitar, color: "var(--zuno-purple)" },
  { name: "Serviços", icon: Wrench, color: "var(--zuno-navy)" },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-end justify-between"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--zuno-navy-dark)]">
            Explora por categoria
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Tudo o que precisas, organizado para encontrares rápido.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="group flex flex-col items-center gap-2.5 bg-white rounded-2xl p-4 md:p-5 border border-black/5 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${cat.color}1a` }}
            >
              <cat.icon size={24} style={{ color: cat.color }} strokeWidth={2} />
            </div>
            <span className="text-xs md:text-sm font-medium text-[var(--zuno-navy-dark)] text-center">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
