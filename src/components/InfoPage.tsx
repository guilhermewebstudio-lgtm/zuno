"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function InfoPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-[var(--zuno-navy-dark)] mb-2">{title}</h1>
          {subtitle && <p className="text-gray-500 mb-8">{subtitle}</p>}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-8 space-y-4 text-sm text-gray-600 leading-relaxed">
            {children}
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
