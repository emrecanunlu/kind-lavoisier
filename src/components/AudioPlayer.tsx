"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { Volume2, VolumeX, Play, Pause, Heart } from "lucide-react";

export const AudioPlayer: React.FC = () => {
  const { settings } = useApp();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [useSynth, setUseSynth] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom user URL or empty (will use synth)
  const customUrl = settings.customAudioUrl || "";

  // ─── Web Audio Synthesizer (always works, no network) ───
  const pianoChords = [
    [261.63, 329.63, 392.0, 493.88],
    [220.0, 261.63, 329.63, 392.0],
    [174.61, 220.0, 261.63, 329.63],
    [196.0, 246.94, 293.66, 349.23],
  ];

  const getAudioCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  };

  const playNote = (ctx: AudioContext, freq: number, duration: number, delay: number) => {
    setTimeout(() => {
      if (!isPlayingRef.current || ctx.state === "closed") return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        const vol = isMuted ? 0 : volume * 0.15;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(Math.max(vol, 0.001), ctx.currentTime + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration + 0.1);
      } catch {}
    }, delay * 1000);
  };

  const startSynth = () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    let idx = 0;
    const schedule = () => {
      if (!isPlayingRef.current) return;
      const chord = pianoChords[idx % pianoChords.length];
      chord.forEach((f, i) => playNote(ctx, f, 2.5, i * 0.32));
      playNote(ctx, chord[0] / 2, 3.2, 0);
      idx++;
      timerRef.current = setTimeout(schedule, 3200);
    };
    schedule();
  };

  const stopSynth = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // ─── Main Play/Pause Handler ───
  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      // STOP
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      stopSynth();
      return;
    }

    // PLAY — try HTML5 audio first if custom URL exists
    if (customUrl && audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            isPlayingRef.current = true;
            setIsPlaying(true);
            setUseSynth(false);
          })
          .catch(() => {
            // HTML5 audio failed → fall back to synth
            isPlayingRef.current = true;
            setIsPlaying(true);
            setUseSynth(true);
            startSynth();
          });
        return;
      }
    }

    // No custom URL or no audio element → use synth directly
    isPlayingRef.current = true;
    setIsPlaying(true);
    setUseSynth(true);
    startSynth();
  }, [isPlaying, isMuted, volume, customUrl]);

  // Sync volume to HTML5 audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Cleanup
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
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* HTML5 Audio (only rendered if custom URL provided) */}
      {customUrl && (
        <audio
          ref={audioRef}
          src={customUrl}
          loop
          playsInline
          preload="auto"
        />
      )}

      {/* Floating Music Controller */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleTogglePlay}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTogglePlay();
          }
        }}
        aria-label={isPlaying ? "Müziği Duraklat" : "Müziği Başlat"}
        className="flex items-center gap-2.5 bg-slate-900/95 border-2 border-rose-500/50 text-white p-2.5 px-4 rounded-full shadow-2xl transition-all cursor-pointer select-none active:scale-95"
      >
        {/* Play / Pause Icon */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/40 shrink-0">
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </div>

        {/* Track Label */}
        <div className="flex flex-col text-left pr-0.5">
          <div className="text-xs font-serif font-bold text-rose-200 flex items-center gap-1">
            <span>Romantik Piyano</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
          </div>
          <div className="text-xs text-rose-300/80 font-sans flex items-center gap-1">
            {isPlaying ? (
              <>
                <span className="text-pink-300">{useSynth ? "Synth Çalıyor" : "Çalıyor"}</span>
                <span className="inline-flex items-end gap-0.5 h-3 ml-1">
                  <span className="w-0.5 h-full bg-pink-400 animate-bounce"></span>
                  <span className="w-0.5 h-2/3 bg-pink-300 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-0.5 h-4/5 bg-rose-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
              </>
            ) : (
              <span className="text-pink-300 font-bold">Müziği Başlat ▶️</span>
            )}
          </div>
        </div>

        {/* Volume Controls */}
        {isPlaying && (
          <div
            className="flex items-center gap-2 border-l border-rose-500/20 pl-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Sesi Aç" : "Sesi Kapat"}
              className="text-rose-300 hover:text-white transition-colors p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              className="w-14 sm:w-16 accent-rose-500 h-1.5 bg-rose-900/60 rounded-lg cursor-pointer"
              aria-label="Ses Seviyesi"
            />
          </div>
        )}
      </div>
    </div>
  );
};
