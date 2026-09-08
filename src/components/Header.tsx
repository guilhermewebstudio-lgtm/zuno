"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Heart, MessageCircle, Plus, User, LogOut, ShieldCheck, Smartphone, Home, Shirt, Car } from "lucide-react";
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
      className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
        active
          ? "bg-[var(--zuno-navy)]/10 text-[var(--zuno-navy)]"
          : "text-gray-500 hover:bg-gray-100 hover:text-[var(--zuno-navy-dark)]"
      }`}
    >
      <Icon size={19} />
    </Link>
  );
}

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo/zuno-logo.png"
            alt="Zuno"
            width={140}
            height={70}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 focus-within:ring-2 ring-[var(--zuno-navy)] transition-all">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Procura em Zuno: telemóveis, sofás, aulas de guitarra..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-1.5 ml-auto bg-gray-50 md:bg-transparent rounded-full p-1 md:p-0">
          <IconLink href="/favoritos" icon={Heart} title="Favoritos" />
          <IconLink href="/perfil" icon={MessageCircle} title="Mensagens" />

          {user?.isAdmin && (
            <Link
              href="/admin"
              title="Painel de administração"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-[var(--zuno-green)] hover:bg-[var(--zuno-green)]/10 transition-colors"
            >
              <ShieldCheck size={19} />
            </Link>
          )}

          {user ? (
            <>
              <IconLink href="/perfil" icon={User} title="O meu perfil" />
              <button
                onClick={logout}
                title="Sair"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors"
              >
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <IconLink href="/entrar" icon={User} title="Entrar" />
          )}

          <Link href="/vender">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 bg-[var(--zuno-navy)] text-white px-4 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-blue-900/10 cursor-pointer ml-1"
            >
              <Plus size={17} strokeWidth={2.5} />
              <span className="hidden sm:inline">Vender</span>
            </motion.span>
          </Link>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Procura em Zuno..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>
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
