"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Infinity as InfinityIcon } from "lucide-react";

export const FooterSection: React.FC = () => {
  const { settings } = useApp();

  const handleExplodeHearts = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f43f5e", "#ec4899", "#fda4af", "#ffffff"],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f43f5e", "#ec4899", "#fda4af", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <footer className="relative z-10 py-14 sm:py-16 px-4 border-t border-rose-500/20 bg-slate-950/95 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Heart Explosion Button */}
        <button
          onClick={handleExplodeHearts}
          className="group relative mb-8 inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-2xl shadow-rose-500/40 hover:shadow-rose-500/70 transition-all duration-300 min-h-[48px] active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          <span>Kalpleri Patlat! 💖✨</span>
          <Heart className="w-5 h-5 text-white fill-white animate-bounce" />
        </button>

        {/* Loving Signature */}
        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white mb-2 tracking-tight">
          Seni Çok Seviyorum ❤️
        </h2>
        <div className="text-xl sm:text-2xl font-serif text-pink-300 font-semibold mb-6">
          — {settings.userName}
        </div>

        {/* Infinity Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-rose-300/70 bg-rose-950/50 border border-rose-500/20 px-4 py-2.5 rounded-full mb-8 min-h-[40px]">
          <InfinityIcon className="w-4 h-4 text-pink-400" />
          <span>Sonsuz Sevgi Ve Mutluluk</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
        </div>

        <p className="text-xs text-rose-200/40 max-w-sm">
          Bu özel site sevgimizin nişanesi olarak {settings.partnerName} için sonsuz sevgiyle tasarlandı.
        </p>
      </div>
    </footer>
  );
};
