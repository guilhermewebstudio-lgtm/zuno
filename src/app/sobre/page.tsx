"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck, Sparkles, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  {
    icon: ShieldCheck,
    title: "Confiança em primeiro lugar",
    text: "Contas verificadas e denúncias levadas a sério, para compras e vendas mais seguras.",
    color: "var(--zuno-navy)",
  },
  {
    icon: Sparkles,
    title: "Simples e bonito",
    text: "Um site rápido e agradável de usar — sem anúncios intrusivos nem confusão.",
    color: "var(--zuno-green)",
  },
  {
    icon: Users,
    title: "Feito para a comunidade",
    text: "Cada anúncio ajuda alguém perto de ti a poupar ou a ganhar um dinheiro extra.",
    color: "var(--zuno-gold)",
  },
];

const stats = [
  { value: "100%", label: "Grátis para vender" },
  { value: "30 dias", label: "De duração por anúncio" },
  { value: "12", label: "Categorias disponíveis" },
];

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[var(--zuno-navy)] px-4 py-20 md:py-28 text-center">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
            aria-hidden
          />
          <div className="zuno-blob zuno-float w-96 h-96 bg-[var(--zuno-green)] -top-20 left-[10%]" aria-hidden />
          <div className="zuno-blob zuno-float-slow w-80 h-80 bg-white top-10 right-[10%]" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-white/70 bg-white/10 px-4 py-1.5 rounded-full">
              <Heart size={12} /> A nossa história
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-5 leading-tight">
              Feito para tornar a compra e venda{" "}
              <span className="zuno-gradient-text">mais humana</span>
            </h1>
            <p className="text-white/65 mt-5 text-base md:text-lg">
              O Zuno nasceu com um objetivo simples: tornar mais fácil comprar e
              vender entre pessoas em Portugal, num site rápido, bonito e de
              confiança.
            </p>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="max-w-5xl mx-auto px-4 -mt-10 md:-mt-12 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl border border-black/5 grid grid-cols-3 divide-x divide-gray-100">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-6 px-2"
              >
                <p className="text-2xl md:text-3xl font-extrabold text-[var(--zuno-navy)]">{s.value}</p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Missão */}
        <section className="max-w-3xl mx-auto px-4 py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-base md:text-lg leading-relaxed"
          >
            Acreditamos que comprar em segunda mão, contratar um serviço local
            ou vender algo que já não precisas deveria ser simples — sem
            burocracia, sem interfaces confusas e sem burlas. Estamos a
            começar, e cada anúncio publicado, cada mensagem trocada entre
            comprador e vendedor, ajuda-nos a construir um marketplace cada
            vez melhor para todos.
          </motion.p>
        </section>

        {/* Valores */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-black/5 shadow-sm p-6"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${v.color}14` }}
                >
                  <v.icon size={22} style={{ color: v.color }} />
                </div>
                <h3 className="font-bold text-[var(--zuno-navy-dark)] mb-1.5">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
