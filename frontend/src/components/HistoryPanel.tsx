"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, Calendar, Sparkles } from "lucide-react";
import { AnalysisResult } from "@/types";
import { clsx } from "clsx";

interface HistoryPanelProps {
  history: AnalysisResult[];
  onItemClick: (item: AnalysisResult) => void;
  onClear: () => void;
}

function formatTime(date: Date): string {
  try {
    return new Date(date).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function HistoryPanel({ history, onItemClick, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 w-full"
    >
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center">
            <Clock size={10} className="text-gray-400" />
          </div>
          <span className="text-[10px] font-display font-bold tracking-widest uppercase text-gray-400">
            Analiz Geçmişi
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-[10px] text-red-400 transition-all active:scale-95 font-medium"
        >
          <Trash2 size={10} />
          Geçmişi Temizle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {history.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => onItemClick(item)}
              className="flex items-stretch gap-4 p-3 rounded-2xl border border-white/5 bg-surface-50 hover:border-violet-500/30 hover:bg-violet-950/[0.03] transition-all duration-300 text-left w-full group relative overflow-hidden backdrop-blur-md"
            >
              {/* Card Hover Overlay Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.02] to-cyan-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Image thumbnail frame */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/5 relative">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Card info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 font-bold uppercase tracking-wider">
                      {item.modeLabel}
                    </span>
                    <span className="text-[9px] text-gray-500 flex items-center gap-0.5">
                      <Clock size={8} />
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed line-clamp-2 pr-2">
                    {item.result.replace(/[#*`_-]/g, "").slice(0, 100)}...
                  </p>
                </div>
                
                {item.customPrompt && (
                  <p className="text-[10px] text-violet-300/60 italic truncate mt-1">
                    "{item.customPrompt}"
                  </p>
                )}
              </div>

              {/* Action indicator on hover */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-300 pointer-events-none">
                <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Sparkles size={10} className="text-violet-400" />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
