"use client";

import { useState, useCallback, useRef } from "react";
import { AnalysisMode, AnalysisResult, AnalysisStatus } from "@/types";
import { fileToBase64, fileToDataUrl, analyzeImageStream } from "@/lib/api";
import { ANALYSIS_MODES } from "@/lib/constants";

const HISTORY_KEY = "pamuk_history";

function loadHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((item: AnalysisResult & { timestamp: string }) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveHistory(history: AnalysisResult[]) {
  if (typeof window === "undefined") return;
  const trimmed = history.slice(0, 6);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function useLumina() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>("genel");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [streamingResult, setStreamingResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>(loadHistory);
  const [activeHistoryItem, setActiveHistoryItem] = useState<AnalysisResult | null>(null);

  const abortRef = useRef<boolean>(false);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setStreamingResult("");
    setActiveHistoryItem(null);
    setImageFile(file);
    const dataUrl = await fileToDataUrl(file);
    setImageDataUrl(dataUrl);
    setStatus("idle");
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImageDataUrl(null);
    setStreamingResult("");
    setActiveHistoryItem(null);
    setStatus("idle");
    setError(null);
  }, []);

  const handleAnalyze = useCallback(
    async (customPrompt?: string) => {
      if (!imageFile || !imageDataUrl) return;

      setError(null);
      setStreamingResult("");
      setActiveHistoryItem(null);
      setStatus("analyzing");
      abortRef.current = false;

      try {
        const base64 = await fileToBase64(imageFile);
        const mediaType = imageFile.type as string;
        let fullText = "";

        await analyzeImageStream(
          base64,
          mediaType,
          selectedMode,
          customPrompt,
          (chunk) => {
            if (abortRef.current) return;
            fullText += chunk;
            setStreamingResult(fullText);
          },
          () => {
            if (abortRef.current) return;
            setStatus("done");

            const modeConfig = ANALYSIS_MODES.find((m) => m.id === selectedMode)!;
            const newResult: AnalysisResult = {
              id: crypto.randomUUID(),
              mode: selectedMode,
              modeLabel: modeConfig.label,
              result: fullText,
              thumbnail: imageDataUrl,
              timestamp: new Date(),
              customPrompt,
            };

            setHistory((prev) => {
              const updated = [newResult, ...prev].slice(0, 6);
              saveHistory(updated);
              return updated;
            });
          },
          (err) => {
            if (abortRef.current) return;
            setError(err.message);
            setStatus("error");
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bilinmeyen hata");
        setStatus("error");
      }
    },
    [imageFile, imageDataUrl, selectedMode]
  );

  const handleHistoryClick = useCallback((item: AnalysisResult) => {
    setActiveHistoryItem(item);
    setStreamingResult("");
    setStatus("done");
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const currentResult = activeHistoryItem?.result || streamingResult;
  const currentResultMode = activeHistoryItem?.modeLabel || ANALYSIS_MODES.find((m) => m.id === selectedMode)?.label;

  return {
    status,
    selectedMode,
    setSelectedMode,
    imageFile,
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
  };
}
