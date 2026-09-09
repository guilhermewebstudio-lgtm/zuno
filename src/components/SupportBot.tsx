"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";

interface ChatMessage {
  role: "bot" | "user";
  text: string;
}

// Base de conhecimento sobre o Zuno: cada entrada tem palavras-chave e uma resposta.
// Correspondência simples por pontuação de palavras-chave (sem API externa).
const KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["conta", "registar", "registo", "criar conta", "inscrever"],
    answer:
      'Para criares conta, clica em "Entrar" no topo do site e depois em "Regista-te". Só precisas de nome, email e password — demora menos de um minuto.',
  },
  {
    keywords: ["vender", "publicar", "anuncio", "anunciar", "colocar a venda"],
    answer:
      'Para vender, clica no botão "Vender" no topo do site. Preenches fotos, título, descrição, categoria, preço e cidade. Precisas de ter conta e sessão iniciada.',
  },
  {
    keywords: ["comprar", "contactar vendedor", "encomendar"],
    answer:
      "Para comprar, abre o anúncio que te interessa e clica em \"Contactar vendedor\" — precisas de ter conta. Depois combinam entre vocês o local e hora de entrega, tal como no OLX.",
  },
  {
    keywords: ["expirar", "expira", "30 dias", "durar", "duração", "validade"],
    answer:
      "Cada anúncio fica ativo durante 30 dias. Depois disso passa a \"Expirado\" e tens de o republicar na tua página de Perfil (não precisas de criar de novo, é só um clique).",
  },
  {
    keywords: ["republicar", "renovar"],
    answer:
      'Vai a "O meu perfil" > "Os meus anúncios". Anúncios expirados têm um botão "Republicar" que os reativa por mais 30 dias.',
  },
  {
    keywords: ["destaque", "destacar", "topo", "visibilidade", "7 euros", "€7", "pago"],
    answer:
      "Podes destacar um anúncio para aparecer no topo dos resultados por €7/dia. É a forma mais rápida de vender mais depressa.",
  },
  {
    keywords: ["pagamento", "pagar", "stripe", "cartão", "mb way", "paypal"],
    answer:
      "O pagamento entre comprador e vendedor é sempre combinado diretamente entre as duas pessoas (dinheiro, MB WAY, etc.) — o Zuno não processa esse pagamento. Só cobramos quando destacas um anúncio.",
  },
  {
    keywords: ["categoria", "categorias", "tipos de produto"],
    answer:
      "Temos 12 categorias: Tecnologia, Imóveis, Compras, Aulas, Moda, Brinquedos, Informática, Veículos, Casa, Desporto, Instrumentos e Serviços. Vês todas na página inicial.",
  },
  {
    keywords: ["serviço", "serviços", "aulas", "explicações", "freelancer"],
    answer:
      'Sim! Podes anunciar serviços (explicações, sites, obras, etc.) nas categorias "Serviços" ou "Aulas", tal como qualquer produto físico.',
  },
  {
    keywords: ["seguro", "segurança", "burla", "confiança", "golpe"],
    answer:
      "Recomendamos sempre encontros em locais públicos, confirmar o artigo antes de pagar, e nunca partilhar dados bancários por mensagem. Vê mais na página \"Segurança\" no fundo do site.",
  },
  {
    keywords: ["favorito", "favoritos", "guardar anuncio", "gostei"],
    answer:
      'Clica no coração em qualquer anúncio para o guardar. Vês todos os teus favoritos em "Favoritos" no menu do topo.',
  },
  {
    keywords: ["contacto", "suporte", "ajuda", "email", "falar com alguem"],
    answer: "Podes contactar-nos em suporte@zuno.pt ou através da página \"Contacto\" no fundo do site.",
  },
  {
    keywords: ["perfil", "editar perfil", "meus dados", "nome", "telemóvel"],
    answer: 'Vai a "O meu perfil" (ícone de utilizador no topo) para editares nome, telemóvel e cidade.',
  },
  {
    keywords: ["admin", "administrador", "gerir"],
    answer:
      "O painel de administração é reservado à equipa do Zuno para gerir utilizadores e anúncios da plataforma.",
  },
  {
    keywords: ["preço", "quanto custa", "grátis", "gratis", "custo"],
    answer:
      "Publicar anúncios é 100% grátis. Só pagas se quiseres destacar um anúncio (€7/dia) para aparecer em primeiro.",
  },
];

const FALLBACK =
  "Não tenho a certeza sobre isso, mas podes contactar-nos em suporte@zuno.pt que a equipa ajuda-te rapidamente!";

function findAnswer(message: string): string {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let bestScore = 0;
  let bestAnswer = FALLBACK;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      const normalizedKw = kw
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(normalizedKw)) score += normalizedKw.split(" ").length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  return bestAnswer;
}

export default function SupportBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Olá! Sou o assistente do Zuno 🤖 Pergunta-me sobre como vender, comprar, destacar anúncios, categorias, ou o que precisares!",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const answer = findAnswer(trimmed);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "bot", text: answer },
    ]);
    setInput("");
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[var(--zuno-navy)] text-white shadow-2xl shadow-black/20 flex items-center justify-center"
        aria-label="Suporte Zuno"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-40 w-[92vw] max-w-sm bg-white rounded-3xl shadow-2xl border border-black/5 flex flex-col overflow-hidden"
            style={{ height: "min(70vh, 520px)" }}
          >
            <div className="bg-[var(--zuno-navy)] text-white px-4 py-3.5 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <p className="text-sm font-bold">Suporte Zuno</p>
                <p className="text-[11px] text-white/60">Normalmente responde em segundos</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] text-sm px-3.5 py-2.5 rounded-2xl ${
                      m.role === "user"
                        ? "bg-[var(--zuno-navy)] text-white rounded-br-sm"
                        : "bg-white text-gray-700 border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-100 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreve a tua pergunta..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[var(--zuno-navy)] text-white flex items-center justify-center shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
