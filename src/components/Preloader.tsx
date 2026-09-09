"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("zuno_intro_seen");
    if (alreadySeen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("zuno_intro_seen", "1");
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--zuno-navy-dark)] overflow-hidden"
        >
          <motion.div
            className="zuno-blob w-[28rem] h-[28rem] bg-[var(--zuno-green)]"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 0.28 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <motion.div
            className="zuno-blob w-80 h-80 bg-white"
            initial={{ scale: 0.3, opacity: 0, x: 120, y: -80 }}
            animate={{ scale: 1, opacity: 0.08, x: 160, y: -100 }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 0.1 }}
          />

          {/* anel a expandir */}
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.35 }}
            className="absolute w-40 h-40 rounded-full border-2 border-[var(--zuno-green)]"
          />

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.06, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative flex flex-col items-center"
          >
            <motion.div
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="bg-white rounded-3xl px-8 py-6 shadow-2xl"
            >
              <Image
                src="/logo/zuno-logo.png"
                alt="Zuno"
                width={260}
                height={130}
                className="h-14 md:h-16 w-auto object-contain"
                priority
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-white/60 text-xs font-medium tracking-widest uppercase mt-5"
            >
              Mercado online · Compra · Venda
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="h-[2px] w-20 mt-3 bg-gradient-to-r from-transparent via-[var(--zuno-green)] to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
