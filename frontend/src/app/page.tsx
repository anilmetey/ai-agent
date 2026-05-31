"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, AlertCircle, Sparkle, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import ModeSelector from "@/components/ModeSelector";
import DropZone from "@/components/DropZone";
import AnalysisResult from "@/components/AnalysisResult";
import HistoryPanel from "@/components/HistoryPanel";
import ParticleBackground from "@/components/ParticleBackground";
import { useLumina } from "@/lib/useLumina";

export default function HomePage() {
  const [customPrompt, setCustomPrompt] = useState("");
  const {
    status,
    selectedMode,
    setSelectedMode,
    imageDataUrl,
    currentResult,
    currentResultMode,
    error,
    history,
    handleFileSelect,
    handleRemoveImage,
    handleAnalyze,
    handleHistoryClick,
    handleClearHistory,
  } = useLumina();

  const isAnalyzing = status === "analyzing";
  const canAnalyze = !!imageDataUrl && !isAnalyzing;

  const handleStartAnalysis = () => {
    handleAnalyze(customPrompt);
  };

  return (
    <main className="min-h-screen relative text-white bg-[#050507] overflow-hidden selection:bg-violet-500/30 selection:text-white">
      {/* Background Particles & Glows */}
      <ParticleBackground />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 z-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 
                className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-violet-300 bg-clip-text text-transparent"
              >
                PamukAI
              </h1>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                ✦ GÖRSEL ANALİZ COPILOT
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden sm:flex items-center gap-2"
          >
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono">
              v1.1.0
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
              Powered by Claude Vision
            </span>
          </motion.div>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Step 1: Upload */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold tracking-widest text-violet-400 font-mono">01/</span>
                <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">GÖRSEL SEÇİMİ</h2>
              </div>
              
              <DropZone
                imageDataUrl={imageDataUrl}
                onFileSelect={handleFileSelect}
                onRemove={handleRemoveImage}
                disabled={isAnalyzing}
              />
            </motion.section>

            {/* Step 2: Mode selection */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold tracking-widest text-violet-400 font-mono">02/</span>
                <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">ANALİZ MODU</h2>
              </div>

              <ModeSelector
                selected={selectedMode}
                onSelect={setSelectedMode}
                disabled={isAnalyzing}
              />
            </motion.section>

            {/* Step 3: Trigger analysis */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold tracking-widest text-violet-400 font-mono">03/</span>
                <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400">ÖZEL DETAYLAR & ANALİZ</h2>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="AI için ek soru veya özel istek... (opsiyonel)"
                  disabled={isAnalyzing}
                  onKeyDown={(e) => e.key === "Enter" && canAnalyze && handleStartAnalysis()}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-surface-50 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.04] transition-all disabled:opacity-50"
                />

                <button
                  onClick={handleStartAnalysis}
                  disabled={!canAnalyze}
                  className={clsx(
                    "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-semibold text-sm whitespace-nowrap transition-all duration-300",
                    canAnalyze
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/20 active:translate-y-0"
                      : "bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed"
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Analiz Gerçekleştiriliyor...
                    </>
                  ) : (
                    <>
                      <Wand2 size={15} />
                      Görseli Analiz Et
                    </>
                  )}
                </button>
              </div>
            </motion.section>

            {/* Error Container */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-300 text-xs"
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {currentResult || isAnalyzing ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnalysisResult
                    result={currentResult}
                    modeLabel={currentResultMode}
                    isStreaming={isAnalyzing}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-dashed border-white/5 bg-surface-50 backdrop-blur-md p-16 text-center flex flex-col items-center justify-center gap-4 text-gray-500 min-h-[350px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-400">
                    <Sparkle size={18} className="animate-pulse-slow" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-gray-300 mb-1">
                      Analiz Yapmaya Hazır
                    </h3>
                    <p className="text-xs max-w-xs mx-auto leading-relaxed">
                      Soldan görselinizi ve analiz modunu seçtikten sonra analizi başlatın. AI detaylı raporu burada oluşturacaktır.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* History Panel (Full Width Bottom) */}
        <section className="w-full mt-6 border-t border-white/5 pt-4">
          <HistoryPanel
            history={history}
            onItemClick={handleHistoryClick}
            onClear={handleClearHistory}
          />
        </section>

      </div>
    </main>
  );
}
