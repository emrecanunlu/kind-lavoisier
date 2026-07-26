"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Sparkles, X } from "lucide-react";

export const SealedLetter: React.FC = () => {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBreaking, setIsBreaking] = useState<boolean>(false);

  const handleOpenLetter = () => {
    if (isOpen || isBreaking) return;
    setIsBreaking(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsBreaking(false);
    }, 700);
  };

  return (
    <section id="mektup" className="py-16 sm:py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold tracking-widest uppercase mb-2">
          <Mail className="w-4 h-4" /> Sana Mektubum
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
          Mühürlü Zarf
        </h2>
        <p className="text-rose-200/70 text-xs sm:text-sm max-w-md mx-auto mb-10 sm:mb-12">
          Kalbimden kopan, sadece senin gözlerinin okuması için yazılmış özel mektup...
        </p>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenLetter}
                className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-amber-100 via-amber-100 to-amber-200 text-slate-800 rounded-2xl shadow-2xl border-4 border-amber-300/70 p-6 sm:p-8 cursor-pointer overflow-hidden group"
              >
                {/* Wax Seal Triangle Top */}
                <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 bg-amber-200/80 rounded-t-xl border-b-2 border-amber-300/60 pointer-events-none"></div>

                <div className="relative z-10 py-8 sm:py-12 flex flex-col items-center">
                  <div className="text-xs font-serif text-amber-900/60 tracking-widest uppercase mb-1">
                    Özel Mektubum ❤️
                  </div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-amber-950 mb-1">
                    Sayın {settings.partnerName}
                  </div>
                  <div className="text-xs text-amber-900/70 italic mb-6">
                    Sadece Sana Özel (Sevgiyle Hazırlandı)
                  </div>

                  {/* Wax Seal Button */}
                  <div className="relative">
                    <motion.div
                      animate={
                        isBreaking
                          ? { scale: [1, 1.3, 0], rotate: [0, 15, -15, 45] }
                          : { scale: [1, 1.06, 1] }
                      }
                      transition={
                        isBreaking
                          ? { duration: 0.6 }
                          : { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
                      }
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-800 via-red-600 to-rose-700 flex items-center justify-center shadow-xl border-4 border-rose-900/80"
                    >
                      <Heart className="w-7 h-7 sm:w-9 sm:h-9 text-rose-100 fill-rose-100" />
                    </motion.div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-amber-950 bg-amber-200/90 px-3 py-1.5 rounded-full shadow-md border border-amber-400">
                      Mühüre Tıkla & Oku ✉️
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Opened Letter Display */
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="relative w-full max-w-2xl mx-auto bg-amber-50 text-slate-900 rounded-3xl p-6 sm:p-12 shadow-2xl border-2 border-amber-200 text-left font-serif"
            >
              {/* Watermark Heart */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Heart className="w-64 h-64 sm:w-80 sm:h-80 text-rose-500 fill-rose-500" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Zarfı Kapat"
                className="absolute top-3 right-3 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-700 p-2.5 rounded-full hover:bg-amber-200/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-sans font-bold tracking-widest uppercase mb-4">
                  <Sparkles className="w-4 h-4" /> Kalbimden Sana
                </div>

                <h3 className="text-xl sm:text-3xl font-bold text-slate-900 mb-6 font-serif border-b border-amber-200 pb-3">
                  {settings.letterTitle}
                </h3>

                <div className="text-sm sm:text-lg text-slate-800 leading-relaxed space-y-4 whitespace-pre-line font-sans font-normal mb-8">
                  {settings.letterContent}
                </div>

                <div className="pt-6 border-t border-amber-200 flex flex-col items-end">
                  <div className="text-xs text-slate-500 font-sans mb-1">Her Zaman Seninle,</div>
                  <div className="text-lg sm:text-xl font-bold text-rose-700 font-serif">
                    {settings.letterSender}
                  </div>
                  <div className="text-xs text-rose-500/80 font-sans mt-1">❤️ {settings.userName}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
