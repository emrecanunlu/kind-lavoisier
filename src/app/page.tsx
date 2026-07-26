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
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

function MainContent() {
  const { settings, isUnlocked, setIsUnlocked } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const showLockScreen = settings.isPasscodeEnabled && !isUnlocked;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      {/* Background Hearts Animation */}
      <FloatingHeartsCanvas />

      {/* Secret Vault Lock Screen */}
      <PasscodeLock />

      {/* Render Main Content ONLY when unlocked */}
      {!showLockScreen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Bar Lock Button */}
          <div className="fixed top-4 left-4 z-30 flex items-center gap-2">
            {settings.isPasscodeEnabled && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUnlocked(false)}
                className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 hover:border-rose-400 text-rose-200 text-xs px-3.5 py-2 rounded-full backdrop-blur-md shadow-lg transition-colors font-semibold"
                title="Siteyi Kilitle"
              >
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden sm:inline">Kilitle</span>
              </motion.button>
            )}
          </div>

          {/* Live Notification Toast & Drawer System */}
          <NotificationSystem />

          {/* Audio Player Component */}
          <AudioPlayer />

          {/* Hero Section */}
          <HeroSection onOpenSettings={() => setIsSettingsOpen(true)} />

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
        </motion.div>
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
