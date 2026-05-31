"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ImageIcon, FileImage } from "lucide-react";
import { clsx } from "clsx";
import { MAX_FILE_SIZE } from "@/lib/constants";

interface DropZoneProps {
  imageDataUrl: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function DropZone({ imageDataUrl, onFileSelect, onRemove, disabled }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: disabled || !!imageDataUrl,
  });

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {imageDataUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-surface-50 backdrop-blur-md glow-violet p-2 group"
          >
            <div className="relative rounded-xl overflow-hidden bg-black/40 max-h-[380px] flex items-center justify-center">
              <img
                src={imageDataUrl}
                alt="Uploaded view"
                className="w-full max-h-[380px] object-contain block transition-transform duration-500 group-hover:scale-[1.01]"
              />
              
              {/* Image dark overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              disabled={disabled}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/85 border border-white/10 text-gray-400 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 disabled:opacity-50 active:scale-95"
              title="Görseli kaldır"
            >
              <X size={16} />
            </button>
            
            {/* File info footer */}
            <div className="flex items-center gap-2 px-3 py-2.5 mt-2 bg-white/[0.02] rounded-xl border border-white/5">
              <FileImage size={15} className="text-violet-400" />
              <span className="text-xs text-gray-400 truncate flex-1 font-medium">
                Görsel analiz için hazır
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono">
                OK
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={clsx(
                "relative border border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden",
                isDragActive
                  ? "border-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/5 scale-[0.99]"
                  : "border-white/10 bg-surface-50 hover:border-violet-500/40 hover:bg-white/[0.03]"
              )}
            >
              <input {...getInputProps()} />

              {/* Glow effects */}
              <div className="absolute inset-0 bg-gradient-radial from-violet-500/5 to-transparent pointer-events-none" />
              {isDragActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-cyan-500/5 to-fuchsia-500/5 animate-pulse-slow pointer-events-none" />
              )}

              <div className="relative flex flex-col items-center gap-4">
                {/* Floating Upload Icon */}
                <div className={clsx(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isDragActive 
                    ? "bg-violet-500/20 text-violet-300 scale-110 shadow-md shadow-violet-500/10" 
                    : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
                )}>
                  {isDragActive ? (
                    <ImageIcon size={30} className="animate-pulse" />
                  ) : (
                    <Upload size={28} className="animate-float" />
                  )}
                </div>

                <div>
                  <p className="text-white font-display font-semibold text-base mb-1 tracking-tight">
                    {isDragActive ? "Bırak, hemen yüklensin!" : "Bir görsel sürükleyin veya göz atın"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Desteklenen formatlar: PNG, JPG, WEBP, GIF (En fazla 10MB)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
