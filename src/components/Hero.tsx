"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--zuno-navy)]">
      <div
        className="zuno-blob zuno-float w-96 h-96 bg-[var(--zuno-orange)] -top-16 left-[8%]"
        aria-hidden
      />
      <div
        className="zuno-blob zuno-float-slow w-80 h-80 bg-white top-10 right-[8%]"
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block text-xs md:text-sm font-semibold tracking-wide uppercase text-white/70 mb-4 bg-white/10 px-4 py-1.5 rounded-full"
        >
          Mercado online · Compra · Venda
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
        >
          Compra e vende{" "}
          <span className="zuno-gradient-text">tudo perto de ti</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-white/70 text-base md:text-lg max-w-2xl mx-auto"
        >
          Eletrónica, casa, aulas, moda, brinquedos e muito mais — tudo num só
          sítio, feito para Portugal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 max-w-2xl mx-auto flex items-center gap-2 bg-white rounded-full p-2 pl-5 shadow-2xl shadow-black/20"
        >
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="O que procuras hoje?"
            className="flex-1 outline-none text-sm md:text-base py-2 placeholder:text-gray-400"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[var(--zuno-orange)] text-white font-semibold px-6 py-3 rounded-full text-sm md:text-base whitespace-nowrap"
          >
            Pesquisar
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-white/60"
        >
          <span>Populares:</span>
          {["iPhone", "Apartamento T2", "Bicicleta", "Aulas de inglês", "PlayStation 5"].map(
            (tag) => (
              <span
                key={tag}
                className="bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-full cursor-pointer"
              >
                {tag}
              </span>
            )
          )}
        </motion.div>
      </div>

      <svg
        viewBox="0 0 1440 60"
        className="relative block w-full text-[var(--background)]"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,32L80,26.7C160,21,320,11,480,16C640,21,800,43,960,48C1120,53,1280,43,1360,37.3L1440,32L1440,60L0,60Z"
        />
      </svg>
    </section>
  );
}
