"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import InfoPage from "@/components/InfoPage";
import { motion } from "framer-motion";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <InfoPage title="Contacto" subtitle="Tens dúvidas ou sugestões? Fala connosco.">
      <div className="flex items-center gap-2 text-[var(--zuno-navy)] font-semibold mb-4">
        <Mail size={16} />
        suporte@zuno.pt
      </div>

      {sent ? (
        <p className="text-green-600 font-medium">
          Obrigado! A tua mensagem foi enviada, vamos responder em breve.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          <input
            required
            placeholder="O teu nome"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
          />
          <input
            required
            type="email"
            placeholder="O teu email"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
          />
          <textarea
            required
            rows={4}
            placeholder="A tua mensagem"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)] resize-none"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center gap-2 bg-[var(--zuno-navy)] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
          >
            <Send size={14} />
            Enviar mensagem
          </motion.button>
        </form>
      )}
    </InfoPage>
  );
}
