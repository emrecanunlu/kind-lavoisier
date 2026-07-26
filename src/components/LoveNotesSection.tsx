"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Send, Trash2, Sparkles, MessageSquareHeart } from "lucide-react";

export const LoveNotesSection: React.FC = () => {
  const { notes, addNote, deleteNote, settings } = useApp();
  const [noteText, setNoteText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("❤️");

  const emojis = ["❤️", "🌸", "✨", "☕", "🎁", "🌙", "💌", "💖"];

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(noteText.trim(), selectedEmoji);
    setNoteText("");
  };

  return (
    <section id="notlar" className="py-16 sm:py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold tracking-widest uppercase mb-2">
            <MessageSquareHeart className="w-4 h-4" /> Sevgi Notları
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
            Aşk Notlarımız
          </h2>
          <p className="text-rose-200/70 text-xs sm:text-sm max-w-md mx-auto">
            Birbirimize bıraktığımız küçük, tatlı ve unutulmaz mesajlar...
          </p>
        </div>

        {/* Leave a Note Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl mb-10"
        >
          <h3 className="text-lg font-serif font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Sana Bir Not Bırakayım 💌</span>
          </h3>

          <form onSubmit={handleSendNote} className="space-y-4">
            <textarea
              required
              rows={3}
              placeholder="Aklından geçen tatlı bir not yaz..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full bg-slate-950 border border-rose-500/30 rounded-2xl min-h-[44px] p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-400 font-sans resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Emoji Picker */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-full border border-rose-500/20">
                <span className="text-xs text-rose-300/70 pl-2 font-medium">İfade:</span>
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-full text-base flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-rose-500/30 border border-rose-400 scale-110 shadow-sm"
                        : "hover:bg-slate-800"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold min-h-[44px] text-xs px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-transform ml-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notu Gönder</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-slate-900/90 border border-rose-500/20 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{note.emoji}</span>
                    <span className="text-xs font-bold text-rose-200">{note.sender}</span>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-rose-400/40 hover:text-red-400 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-white leading-relaxed whitespace-pre-line mb-4 font-sans">
                  "{note.text}"
                </p>

                <div className="text-xs text-rose-300/50 font-mono text-right border-t border-rose-500/10 pt-2">
                  {note.date}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
