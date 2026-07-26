"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, ShieldCheck, Heart } from "lucide-react";

export const PasscodeLock: React.FC = () => {
  const { settings, isUnlocked, setIsUnlocked } = useApp();
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  if (!settings.isPasscodeEnabled || isUnlocked) {
    return null;
  }

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);
      
      if (nextPin.length === settings.passcode.length) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (inputPin: string) => {
    if (inputPin === settings.passcode) {
      setIsUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin("");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4 overflow-y-auto py-6"
      >
        {/* Glow Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-rose-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={shake ? { x: [-12, 12, -12, 12, 0] } : { scale: 1, y: 0 }}
          transition={shake ? { duration: 0.4, ease: "easeInOut" } : { type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-900/95 via-slate-900 to-rose-950/80 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center text-white my-auto z-10"
        >
          {/* Lock Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 p-0.5 shadow-lg shadow-rose-500/40 mb-4 sm:mb-6"
          >
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 animate-pulse" />
            </div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight bg-gradient-to-r from-rose-200 via-pink-200 to-rose-300 bg-clip-text text-transparent mb-2">
            Özel Dünyamız 🔒
          </h2>
          <p className="text-rose-200/70 text-xs sm:text-sm mb-6 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-rose-400" />
            İçeriği görmek için gizli şifreyi giriniz ❤️
          </p>

          {/* PIN Indicators */}
          <div className="flex justify-center gap-3 mb-6 sm:mb-8">
            {Array.from({ length: Math.max(4, settings.passcode.length) }).map((_, idx) => (
              <motion.div
                key={idx}
                animate={idx < pin.length ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 ${
                  idx < pin.length
                    ? "bg-rose-500 border-rose-400 scale-110 shadow-lg shadow-rose-500/50"
                    : "bg-rose-950/60 border-rose-800"
                }`}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] sm:text-xs text-rose-400 bg-rose-900/50 py-1.5 px-3 rounded-full mb-6 inline-block border border-rose-500/40 font-semibold"
            >
              Hatalı şifre! Lütfen tekrar deneyiniz.
            </motion.p>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6 max-w-xs mx-auto">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleKeyPress(num)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 hover:bg-rose-500/20 active:bg-rose-500/40 border border-white/10 text-xl font-medium transition-colors flex items-center justify-center mx-auto shadow-md"
              >
                {num}
              </motion.button>
            ))}
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto text-rose-400/40">
              <Heart className="w-5 h-5 fill-rose-500/20 text-transparent" />
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleKeyPress("0")}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 hover:bg-rose-500/20 active:bg-rose-500/40 border border-white/10 text-xl font-medium transition-colors flex items-center justify-center mx-auto shadow-md"
            >
              0
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 hover:bg-red-500/20 text-xs font-semibold text-rose-300 border border-white/10 flex items-center justify-center mx-auto transition-colors"
            >
              Sil
            </motion.button>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-rose-300/60 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> Tam Güvenlikli Erişim Koruması
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
