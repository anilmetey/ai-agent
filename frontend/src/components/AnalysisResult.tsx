"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Copy, Check, Share2 } from "lucide-react";
import { clsx } from "clsx";

interface AnalysisResultProps {
  result: string;
  modeLabel?: string;
  isStreaming?: boolean;
}

export default function AnalysisResult({ result, modeLabel, isStreaming }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Kopyalama başarısız:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card overflow-hidden glow-violet border border-white/5 bg-surface-50 backdrop-blur-lg"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
            <Sparkles size={11} className="text-violet-400" />
          </div>
          <span className="text-xs font-display font-bold tracking-widest uppercase bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
            Analiz Sonucu
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Pamuk AI Yanıtlıyor...
            </span>
          )}
          
          {modeLabel && (
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-100 border border-white/5 text-gray-300 font-medium">
              {modeLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content wrapper with scroll option */}
      <div className="relative">
        {/* Content */}
        <div className={clsx(
          "px-6 py-6 prose prose-invert prose-sm max-w-none select-text",
          isStreaming && "streaming-cursor"
        )}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result}
          </ReactMarkdown>
        </div>

        {/* Copy/Share Floating actions */}
        {!isStreaming && (
          <div className="absolute right-4 bottom-4 flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 hover:border-violet-500/30 hover:bg-black/80 text-[11px] text-gray-300 hover:text-white transition-all active:scale-95"
              title="Panoya Kopyala"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Kopyala</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
