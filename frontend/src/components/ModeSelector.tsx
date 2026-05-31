"use client";

import { motion } from "framer-motion";
import { AnalysisMode } from "@/types";
import { ANALYSIS_MODES } from "@/lib/constants";
import { clsx } from "clsx";

interface ModeSelectorProps {
  selected: AnalysisMode;
  onSelect: (mode: AnalysisMode) => void;
  disabled?: boolean;
}

// Custom premium gradient and styling mapping for each mode
const MODE_STYLES: Record<AnalysisMode, { gradient: string; border: string; glow: string }> = {
  genel: {
    gradient: "from-blue-600/10 to-indigo-600/10 hover:from-blue-600/15 hover:to-indigo-600/15",
    border: "group-hover:border-blue-500/30",
    glow: "shadow-blue-500/5",
  },
  dekorasyon: {
    gradient: "from-amber-600/10 to-orange-600/10 hover:from-amber-600/15 hover:to-orange-600/15",
    border: "group-hover:border-orange-500/30",
    glow: "shadow-orange-500/5",
  },
  kod: {
    gradient: "from-cyan-600/10 to-teal-600/10 hover:from-cyan-600/15 hover:to-teal-600/15",
    border: "group-hover:border-cyan-500/30",
    glow: "shadow-cyan-500/5",
  },
  stil: {
    gradient: "from-fuchsia-600/10 to-pink-600/10 hover:from-fuchsia-600/15 hover:to-pink-600/15",
    border: "group-hover:border-fuchsia-500/30",
    glow: "shadow-fuchsia-500/5",
  },
  yemek: {
    gradient: "from-emerald-600/10 to-green-600/10 hover:from-emerald-600/15 hover:to-green-600/15",
    border: "group-hover:border-emerald-500/30",
    glow: "shadow-emerald-500/5",
  },
  yaratici: {
    gradient: "from-purple-600/10 to-violet-600/10 hover:from-purple-600/15 hover:to-violet-600/15",
    border: "group-hover:border-violet-500/30",
    glow: "shadow-violet-500/5",
  },
};

export default function ModeSelector({ selected, onSelect, disabled }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
      {ANALYSIS_MODES.map((mode, i) => {
        const isSelected = selected === mode.id;
        const styles = MODE_STYLES[mode.id];

        return (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            onClick={() => !disabled && onSelect(mode.id)}
            disabled={disabled}
            className={clsx(
              "group relative flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-300",
              "border bg-surface-50 backdrop-blur-md overflow-hidden",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
              isSelected
                ? "border-violet-500/50 bg-violet-950/10 shadow-lg shadow-violet-500/5 -translate-y-0.5"
                : "border-white/5 hover:border-white/10 hover:-translate-y-0.5 shadow-md",
              styles.gradient,
              styles.glow
            )}
          >
            {/* Active glow ring */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 animate-pulse-slow pointer-events-none" />
            )}

            {/* Top row with icon & selection indicator */}
            <div className="flex items-center justify-between w-full mb-2">
              <span className={clsx(
                "flex items-center justify-center w-8 h-8 rounded-xl text-lg transition-transform duration-300 group-hover:scale-110",
                isSelected ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-gray-400 group-hover:bg-white/10"
              )}>
                {mode.icon}
              </span>
              
              <div className={clsx(
                "w-2 h-2 rounded-full transition-all duration-300",
                isSelected ? "bg-violet-400 scale-120 glow-violet" : "bg-white/10 group-hover:bg-white/20"
              )} />
            </div>

            {/* Content info */}
            <h3 className={clsx(
              "font-display font-semibold text-sm transition-colors duration-200",
              isSelected ? "text-violet-200" : "text-gray-300 group-hover:text-white"
            )}>
              {mode.label}
            </h3>
            
            <p className="text-gray-500 text-[11px] mt-1 leading-relaxed line-clamp-2 group-hover:text-gray-400 transition-colors duration-200">
              {mode.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
