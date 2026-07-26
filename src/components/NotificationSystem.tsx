"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, Sparkles, X, Trash2, Ticket, Camera, Compass, Mail, ShieldAlert, Check, AlertCircle, Share } from "lucide-react";

export const NotificationSystem: React.FC = () => {
  const {
    notifications,
    activeToast,
    dismissToast,
    markNotificationsRead,
    clearNotifications,
    notificationPermission,
    requestNativeNotificationPermission,
    addNotification,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIPhoneOrIPad);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenDrawer = () => {
    setIsOpen(true);
    markNotificationsRead();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "note":
        return <Mail className="w-4 h-4 text-pink-400" />;
      case "coupon":
        return <Ticket className="w-4 h-4 text-rose-400" />;
      case "memory":
        return <Camera className="w-4 h-4 text-purple-400" />;
      case "bucketlist":
        return <Compass className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <>
      {/* Floating Bell Button (Fixed Top Left) */}
      <div className="fixed top-4 left-16 sm:left-24 z-30 flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenDrawer}
          className="relative flex items-center gap-1.5 bg-slate-900/80 border border-rose-500/40 hover:border-rose-400 text-rose-200 text-xs px-3.5 py-2 rounded-full backdrop-blur-md shadow-lg transition-colors font-semibold"
          title="Bildirimler"
        >
          <Bell className="w-3.5 h-3.5 text-pink-400" />
          <span className="hidden sm:inline">Bildirimler</span>

          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="ml-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-md border border-white/20"
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Real-time In-App Toast Popup Banner */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-slate-900/95 border-2 border-rose-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white flex items-start gap-3"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 shrink-0">
              {getIconForType(activeToast.type)}
            </div>

            <div className="flex-1 text-left pr-2">
              <div className="text-xs font-bold text-rose-200 flex items-center gap-1.5 mb-0.5">
                <span>{activeToast.title}</span>
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
              </div>
              <p className="text-xs text-rose-100/90 leading-relaxed font-sans">
                {activeToast.message}
              </p>
            </div>

            <button
              onClick={dismissToast}
              className="text-rose-400/60 hover:text-white p-1 rounded-full hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification History & OS Permission Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm h-full bg-slate-900 border-l border-rose-500/30 shadow-2xl p-5 flex flex-col text-white overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-rose-500/20 shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-pink-400" />
                  <h3 className="text-lg font-serif font-bold text-white">
                    Bildirim Geçmişi ❤️
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-rose-300 hover:text-white p-1.5 rounded-full hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ALWAYS SHOW: Main OS Push Notification Permission Button */}
              {notificationPermission !== "granted" && notificationPermission !== "denied" && (
                <div className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 to-slate-950 border border-rose-500/40 text-left">
                  <div className="text-xs font-bold text-rose-200 flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-4 h-4 text-pink-400" />
                    <span>Anlık Cihaz Bildirimleri</span>
                  </div>
                  <p className="text-[11px] text-rose-300/80 mb-3 leading-relaxed">
                    Site kapalı veya arka planda olsa bile yeni not bırakıldığında cihazınıza bildirim düşmesini ister misiniz?
                  </p>
                  <button
                    onClick={requestNativeNotificationPermission}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-white" />
                    <span>Cihaz Bildirimlerini Etkinleştir 🔔</span>
                  </button>
                </div>
              )}

              {/* iPhone / iOS Special PWA Guidance Banner */}
              {isIOS && notificationPermission !== "granted" && (
                <div className="my-2 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/80 to-slate-950 border border-rose-500/40 text-left">
                  <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5 mb-1.5">
                    <Share className="w-4 h-4 text-pink-400" />
                    <span>iPhone / iOS Bildirim Rehberi</span>
                  </div>
                  <p className="text-[11px] text-rose-200/80 leading-relaxed mb-2.5">
                    Apple politikası gereği iPhone cihazlarda bildirim alabilmek için siteyi ana ekrana eklemeniz gerekebilir:
                  </p>
                  <div className="space-y-1.5 text-[10px] text-rose-100 bg-slate-950/90 p-2.5 rounded-xl border border-rose-500/20 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500/30 px-1.5 py-0.5 rounded text-pink-300 font-bold">1</span>
                      <span>Safari alt çubuğundaki <strong>Paylaş 📤</strong> simgesine dokunun.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500/30 px-1.5 py-0.5 rounded text-pink-300 font-bold">2</span>
                      <span><strong>"Ana Ekrana Ekle 📲"</strong> seçeneğini seçin.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500/30 px-1.5 py-0.5 rounded text-pink-300 font-bold">3</span>
                      <span>Ana ekrandan açıp yukarıdaki butonla bildirimleri aktif edin!</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Denied Warning Banner */}
              {notificationPermission === "denied" && (
                <div className="my-3 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-left">
                  <div className="text-xs font-bold text-red-300 flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Tarayıcı Bildirim Engeli Algılandı</span>
                  </div>
                  <p className="text-[11px] text-red-200/80 mb-2 leading-relaxed">
                    Tarayıcınızda bildirim izni önceden engellenmiş.
                  </p>
                  <div className="text-[10px] text-rose-200/70 bg-slate-950/80 p-2 rounded-xl border border-red-500/20">
                    💡 <strong>Nasıl Açılır?</strong> Adres çubuğundaki 🔒 kilit simgesine tıklayıp <strong>Bildirimler</strong> seçeneğini <strong>İzin Ver</strong> yapınız.
                  </div>
                </div>
              )}

              {/* Granted Success Indicator & Test Button */}
              {notificationPermission === "granted" && (
                <div className="my-2 p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-left flex flex-col gap-2">
                  <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Cihaz & Web Bildirimleri Aktif
                  </div>
                  <button
                    onClick={() => addNotification("Test Bildirimi 🔔", "Aşkımızın Sayfası bildirimleri cihazınızda sorunsuz çalışıyor! ❤️", "note")}
                    className="w-full py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold transition-colors"
                  >
                    Test Bildirimi Gönder 🔔
                  </button>
                </div>
              )}

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-rose-300/60 text-xs">
                    <Heart className="w-8 h-8 text-rose-500/30 mx-auto mb-2" />
                    Henüz yeni bir bildirim yok.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-rose-500/20 flex gap-3 text-left"
                    >
                      <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 shrink-0 h-fit">
                        {getIconForType(n.type)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">{n.title}</div>
                        <div className="text-[11px] text-rose-200/80 leading-snug mb-1">
                          {n.message}
                        </div>
                        <div className="text-[10px] text-rose-400/60 font-mono">
                          {n.timestamp}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Clear All Footer */}
              {notifications.length > 0 && (
                <div className="pt-3 border-t border-rose-500/20 shrink-0 flex justify-end">
                  <button
                    onClick={clearNotifications}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Tümünü Temizle
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
