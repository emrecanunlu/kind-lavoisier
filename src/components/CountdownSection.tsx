"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Clock, Heart, Sparkles } from "lucide-react";

export const CountdownSection: React.FC = () => {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState<"reunion" | "anniversary" | "birthday">("reunion");

  const getTargetDate = () => {
    switch (activeTab) {
      case "reunion":
        return new Date(settings.reunionDate);
      case "anniversary":
        return new Date(settings.anniversaryDate);
      case "birthday":
        return new Date(settings.birthdayDate);
    }
  };

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const target = getTargetDate();
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeTab, settings]);

  const tabLabels = {
    reunion: { title: "Bir Sonraki Özel Buluşmamız", subtitle: "Sabırsızlıkla beklediğimiz o muhteşem an" },
    anniversary: { title: "Yıldönümümüz", subtitle: "Aşkımızın başladığı o büyüleyici gün" },
    birthday: { title: "Doğum Günü", subtitle: "İyi ki doğdun iyi ki benimsin" },
  };

  return (
    <section id="countdown" className="py-16 sm:py-20 px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-slate-900/70 border border-rose-500/30 rounded-3xl p-5 sm:p-10 backdrop-blur-xl shadow-2xl"
      >
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold tracking-widest uppercase mb-2">
            <Clock className="w-4 h-4" /> Özel Gün Sayacımız
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
            {tabLabels[activeTab].title}
          </h2>
          <p className="text-rose-200/70 text-xs sm:text-sm">{tabLabels[activeTab].subtitle}</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-1 sm:gap-2 mb-8 bg-slate-950/70 p-1.5 rounded-full border border-rose-500/20 max-w-sm sm:max-w-md mx-auto">
          {(["reunion", "anniversary", "birthday"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex-1 py-2 px-2 sm:px-4 rounded-full text-[11px] sm:text-xs font-semibold transition-colors z-10 text-rose-200"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/30 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab === "reunion" && "Buluşmamız"}
              {tab === "anniversary" && "Yıldönümü"}
              {tab === "birthday" && "Doğum Günü"}
            </button>
          ))}
        </div>

        {/* Counter Display */}
        {timeLeft.isPast ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center py-8 sm:py-10 bg-rose-950/40 rounded-2xl border border-rose-500/30 mb-8"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
              Büyük Gün Geldi! ❤️
            </h3>
            <p className="text-rose-200/80 text-xs sm:text-sm">
              Bu anın tadını çıkaralım, kalplerimiz her zaman bir!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {[
              { label: "GÜN", value: timeLeft.days },
              { label: "SAAT", value: timeLeft.hours },
              { label: "DAKİKA", value: timeLeft.minutes },
              { label: "SANİYE", value: timeLeft.seconds },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-b from-rose-950/60 to-slate-950/90 border border-rose-500/20 rounded-2xl p-4 sm:p-5 text-center shadow-lg"
              >
                <div className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-300 mb-1 font-mono">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-rose-300/70 tracking-widest">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Loving Togetherness Banner */}
        <div className="bg-rose-950/30 border border-rose-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 fill-pink-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-rose-100">
                {settings.userName} & {settings.partnerName} Sevgi Bağı
              </div>
              <div className="text-[11px] sm:text-xs text-rose-300/70">
                Aşkımız, mutluluğumuz ve ortak hayallerimiz her geçen gün daha da büyüyor!
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-rose-200 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 shrink-0">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span>Sonsuz Sevgi Bağlantısı</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
