"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MemoryItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Calendar, MapPin, Plus, Trash2, X, Image as ImageIcon, Heart, Sparkles, Layers } from "lucide-react";

export const TimelineGallery: React.FC = () => {
  const { memories, addMemory, deleteMemory } = useApp();
  const [viewMode, setViewMode] = useState<"polaroid" | "timeline">("polaroid");
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    addMemory({
      title: newTitle,
      date: newDate || new Date().toLocaleDateString("tr-TR"),
      description: newDesc,
      location: newLocation || "Özel Yerimiz",
      imageUrl: newImageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
      tag: newTag || "Anı",
    });

    setNewTitle("");
    setNewDate("");
    setNewDesc("");
    setNewLocation("");
    setNewImageUrl("");
    setNewTag("");
    setIsAddModalOpen(false);
  };

  return (
    <section id="hikayemiz" className="py-16 sm:py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold tracking-widest uppercase mb-2">
            <Camera className="w-4 h-4" /> Fotoğraf & Anı Galerimiz
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
            Bizim Hikayemiz
          </h2>
          <p className="text-rose-200/70 text-xs sm:text-sm max-w-xl mx-auto">
            Birlikte biriktirdiğimiz en güzel anlar, gülüşlerimiz ve unutulmaz hatıralarımız...
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-rose-500/20 pb-4">
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-full border border-rose-500/20">
            <button
              onClick={() => setViewMode("polaroid")}
              className={`relative flex items-center min-h-[44px] gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-colors z-10 ${
                viewMode === "polaroid" ? "text-white" : "text-rose-300/70 hover:text-white"
              }`}
            >
              {viewMode === "polaroid" && (
                <motion.div
                  layoutId="activeViewTab"
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/30 -z-10"
                />
              )}
              <ImageIcon className="w-3.5 h-3.5" /> Polaroid Galeri
            </button>

            <button
              onClick={() => setViewMode("timeline")}
              className={`relative flex items-center min-h-[44px] gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-colors z-10 ${
                viewMode === "timeline" ? "text-white" : "text-rose-300/70 hover:text-white"
              }`}
            >
              {viewMode === "timeline" && (
                <motion.div
                  layoutId="activeViewTab"
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/30 -z-10"
                />
              )}
              <Layers className="w-3.5 h-3.5" /> Zaman Tüneli
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 min-h-[44px] text-xs px-4 py-2.5 rounded-full font-semibold transition-colors"
          >
            <Plus className="w-4 h-4 text-pink-400" />
            <span>Yeni Anı Ekle</span>
          </motion.button>
        </div>

        {/* Polaroid Grid View */}
        {viewMode === "polaroid" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {memories.map((item, idx) => {
              const rotations = [-2, 1.5, -1, 2];
              const rotAngle = rotations[idx % rotations.length];

              return (
                <motion.div
                  key={item.id}
                  layoutId={`memory-card-${item.id}`}
                  initial={{ opacity: 0, y: 20, rotate: rotAngle }}
                  animate={{ opacity: 1, y: 0, rotate: rotAngle }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMemory(item)}
                  className="group relative bg-amber-50/95 text-slate-800 p-4 rounded-md shadow-xl cursor-pointer hover:shadow-2xl hover:shadow-rose-500/20"
                >
                  {/* Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-200/70 border border-amber-300/40 shadow-sm rotate-1 z-10 pointer-events-none"></div>

                  <div className="relative aspect-square w-full bg-slate-200 rounded-sm overflow-hidden mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.tag && (
                      <span className="absolute top-2 left-2 bg-rose-500/90 text-white text-xs font-bold px-2 py-0.5 rounded shadow-md">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div className="px-1">
                    <h3 className="font-serif font-bold text-slate-900 text-base line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2 font-sans">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 font-sans">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-500" /> {item.date}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" /> {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Timeline View */}
        {viewMode === "timeline" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative border-l-2 border-rose-500/30 ml-4 sm:ml-32 space-y-8 sm:space-y-10 my-6"
          >
            {memories.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-6 sm:pl-8 group"
              >
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-rose-500 border-4 border-slate-950 shadow-md shadow-rose-500/50 group-hover:scale-125 transition-transform" />

                <div className="hidden sm:block absolute -left-36 top-1 text-right text-xs font-semibold text-rose-300 w-28">
                  {item.date}
                </div>

                <div
                  onClick={() => setSelectedMemory(item)}
                  className="bg-slate-950/90 border border-rose-500/20 rounded-2xl p-4 sm:p-5 hover:border-rose-500/40 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {item.imageUrl && (
                      <div className="w-full sm:w-36 h-32 sm:h-28 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="sm:hidden text-xs text-rose-400 font-semibold mb-1">
                        {item.date}
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-rose-200/80 text-xs sm:text-sm mb-3">{item.description}</p>
                      {item.location && (
                        <div className="inline-flex items-center gap-1.5 text-xs text-rose-300/60">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" /> {item.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Memory Detail Modal with Shared Layout Animation */}
        <AnimatePresence>
          {selectedMemory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
              <motion.div
                layoutId={`memory-card-${selectedMemory.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-lg bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-white overflow-hidden"
              >
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-4 right-4 text-rose-300 hover:text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-800/60 z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="rounded-2xl overflow-hidden mb-4 max-h-64 sm:max-h-72">
                  <img
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-rose-400 font-medium mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {selectedMemory.date}
                  </span>
                  {selectedMemory.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {selectedMemory.location}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                  {selectedMemory.title}
                </h3>
                <p className="text-rose-200/80 text-xs sm:text-sm leading-relaxed mb-6">
                  {selectedMemory.description}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-rose-500/20">
                  <button
                    onClick={() => {
                      deleteMemory(selectedMemory.id);
                      setSelectedMemory(null);
                    }}
                    className="flex items-center gap-1.5 min-h-[44px] text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Anıyı Sil
                  </button>
                  <button
                    onClick={() => setSelectedMemory(null)}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-semibold min-h-[44px] text-xs px-5 py-2 rounded-full transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Memory Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-white"
              >
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="absolute top-4 right-4 text-rose-300 hover:text-white p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-serif font-bold text-white mb-4">
                  Yeni Anı Ekle ❤️
                </h3>

                <form onSubmit={handleCreateMemory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1">
                      Anı Başlığı *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: İlk Tatilimiz"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-rose-500/30 rounded-xl min-h-[44px] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-rose-200 mb-1">
                        Tarih
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: 15 Ağustos 2025"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl min-h-[44px] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-rose-200 mb-1">
                        Konum
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: İzmir Sahili"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full bg-slate-950 border border-rose-500/30 rounded-xl min-h-[44px] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1">
                      Fotoğraf URL (İsteğe Bağlı)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-rose-500/30 rounded-xl min-h-[44px] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-rose-200 mb-1">
                      Anı Açıklaması *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="O güne dair duygularınız ve notunuz..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-rose-500/30 rounded-xl min-h-[44px] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="min-h-[44px] px-4 py-2 rounded-full text-xs text-rose-300 hover:text-white"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold min-h-[44px] text-xs px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                      Anıyı Kaydet
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
