"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function RegistarPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao criar conta.");
        return;
      }
      await refresh();
      router.push("/");
    } catch {
      setError("Erro de rede. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--zuno-navy)] px-4 py-12 relative overflow-hidden">
      <div className="zuno-blob zuno-float w-96 h-96 bg-[var(--zuno-green)] -top-20 left-[5%]" aria-hidden />
      <div className="zuno-blob zuno-float-slow w-80 h-80 bg-white top-20 right-[5%]" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="flex justify-center mb-6">
          <Image src="/logo/zuno-logo.png" alt="Zuno" width={140} height={70} className="h-10 w-auto object-contain" />
        </div>

        <h1 className="text-xl font-bold text-[var(--zuno-navy-dark)] text-center mb-1">
          Cria a tua conta
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Regista-te para comprar e vender no Zuno.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
              placeholder="O teu nome"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
              placeholder="teu@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-[var(--zuno-navy)]"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="w-full bg-[var(--zuno-navy)] text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-60"
          >
            {loading ? "A criar conta..." : "Criar conta"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tens conta?{" "}
          <Link href="/entrar" className="text-[var(--zuno-navy)] font-semibold">
            Entra aqui
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
