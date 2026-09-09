"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, BadgeCheck, Clock, Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  type: "featured" | "verified";
}

export default function PricingInfoModal({ open, onClose, type }: Props) {
  const isFeatured = type === "featured";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-3xl w-full p-6 relative ${isFeatured ? "max-w-lg" : "max-w-sm"}`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            {isFeatured ? (
              <>
                <h3 className="font-bold text-lg text-[var(--zuno-navy-dark)] mb-1">
                  Destacar anúncio
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Escolhe o plano que melhor se adapta ao que precisas.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <div className="border border-gray-200 rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--zuno-gold)]/10 flex items-center justify-center mb-3">
                      <Star size={18} className="text-[var(--zuno-gold)]" />
                    </div>
                    <p className="font-bold text-[var(--zuno-navy-dark)] text-sm">Destaque</p>
                    <p className="text-xl font-extrabold text-[var(--zuno-navy)] mt-0.5">€7 <span className="text-xs font-medium text-gray-400">/dia</span></p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Aparece no topo das listagens e categorias, à frente dos anúncios normais.
                    </p>
                  </div>

                  <div className="border-2 border-[var(--zuno-navy)] rounded-2xl p-4 relative">
                    <span className="absolute -top-2.5 right-4 bg-[var(--zuno-navy)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      MAIS VISIBILIDADE
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--zuno-navy)]/10 flex items-center justify-center mb-3">
                      <Sparkles size={18} className="text-[var(--zuno-navy)]" />
                    </div>
                    <p className="font-bold text-[var(--zuno-navy-dark)] text-sm">Destaque Premium</p>
                    <p className="text-xl font-extrabold text-[var(--zuno-navy)] mt-0.5">€9 <span className="text-xs font-medium text-gray-400">/dia</span></p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Tudo do Destaque, e ainda aparece nos cartões em destaque na página inicial (spotlight).
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[var(--zuno-navy)]/10">
                  <BadgeCheck size={26} className="text-[var(--zuno-navy)]" />
                </div>
                <h3 className="font-bold text-lg text-[var(--zuno-navy-dark)] mb-1">
                  Selo de Vendedor Verificado
                </h3>
                <p className="text-2xl font-extrabold text-[var(--zuno-navy)] mb-3">€9,99 / mês</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Um selo azul junto ao teu nome, visível em todos os teus anúncios, que transmite
                  confiança extra aos compradores.
                </p>
              </>
            )}

            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-2.5 rounded-xl">
              <Clock size={14} className="shrink-0" />
              Pagamentos online chegam muito em breve. Por agora, contacta-nos em
              suporte@zuno.pt para ativares isto manualmente.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
