"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Heart, MessageCircle, Plus, User, LogOut, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

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
        <div className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo/zuno-logo.png"
            alt="Zuno"
            width={140}
            height={70}
            className="h-9 w-auto object-contain"
            priority
          />
        </div>

        <div className="hidden md:flex flex-1 max-w-xl items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 focus-within:ring-2 ring-[var(--zuno-navy)] transition-all">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Procura em Zuno: telemóveis, sofás, aulas de guitarra..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-3 ml-auto">
          <button className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 transition-colors text-[var(--zuno-navy-dark)]">
            <Heart size={20} />
          </button>
          <button className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 transition-colors text-[var(--zuno-navy-dark)]">
            <MessageCircle size={20} />
          </button>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 transition-colors text-[var(--zuno-orange)]"
              title="Painel de administração"
            >
              <ShieldCheck size={20} />
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 transition-colors text-[var(--zuno-navy-dark)]"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link
              href="/entrar"
              className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 transition-colors text-[var(--zuno-navy-dark)]"
              title="Entrar"
            >
              <User size={20} />
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 bg-[var(--zuno-navy)] text-white px-4 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-blue-900/10"
          >
            <Plus size={17} strokeWidth={2.5} />
            <span className="hidden sm:inline">Vender</span>
          </motion.button>
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
    </motion.header>
  );
}
