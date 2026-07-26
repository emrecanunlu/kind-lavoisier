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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-rose-500/30 rounded-3xl shadow-2xl text-white my-auto max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-rose-500/20 bg-slate-900/95 backdrop-blur-md shrink-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Settings className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
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

            {/* Form Wrapper */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden min-h-0">
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
                
                {/* AŞK KUPONLARI YÖNETİMİ */}
                <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-4">
                  <h4 className="text-xs font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-rose-500/20 pb-2">
                    <Ticket className="w-4 h-4 text-pink-400" /> Aşk Kuponları Yönetimi
                  </h4>

                  {/* Add New Coupon Sub-Form */}
                  <div className="space-y-3 pt-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-pink-400" /> Yeni Kupon Ekle
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-rose-200 mb-1">Kupon Başlığı</label>
                        <input
                          type="text"
                          placeholder="Örn: 1 Saat Masaj Kuponu"
                          value={newCouponTitle}
                          onChange={(e) => setNewCouponTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-rose-200 mb-1">Özel Yeniden Talep Tarihi (Saat Olmadan)</label>
                        <input
                          type="date"
                          value={newCouponLockDate}
                          onChange={(e) => setNewCouponLockDate(e.target.value)}
                          className="w-full bg-slate-900 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-rose-200 mb-1">Açıklama</label>
                      <input
                        type="text"
                        placeholder="Örn: Dilediğin an masaj hakkını talep edebilirsin!"
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        className="w-full bg-slate-900 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-rose-300/70">Simge:</span>
                        {icons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setNewCouponIcon(icon)}
                            className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-colors ${
                              newCouponIcon === icon
                                ? "bg-rose-500 text-white border border-pink-300"
                                : "bg-slate-900 text-rose-300 hover:bg-slate-800"
                            }`}
                          >
                            🎟️
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateCoupon}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" /> Ekle
                      </button>
                    </div>
                  </div>

                  {/* Existing Coupons List */}
                  <div className="space-y-2.5 pt-3 border-t border-rose-500/20">
                    <div className="text-[11px] font-bold text-rose-300/80 mb-1">Mevcut Kuponlar ve Yeniden Talep Tarihleri</div>
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className="p-3 rounded-xl bg-slate-900 border border-rose-500/20 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              {coupon.title}
                              {coupon.isClaimed && (
                                <span className="text-[10px] bg-rose-500/20 text-pink-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                                  Kullanıldı & Kilitli 🔒
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-rose-300/60 leading-tight">
                              {coupon.description}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {coupon.isClaimed && (
                              <button
                                type="button"
                                onClick={() => unlockCoupon(coupon.id)}
                                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/30"
                                title="Kilidi Aç / Yeniden Kullanılabilir Yap"
                              >
                                <Unlock className="w-3 h-3" /> Kilidi Aç
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteCoupon(coupon.id)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-red-400 hover:bg-slate-800"
                              title="Kuponu Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Date Only Input (Without Time) */}
                        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                          <span className="text-[10px] text-rose-300/70 shrink-0">Yeniden Talep Tarihi (Saat Olmadan):</span>
                          <input
                            type="date"
                            value={coupon.lockedUntil ? coupon.lockedUntil.slice(0, 10) : ""}
                            onChange={(e) => {
                              const iso = e.target.value ? new Date(`${e.target.value}T00:00:00`).toISOString() : undefined;
                              editCoupon(coupon.id, { lockedUntil: iso });
                            }}
                            className="bg-slate-950 border border-rose-500/30 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-rose-400 flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* İsimler */}
                <div>
                  <h4 className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-pink-400" /> İsimleriniz
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Adınız</label>
                      <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => handleChange("userName", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Sevgilinizin Adı</label>
                      <input
                        type="text"
                        value={formData.partnerName}
                        onChange={(e) => handleChange("partnerName", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Arka Plan Müziği MP3 URL */}
                <div>
                  <h4 className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-pink-400" /> Arka Plan Müziği (MP3 Linki)
                  </h4>
                  <div>
                    <label className="block text-xs text-rose-200 mb-1">Özel Müzik MP3 Bağlantısı (İsteğe Bağlı)</label>
                    <input
                      type="url"
                      placeholder="https://.../muzik.mp3"
                      value={formData.customAudioUrl || ""}
                      onChange={(e) => handleChange("customAudioUrl", e.target.value)}
                      className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-400 font-mono"
                    />
                  </div>
                </div>

                {/* Tarihler */}
                <div>
                  <h4 className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-pink-400" /> Önemli Tarihler (Geri Sayım)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Buluşma Tarihi & Saati</label>
                      <input
                        type="datetime-local"
                        value={formData.reunionDate}
                        onChange={(e) => handleChange("reunionDate", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Yıldönümü Tarihi</label>
                      <input
                        type="datetime-local"
                        value={formData.anniversaryDate}
                        onChange={(e) => handleChange("anniversaryDate", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Doğum Günü Tarihi</label>
                      <input
                        type="datetime-local"
                        value={formData.birthdayDate}
                        onChange={(e) => handleChange("birthdayDate", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Şifre Ayarları */}
                <div>
                  <h4 className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-pink-400" /> Giriş Şifresi
                  </h4>
                  <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-rose-500/20 mb-3">
                    <span className="text-xs text-rose-200">Girişte Şifreli Kapı Ekranı Olsun Mu?</span>
                    <input
                      type="checkbox"
                      checked={formData.isPasscodeEnabled}
                      onChange={(e) => handleChange("isPasscodeEnabled", e.target.checked)}
                      className="w-5 h-5 accent-rose-500 cursor-pointer"
                    />
                  </div>
                  {formData.isPasscodeEnabled && (
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Giriş Şifresi (PIN)</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.passcode}
                        onChange={(e) => handleChange("passcode", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  )}
                </div>

                {/* Mektup Düzenleme */}
                <div>
                  <h4 className="text-xs font-bold text-rose-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-pink-400" /> Mektup İçeriği
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Mektup Başlığı</label>
                      <input
                        type="text"
                        value={formData.letterTitle}
                        onChange={(e) => handleChange("letterTitle", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">Mektup Metni</label>
                      <textarea
                        rows={4}
                        value={formData.letterContent}
                        onChange={(e) => handleChange("letterContent", e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Fixed Footer Bar */}
              <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-t border-rose-500/20 bg-slate-900/95 backdrop-blur-md shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Tüm verileri varsayılana sıfırlamak istediğinize emin misiniz?")) {
                      resetToDefaults();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> Sıfırla
                </button>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-full text-xs text-rose-300 hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs px-5 sm:px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-transform"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savedSuccess ? "Kaydedildi! ✨" : "Kaydet"}</span>
                  </motion.button>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
