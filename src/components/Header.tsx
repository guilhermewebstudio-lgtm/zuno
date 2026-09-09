"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, Plus, User, LogOut, ShieldCheck, Smartphone, Home, Shirt, Car } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const QUICK_CATEGORIES = [
  { name: "Tecnologia", slug: "tecnologia", icon: Smartphone },
  { name: "Imóveis", slug: "imoveis", icon: Home },
  { name: "Moda", slug: "moda", icon: Shirt },
  { name: "Veículos", slug: "veiculos", icon: Car },
];

function IconLink({
  href,
  icon: Icon,
  title,
  active = false,
}: {
  href: string;
  icon: typeof Heart;
  title: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      title={title}
      className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-colors shrink-0 ${
        active
          ? "bg-[var(--zuno-navy)]/10 text-[var(--zuno-navy)]"
          : "text-gray-500 hover:bg-gray-100 hover:text-[var(--zuno-navy-dark)]"
      }`}
    >
      <Icon size={18} />
    </Link>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) router.push(`/pesquisa?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo/zuno-logo.png"
            alt="Zuno"
            width={140}
            height={70}
            className="h-7 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 focus-within:ring-2 ring-[var(--zuno-navy)] transition-all"
        >
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procura em Zuno: telemóveis, sofás, aulas de guitarra..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </form>

        <div className="flex items-center gap-0.5 sm:gap-1.5 ml-auto">
          <IconLink href="/favoritos" icon={Heart} title="Favoritos" />

          {user?.isAdmin && (
            <Link
              href="/admin"
              title="Painel de administração"
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-[var(--zuno-green)] hover:bg-[var(--zuno-green)]/10 transition-colors shrink-0"
            >
              <ShieldCheck size={18} />
            </Link>
          )}

          {user ? (
            <>
              <IconLink href="/perfil" icon={User} title="O meu perfil" />
              <button
                onClick={logout}
                title="Sair"
                className="hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors shrink-0"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <IconLink href="/entrar" icon={User} title="Entrar" />
          )}

          <Link href="/vender">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 bg-[var(--zuno-navy)] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-md shadow-blue-900/10 cursor-pointer ml-0.5 sm:ml-1 whitespace-nowrap"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Vender</span>
            </motion.span>
          </Link>
        </div>
      </div>

      <div className="md:hidden px-3 sm:px-4 pb-2.5 sm:pb-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procura em Zuno..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </form>
      </div>

      <div className="hidden md:block border-t border-black/5 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[var(--zuno-navy)] px-3 py-2.5 whitespace-nowrap transition-colors"
            >
              <cat.icon size={14} />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
