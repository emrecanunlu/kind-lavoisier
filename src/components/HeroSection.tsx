"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { motion, Variants } from "framer-motion";
import { Heart, Sparkles, Settings, ChevronDown, Calendar } from "lucide-react";

interface HeroSectionProps {
  onOpenSettings: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSettings }) => {
  const { settings } = useApp();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] h-[320px] sm:h-[550px] bg-gradient-to-tr from-rose-600/25 via-pink-600/30 to-purple-600/20 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Top Bar Settings */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="flex items-center gap-2 bg-slate-900/80 border border-rose-500/30 hover:border-rose-400 text-rose-200 text-xs px-3.5 py-2 sm:px-4 sm:py-2 rounded-full backdrop-blur-md shadow-lg transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
          <span className="font-medium">Siteyi Düzenle</span>
        </motion.button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Couple Tag Pill */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 bg-rose-950/70 border border-rose-500/40 px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-rose-200 backdrop-blur-md shadow-xl mb-6 sm:mb-8">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span className="font-semibold">{settings.userName} & {settings.partnerName}</span>
            <span className="bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[11px] text-pink-300 font-bold ml-1">
              Sonsuz Aşkımız ❤️
            </span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
        >
          Bizim Dünyamız,{" "}
          <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
            Sonsuz Sevgimiz
          </span>
        </motion.h1>

        {/* Couple Names Badge */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 sm:gap-4 my-2 mb-6 text-lg sm:text-3xl font-serif text-rose-100"
        >
          <span className="font-semibold text-rose-200 tracking-wide">
            {settings.userName}
          </span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/40 shrink-0"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
          </motion.div>
          <span className="font-semibold text-rose-200 tracking-wide">
            {settings.partnerName}
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-sm sm:text-lg text-rose-200/80 font-light leading-relaxed mb-8 sm:mb-10 px-2"
        >
          "Yanında olduğum her saniye dünyadaki en şanslı insan gibi hissediyorum. Birlikte hayal kurduğumuz ve paylaştığımız her an hayatımın en büyük hediyesi."
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto px-4"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#countdown"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-semibold text-sm px-7 py-3.5 rounded-full shadow-xl shadow-rose-500/30 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Özel Gün Sayacımız</span>
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#mektup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900/80 border border-rose-400/30 hover:border-rose-400 text-rose-100 font-semibold text-sm px-7 py-3.5 rounded-full backdrop-blur-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Sana Mektubum</span>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-rose-300/60 text-[11px]"
      >
        <span>Aşağı Kaydır</span>
        <ChevronDown className="w-4 h-4 text-pink-400" />
      </motion.div>
    </section>
  );
};
