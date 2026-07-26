"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, Sparkles, X, Ticket, Camera, Compass, Mail, ShieldAlert, Check, Share, Smartphone } from "lucide-react";

interface NotificationSystemProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({ isDrawerOpen, onCloseDrawer }) => {
  const {
    notifications,
    activeToast,
    dismissToast,
    markNotificationsRead,
    notificationPermission,
    requestNativeNotificationPermission,
  } = useApp();

  const [isIOS, setIsIOS] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    }
  }, []);

  // Mark notifications as read when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      markNotificationsRead();
    }
  }, [isDrawerOpen]);

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
      {/* Real-time In-App Toast Banner */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-slate-900/95 border-2 border-rose-500/50 rounded-2xl p-4 shadow-2xl text-white flex items-start gap-3"
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
              aria-label="Bildirimi Kapat"
              className="text-rose-400/60 hover:text-white p-2.5 rounded-full hover:bg-slate-800 min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70" onClick={onCloseDrawer}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm h-full bg-slate-900 border-l border-rose-500/30 shadow-2xl p-4 sm:p-5 flex flex-col text-white overflow-hidden"
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
                  onClick={onCloseDrawer}
                  aria-label="Paneli Kapat"
                  className="text-rose-300 hover:text-white p-2.5 rounded-full hover:bg-slate-800 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Push Notification Permission */}
              <div className="my-3 p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 to-slate-950 border border-rose-500/40 text-left">
                <div className="text-xs font-bold text-rose-200 flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-pink-400" />
                    <span>Cihaz Bildirimleri</span>
                  </div>
                  {notificationPermission === "granted" && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Aktif
                    </span>
                  )}
                </div>

                <p className="text-xs text-rose-300/80 mb-3 leading-relaxed">
                  Yeni not veya kupon kullanıldığında kilit ekranına bildirim gelsin mi?
                </p>

                <button
                  onClick={requestNativeNotificationPermission}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs min-h-[44px] py-2.5 rounded-xl shadow-md transition-transform flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-4 h-4" />
                  <span>Bildirim İznini Etkinleştir 🔔</span>
                </button>
              </div>

              {/* iOS PWA Guide */}
              {isIOS && (
                <div className="mb-3 p-4 rounded-2xl bg-slate-950 border border-pink-500/30 text-left space-y-2">
                  <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-rose-400" />
                    <span>iPhone Bildirim Rehberi 📲</span>
                  </div>
                  <p className="text-xs text-rose-200/80 leading-relaxed">
                    iPhone kilit ekranı bildirimleri için sayfayı ana ekrana ekleyin:
                  </p>
                  <ol className="text-xs text-rose-300/90 space-y-1.5 pl-4 list-decimal">
                    <li>Safari altındaki <strong>Paylaş <Share className="w-3.5 h-3.5 inline text-pink-400" /></strong> butonuna dokunun</li>
                    <li><strong>Ana Ekrana Ekle 📲</strong> seçeneğini tıklayın</li>
                    <li>Ana ekrandan açtığınızda bildirimler %100 çalışır!</li>
                  </ol>
                </div>
              )}

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 text-xs text-rose-300/60">
                    Henüz hiç bildirim yok...
                  </div>
                ) : (
                  notifications.map((n, idx) => (
                    <div
                      key={n.id || `notif-item-${idx}`}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs space-y-1 text-left"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-200">
                        <span className="flex items-center gap-1.5">
                          {getIconForType(n.type)}
                          {n.title}
                        </span>
                        <span className="text-xs text-rose-400/60 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-rose-100/80 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
