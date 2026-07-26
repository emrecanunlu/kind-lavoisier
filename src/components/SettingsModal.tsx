"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Save, RotateCcw, Heart, Shield, Calendar, Mail, Music, Ticket, Plus, Trash2, Unlock } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetToDefaults, coupons, addCoupon, deleteCoupon, unlockCoupon, editCoupon } = useApp();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Coupon State
  const [newCouponTitle, setNewCouponTitle] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponIcon, setNewCouponIcon] = useState("HeartHandshake");
  const [newCouponLockDate, setNewCouponLockDate] = useState("");

  const icons = ["HeartHandshake", "Film", "Utensils", "Sparkles", "Gift", "Compass"];

  const handleChange = (field: keyof typeof settings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponTitle.trim()) return;
    const lockIso = newCouponLockDate ? new Date(`${newCouponLockDate}T00:00:00`).toISOString() : undefined;
    addCoupon({
      title: newCouponTitle.trim(),
      description: newCouponDesc.trim() || "Özel aşk kuponu",
      icon: newCouponIcon,
      lockedUntil: lockIso,
    });
    setNewCouponTitle("");
    setNewCouponDesc("");
    setNewCouponLockDate("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 sm:p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg sm:max-w-2xl bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl text-white my-auto max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-rose-500/20 bg-slate-900 shrink-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Settings className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                  Siteyi & Kuponları Yönet ⚙️
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-rose-300 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden min-h-0">
              
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* 1. ÖNEMLİ TARİHLER (SAAT OLMADAN, GENİŞ VE NET) */}
                <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-rose-500/20 pb-2.5">
                    <Calendar className="w-4.5 h-4.5 text-pink-400" /> Önemli Tarihler (Saat Olmadan Net Seçim)
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-rose-200 mb-1.5">Buluşma / Özel Gün Tarihi</label>
                      <input
                        type="date"
                        value={formData.reunionDate ? formData.reunionDate.slice(0, 10) : ""}
                        onChange={(e) => handleChange("reunionDate", e.target.value)}
                        className="w-full min-h-[48px] bg-slate-950 border-2 border-rose-500/40 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-white focus:outline-none focus:border-rose-400 cursor-pointer shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-rose-200 mb-1.5">Yıldönümü Tarihi</label>
                      <input
                        type="date"
                        value={formData.anniversaryDate ? formData.anniversaryDate.slice(0, 10) : ""}
                        onChange={(e) => handleChange("anniversaryDate", e.target.value)}
                        className="w-full min-h-[48px] bg-slate-950 border-2 border-rose-500/40 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-white focus:outline-none focus:border-rose-400 cursor-pointer shadow-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-rose-200 mb-1.5">Doğum Günü Tarihi</label>
                      <input
                        type="date"
                        value={formData.birthdayDate ? formData.birthdayDate.slice(0, 10) : ""}
                        onChange={(e) => handleChange("birthdayDate", e.target.value)}
                        className="w-full min-h-[48px] bg-slate-950 border-2 border-rose-500/40 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-white focus:outline-none focus:border-rose-400 cursor-pointer shadow-md"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. AŞK KUPONLARI YÖNETİMİ */}
                <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-rose-500/20 pb-2.5">
                    <Ticket className="w-4.5 h-4.5 text-pink-400 shrink-0" /> Aşk Kuponları Yönetimi
                  </h4>

                  {/* Add New Coupon Form */}
                  <div className="space-y-3 pt-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <Plus className="w-4 h-4 text-pink-400" /> Yeni Kupon Ekle
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-rose-200 mb-1">Kupon Başlığı</label>
                        <input
                          type="text"
                          placeholder="Örn: 1 Saat Masaj Kuponu"
                          value={newCouponTitle}
                          onChange={(e) => setNewCouponTitle(e.target.value)}
                          className="w-full min-h-[48px] bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-rose-200 mb-1">Yeniden Talep Tarihi (Geniş Seçici)</label>
                        <input
                          type="date"
                          value={newCouponLockDate}
                          onChange={(e) => setNewCouponLockDate(e.target.value)}
                          className="w-full min-h-[48px] bg-slate-950 border-2 border-rose-500/40 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-white focus:outline-none focus:border-rose-400 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-rose-200 mb-1">Açıklama</label>
                        <input
                          type="text"
                          placeholder="Örn: Dilediğin an masaj hakkını talep edebilirsin!"
                          value={newCouponDesc}
                          onChange={(e) => setNewCouponDesc(e.target.value)}
                          className="w-full min-h-[48px] bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-rose-300/70">Simge:</span>
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          {icons.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => setNewCouponIcon(icon)}
                              className={`w-9 h-9 rounded-lg text-xs flex items-center justify-center transition-colors shrink-0 ${
                                newCouponIcon === icon
                                  ? "bg-rose-500 text-white border border-pink-300"
                                  : "bg-slate-900 text-rose-300 hover:bg-slate-800"
                              }`}
                            >
                              🎟️
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateCoupon}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs min-h-[44px] px-5 rounded-xl shadow-md flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Kupon Ekle
                      </button>
                    </div>
                  </div>

                  {/* Existing Coupons List */}
                  <div className="space-y-3 pt-3 border-t border-rose-500/20">
                    <div className="text-xs font-bold text-rose-300/90 mb-1">Mevcut Kuponlar ve Yeniden Talep Tarihleri</div>
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/20 text-xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-col text-left pr-1">
                            <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
                              {coupon.title}
                              {coupon.isClaimed && (
                                <span className="text-[10px] bg-rose-500/20 text-pink-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                                  Kullanıldı & Kilitli 🔒
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-rose-300/70 leading-tight mt-0.5">
                              {coupon.description}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {coupon.isClaimed && (
                              <button
                                type="button"
                                onClick={() => unlockCoupon(coupon.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-500/30"
                                title="Kilidi Aç"
                              >
                                <Unlock className="w-3.5 h-3.5" /> Kilidi Aç
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteCoupon(coupon.id)}
                              className="p-2 rounded-lg text-rose-400 hover:text-red-400 hover:bg-slate-800"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Wide Clear Date-Only Input */}
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                          <span className="text-xs font-bold text-rose-200">Yeniden Talep Tarihi (Net Seçim):</span>
                          <input
                            type="date"
                            value={coupon.lockedUntil ? coupon.lockedUntil.slice(0, 10) : ""}
                            onChange={(e) => {
                              const iso = e.target.value ? new Date(`${e.target.value}T00:00:00`).toISOString() : undefined;
                              editCoupon(coupon.id, { lockedUntil: iso });
                            }}
                            className="bg-slate-950 border-2 border-rose-500/40 rounded-xl px-4 py-3 text-sm sm:text-base font-semibold text-white focus:outline-none focus:border-rose-400 w-full min-h-[48px] cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. İSİMLER */}
                <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-rose-500/20 pb-2">
                    <Heart className="w-4 h-4 text-pink-400" /> İsimleriniz
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-rose-200 mb-1">Adınız</label>
                      <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => handleChange("userName", e.target.value)}
                        className="w-full min-h-[48px] bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-rose-200 mb-1">Sevgilinizin Adı</label>
                      <input
                        type="text"
                        value={formData.partnerName}
                        onChange={(e) => handleChange("partnerName", e.target.value)}
                        className="w-full min-h-[48px] bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. ARKA PLAN MÜZİĞİ */}
                <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-rose-500/20 pb-2">
                    <Music className="w-4 h-4 text-pink-400" /> Arka Plan Müziği (MP3 Linki)
                  </h4>
                  <div>
                    <label className="block text-xs font-medium text-rose-200 mb-1">Özel Müzik MP3 Bağlantısı (İsteğe Bağlı)</label>
                    <input
                      type="url"
                      placeholder="https://.../muzik.mp3"
                      value={formData.customAudioUrl || ""}
                      onChange={(e) => handleChange("customAudioUrl", e.target.value)}
                      className="w-full min-h-[48px] bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-400 font-mono"
                    />
                  </div>
                </div>

                {/* 5. ŞİFRE AYARLARI */}
                <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-rose-500/20 pb-2">
                    <Shield className="w-4 h-4 text-pink-400" /> Giriş Şifresi
                  </h4>
                  <div className="flex items-center justify-between bg-slate-900 p-3.5 rounded-xl border border-rose-500/20">
                    <span className="text-xs font-medium text-rose-200">Girişte Şifreli Kapı Ekranı Olsun Mu?</span>
                    <input
                      type="checkbox"
                      checked={formData.isPasscodeEnabled}
                      onChange={(e) => handleChange("isPasscodeEnabled", e.target.checked)}
                      className="w-5 h-5 accent-rose-500 cursor-pointer"
                    />
                  </div>
                  {formData.isPasscodeEnabled && (
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-rose-200 mb-1">Giriş Şifresi (PIN)</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.passcode}
                        onChange={(e) => handleChange("passcode", e.target.value)}
                        className="w-full min-h-[48px] bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  )}
                </div>

                {/* 6. MEKTUP DÜZENLEME */}
                <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-rose-500/20 pb-2">
                    <Mail className="w-4 h-4 text-pink-400" /> Mektup İçeriği
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-rose-200 mb-1">Mektup Başlığı</label>
                      <input
                        type="text"
                        value={formData.letterTitle}
                        onChange={(e) => handleChange("letterTitle", e.target.value)}
                        className="w-full min-h-[48px] bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-rose-200 mb-1">Mektup Metni</label>
                      <textarea
                        rows={4}
                        value={formData.letterContent}
                        onChange={(e) => handleChange("letterContent", e.target.value)}
                        className="w-full bg-slate-900 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400 resize-none font-sans"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Fixed Footer Bar */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-rose-500/20 bg-slate-900 shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Tüm verileri varsayılana sıfırlamak istediğinize emin misiniz?")) {
                      resetToDefaults();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Sıfırla
                </button>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-full text-xs text-rose-300 hover:text-white font-semibold transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs min-h-[44px] px-6 rounded-full shadow-lg hover:scale-102 transition-transform"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savedSuccess ? "Kaydedildi! ✨" : "Kaydet"}</span>
                  </button>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
