"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, BadgeCheck, Clock } from "lucide-react";

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
            className="bg-white rounded-3xl max-w-sm w-full p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: isFeatured ? "#d9a13d1a" : "#123a8c1a" }}
            >
              {isFeatured ? (
                <Star size={26} className="text-[var(--zuno-gold)]" />
              ) : (
                <BadgeCheck size={26} className="text-[var(--zuno-navy)]" />
              )}
            </div>

            <h3 className="font-bold text-lg text-[var(--zuno-navy-dark)] mb-1">
              {isFeatured ? "Destacar anúncio" : "Selo de Vendedor Verificado"}
            </h3>
            <p className="text-2xl font-extrabold text-[var(--zuno-navy)] mb-3">
              {isFeatured ? "€7 / dia" : "€9,99 / mês"}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {isFeatured
                ? "O teu anúncio aparece no topo dos resultados e da homepage, com destaque visual, durante o número de dias que escolheres."
                : "Um selo azul junto ao teu nome, visível em todos os teus anúncios, que transmite confiança extra aos compradores."}
            </p>

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
