"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck, Zap, TrendingUp } from "lucide-react";

const previewCards = [
  { title: "iPhone 13 Pro", price: "€520", tag: "Tecnologia" },
  { title: "Apartamento T2", price: "€1.200/mês", tag: "Imóveis" },
  { title: "Aulas de Inglês", price: "€15/hora", tag: "Aulas" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--zuno-navy)]">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />

      <div
        className="zuno-blob zuno-float w-96 h-96 bg-[var(--zuno-green)] -top-24 left-[2%]"
        aria-hidden
      />
      <div
        className="zuno-blob zuno-float-slow w-80 h-80 bg-white top-16 right-[2%]"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-semibold tracking-wide uppercase text-white/70 mb-5 bg-white/10 px-4 py-1.5 rounded-full"
          >
            Mercado online · Compra · Venda
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-[1.08] tracking-tight"
          >
            Compra e vende{" "}
            <span className="zuno-gradient-text">tudo perto de ti.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-white/65 text-base md:text-lg max-w-xl mx-auto lg:mx-0"
          >
            Eletrónica, casa, aulas, moda, brinquedos e muito mais — tudo num
            só sítio, feito para Portugal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-xl mx-auto lg:mx-0 flex items-center gap-2 bg-white rounded-full p-2 pl-5 shadow-2xl shadow-black/30"
          >
            <Search size={20} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="O que procuras hoje?"
              className="flex-1 outline-none text-sm md:text-base py-2 placeholder:text-gray-400 min-w-0"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[var(--zuno-green)] text-white font-semibold px-5 md:px-6 py-3 rounded-full text-sm md:text-base whitespace-nowrap"
            >
              Pesquisar
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs md:text-sm text-white/55"
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-white/70 text-sm"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--zuno-green)]" />
              Compra segura
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[var(--zuno-green)]" />
              Anúncios em segundos
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[var(--zuno-green)]" />
              A crescer em Portugal
            </div>
          </motion.div>
        </div>

        <div className="relative hidden lg:block h-[420px]">
          {previewCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
                rotate: i === 0 ? -6 : i === 1 ? 3 : -2,
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.4 + i * 0.15 },
                y: {
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.6,
                },
              }}
              className="absolute bg-white rounded-2xl shadow-2xl p-4 w-56"
              style={{
                top: `${i * 130}px`,
                left: i === 1 ? "38%" : i === 2 ? "10%" : "0%",
                zIndex: 3 - i,
              }}
            >
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[var(--zuno-navy)]/10 to-[var(--zuno-green)]/15 mb-3" />
              <p className="text-xs font-bold text-[var(--zuno-navy-dark)]">{card.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-extrabold text-[var(--zuno-navy)]">{card.price}</span>
                <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {card.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
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
