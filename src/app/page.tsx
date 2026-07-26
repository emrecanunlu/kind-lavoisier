"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { PasscodeLock } from "@/components/PasscodeLock";
import { AudioPlayer } from "@/components/AudioPlayer";
import { FloatingHeartsCanvas } from "@/components/FloatingHeartsCanvas";
import { HeroSection } from "@/components/HeroSection";
import { CountdownSection } from "@/components/CountdownSection";
import { TimelineGallery } from "@/components/TimelineGallery";
import { SealedLetter } from "@/components/SealedLetter";
import { CouponsBucketList } from "@/components/CouponsBucketList";
import { LoveNotesSection } from "@/components/LoveNotesSection";
import { NotificationSystem } from "@/components/NotificationSystem";
import { FooterSection } from "@/components/FooterSection";
import { SettingsModal } from "@/components/SettingsModal";
import { Lock, Bell } from "lucide-react";

function MainContent() {
  const { settings, isUnlocked, setIsUnlocked, notifications } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const showLockScreen = settings.isPasscodeEnabled && !isUnlocked;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      {/* Background Hearts Animation */}
      <FloatingHeartsCanvas />

      {/* Secret Vault Lock Screen */}
      <PasscodeLock />

      {/* Render Main Content ONLY when unlocked */}
      {!showLockScreen && (
        <div>
          {/* ── Top Action Bar ── */}
          <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3 bg-slate-950/90">
            {/* Left: Lock + Notifications */}
            <div className="flex items-center gap-2">
              {settings.isPasscodeEnabled && (
                <button
                  onClick={() => setIsUnlocked(false)}
                  aria-label="Siteyi Kilitle"
                  className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 hover:border-rose-400 text-rose-200 text-xs px-3.5 py-2.5 rounded-full shadow-lg transition-colors font-semibold min-h-[44px]"
                >
                  <Lock className="w-4 h-4 text-pink-400" />
                  <span className="hidden sm:inline">Kilitle</span>
                </button>
              )}

              <button
                onClick={() => setIsNotificationsOpen(true)}
                aria-label="Bildirimleri Aç"
                className="relative flex items-center gap-1.5 bg-slate-900/90 border border-rose-500/40 hover:border-rose-400 text-rose-200 text-xs px-3.5 py-2.5 rounded-full shadow-lg transition-colors font-semibold min-h-[44px]"
              >
                <Bell className="w-4 h-4 text-pink-400" />
                <span className="hidden sm:inline">Bildirimler</span>

                {unreadCount > 0 && (
                  <span className="ml-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md border border-white/20 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notification Drawer (controlled via state) */}
          <NotificationSystem
            isDrawerOpen={isNotificationsOpen}
            onCloseDrawer={() => setIsNotificationsOpen(false)}
          />

          {/* Audio Player Component */}
          <AudioPlayer />

          {/* Hero Section (with extra top padding for fixed action bar) */}
          <div className="pt-14 sm:pt-16">
            <HeroSection onOpenSettings={() => setIsSettingsOpen(true)} />
          </div>

          {/* Countdown Section */}
          <CountdownSection />

          {/* Timeline & Photo Gallery Section */}
          <TimelineGallery />

          {/* Sealed Letter Section */}
          <SealedLetter />

          {/* Love Coupons & Bucket List Section */}
          <CouponsBucketList />

          {/* Love Notes & Messages Section */}
          <LoveNotesSection />

          {/* Footer Section */}
          <FooterSection />

          {/* Personalization Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
