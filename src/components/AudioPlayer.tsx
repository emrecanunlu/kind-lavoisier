"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, Heart } from "lucide-react";

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Relaxed, Deeply Touching Romantic Piano Chord Progression (Cmaj7 / Am7 / Fmaj7 / G7)
  const pianoChords = [
    [261.63, 329.63, 392.0, 493.88, 523.25], // Cmaj7
    [220.0, 261.63, 329.63, 392.0, 440.0],  // Am7
    [174.61, 220.0, 261.63, 329.63, 349.23], // Fmaj7
    [196.0, 246.94, 293.66, 349.23, 392.0],  // G7
  ];

  const getOrCreateAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  };

  const playNote = (freq: number, duration: number, delay: number) => {
    const ctx = getOrCreateAudioContext();
    if (!ctx || ctx.state === "closed") return;

    setTimeout(() => {
      if (!isPlayingRef.current || !ctx || ctx.state === "closed") return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Ultra-warm sine wave sound for romantic piano
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const currentVol = isMuted ? 0 : volume * 0.18;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(currentVol, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration + 0.12);
      } catch (e) {
        // Safe catch
      }
    }, delay * 1000);
  };

  const startMusicSequence = () => {
    let chordIdx = 0;
    const scheduleChord = () => {
      if (!isPlayingRef.current) return;
      const currentChord = pianoChords[chordIdx % pianoChords.length];

      currentChord.forEach((freq, idx) => {
        playNote(freq, 2.8, idx * 0.36);
      });

      // Warm bass note
      playNote(currentChord[0] / 2, 3.6, 0);

      chordIdx++;
      timerRef.current = setTimeout(scheduleChord, 3500);
    };

    scheduleChord();
  };

  // Explicit Manual Play on User Gesture
  const startAudio = () => {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    setIsPlaying(true);
    startMusicSequence();
  };

  const stopAudio = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Direct On-Demand Click/Touch Handler
  const handleTogglePlay = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Update volume in real-time
  useEffect(() => {
    if (audioCtxRef.current) {
      // Handled inside playNote using volume state
    }
  }, [volume, isMuted]);

  // Safe cleanup
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Floating Manual On-Demand Music Controller */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTogglePlay}
        onTouchStart={handleTogglePlay}
        className="flex items-center gap-3 bg-slate-900/95 border-2 border-rose-500/50 text-white p-2.5 px-4 rounded-full shadow-2xl backdrop-blur-xl transition-all cursor-pointer select-none"
      >
        {/* Play / Pause Button */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/40 shrink-0">
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </div>

        {/* Track Label & Animated Equalizer Bars */}
        <div className="flex flex-col text-left pr-1">
          <div className="text-xs font-serif font-bold text-rose-200 flex items-center gap-1.5">
            <span>Derin & Relax Piyano</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
          </div>
          <div className="text-[10px] text-rose-300/70 font-sans flex items-center gap-1">
            {isPlaying ? (
              <>
                <span className="text-pink-300">Piyano Çalıyor</span>
                <span className="inline-flex items-end gap-0.5 h-2.5 ml-1">
                  <span className="w-0.5 h-full bg-pink-400 animate-bounce"></span>
                  <span className="w-0.5 h-2/3 bg-pink-300 animate-bounce delay-150"></span>
                  <span className="w-0.5 h-4/5 bg-rose-400 animate-bounce delay-300"></span>
                </span>
              </>
            ) : (
              <span className="text-pink-300 font-bold">Müziği Başlat ▶️</span>
            )}
          </div>
        </div>

        {/* Volume & Mute Controls */}
        {isPlaying && (
          <div
            className="flex items-center gap-2 border-l border-rose-500/20 pl-3"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-rose-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-rose-500 h-1 bg-rose-900/60 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};
