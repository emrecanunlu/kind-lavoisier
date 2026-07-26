"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Ticket, HeartHandshake, Film, Utensils, Sparkles, Gift, Compass, CheckCircle2, Circle, Plus, Trash2, ChevronDown, Lock, Calendar, Clock, RefreshCw } from "lucide-react";

export const CouponsBucketList: React.FC = () => {
  const { coupons, toggleCoupon, bucketList, toggleBucketListItem, addBucketListItem, deleteBucketListItem } = useApp();
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanCategory, setNewPlanCategory] = useState("Romantik");

  const iconMap: Record<string, React.ReactNode> = {
    HeartHandshake: <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />,
    Film: <Film className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />,
    Utensils: <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />,
    Sparkles: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
    Gift: <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />,
    Compass: <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />,
  };

  const handleClaimCoupon = (id: string, isClaimed: boolean) => {
    if (!isClaimed) {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#f43f5e", "#ec4899", "#fb7185"],
      });
    }
    toggleCoupon(id);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanTitle.trim()) return;
    addBucketListItem(newPlanTitle.trim(), newPlanCategory);
    setNewPlanTitle("");
  };

  const completedCount = bucketList.filter((b) => b.completed).length;
  const progressPercent = bucketList.length ? Math.round((completedCount / bucketList.length) * 100) : 0;

  return (
    <section id="kuponlar" className="py-16 sm:py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
        
        {/* AŞK KUPONLARI SECTION */}
        <div>
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold tracking-widest uppercase mb-2">
              <Ticket className="w-4 h-4" /> Süreli Aşk Kuponları
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              Aşk Kuponları
            </h2>
            <p className="text-rose-200/70 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Günde en fazla <strong>1 kupon</strong> talep edilebilir (24 saat bekleme süresi). Kullanılan kuponlar yeniden talep etme tarihine kadar kilitlenir ❤️
            </p>

            {/* Daily Limit Badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-rose-950/60 border border-rose-500/30 px-4 py-1.5 rounded-full text-xs text-rose-200">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              <span>Günlük Limit: 24 Saatte 1 Kupon Hakkı</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {coupons.map((coupon, idx) => {
              const lockExpireFormatted = coupon.lockedUntil
                ? new Date(coupon.lockedUntil).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
                : undefined;

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`relative bg-slate-900/90 border rounded-3xl p-5 sm:p-6 transition-colors flex flex-col justify-between overflow-hidden ${
                    coupon.isClaimed
                      ? "border-rose-500/50 bg-rose-950/20"
                      : "border-rose-500/20 hover:border-rose-500/40"
                  }`}
                >
                  {/* Notches */}
                  <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border-r border-rose-500/30"></div>
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border-l border-rose-500/30"></div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                        {iconMap[coupon.icon] || <Sparkles className="w-5 h-5 text-rose-400" />}
                      </div>
                      {coupon.isClaimed && (
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 bg-rose-950 border border-rose-500/50 text-rose-200 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md"
                        >
                          <Lock className="w-3 h-3 text-pink-400" />
                          <span>Kullanıldı & Kilitli</span>
                        </motion.span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-2">
                      {coupon.title}
                    </h3>
                    <p className="text-rose-200/70 text-xs leading-relaxed mb-6">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-rose-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-rose-300/60 font-mono">
                      {coupon.isClaimed && lockExpireFormatted ? (
                        <span className="flex items-center gap-1 text-pink-300/90 font-sans font-semibold">
                          <RefreshCw className="w-3 h-3 text-pink-400 animate-spin-slow" /> Yeniden Talep Tarihi: {lockExpireFormatted}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-sans font-semibold">Kullanıma Hazır ❤️ ({coupon.lockDays || 7} Gün Süreli)</span>
                      )}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaimCoupon(coupon.id, coupon.isClaimed)}
                      className={`w-full min-h-[44px] py-2.5 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        coupon.isClaimed
                          ? "bg-slate-950/80 border border-rose-500/30 text-rose-300/70 cursor-not-allowed"
                          : "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 hover:scale-105"
                      }`}
                    >
                      {coupon.isClaimed ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-pink-400" />
                          <span>{lockExpireFormatted ? `${lockExpireFormatted} Tarihine Kadar Kilitli` : "Kilitli"}</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Kuponu Kullan 🎟️</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* GELECEK PLANLARI (BUCKET LIST) SECTION */}
        <div id="planlar">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold tracking-widest uppercase mb-2">
              <Compass className="w-4 h-4" /> Ortak Hayallerimiz
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              Gelecek Planlarımız
            </h2>
            <p className="text-rose-200/70 text-xs sm:text-sm max-w-md mx-auto">
              Birlikte tamamlayacağımız unutulmaz macera listemiz...
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-slate-900/90 border border-rose-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl"
          >
            {/* Progress Bar Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-200 mb-2">
                <span>Tamamlanan Hayaller ({completedCount}/{bucketList.length})</span>
                <span className="text-pink-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-rose-500/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Bucket List Items */}
            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
              <AnimatePresence>
                {bucketList.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => toggleBucketListItem(item.id)}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                      item.completed
                        ? "bg-rose-950/20 border-rose-500/40 text-rose-200/60 line-through"
                        : "bg-slate-950/60 border-rose-500/20 text-white hover:border-rose-500/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-rose-500/40 shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-medium">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded-full font-semibold">
                        {item.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBucketListItem(item.id);
                        }}
                        className="text-rose-400/40 hover:text-red-400 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Custom Styled Add New Plan Form */}
            <form onSubmit={handleAddPlan} className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-rose-500/20">
              <input
                type="text"
                placeholder="Yeni bir hayal ekle..."
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                className="flex-1 bg-slate-950 border border-rose-500/30 rounded-full min-h-[44px] px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400"
              />

              {/* Styled Dropdown Selector */}
              <div className="relative inline-block w-full sm:w-40">
                <select
                  value={newPlanCategory}
                  onChange={(e) => setNewPlanCategory(e.target.value)}
                  className="w-full appearance-none bg-slate-950 border border-rose-500/30 rounded-full min-h-[44px] pl-4 pr-9 py-2.5 text-xs font-semibold text-rose-200 focus:outline-none focus:border-rose-400 cursor-pointer shadow-sm"
                >
                  <option value="Romantik" className="bg-slate-900 text-white py-1">Romantik</option>
                  <option value="Seyahat" className="bg-slate-900 text-white py-1">Seyahat</option>
                  <option value="Evde Keyif" className="bg-slate-900 text-white py-1">Evde Keyif</option>
                  <option value="Macera" className="bg-slate-900 text-white py-1">Macera</option>
                </select>
                <ChevronDown className="w-4 h-4 text-pink-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white min-h-[44px] px-6 py-2.5 rounded-full text-xs font-semibold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Ekle</span>
              </button>
            </form>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
