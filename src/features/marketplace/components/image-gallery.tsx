"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const placeholderGradients = [
  "from-accent-gold/20 to-amber-900/20",
  "from-purple-900/20 to-accent-gold/10",
  "from-emerald-900/20 to-teal-900/20",
  "from-blue-900/20 to-indigo-900/20",
  "from-rose-900/20 to-pink-900/20",
];

interface ImageGalleryProps {
  images?: string[];
  productName?: string;
}

export function ImageGallery({ images, productName = "Product" }: ImageGalleryProps) {
  const imageCount = images?.length || 5;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goNext = () => setSelectedIndex((prev) => (prev + 1) % imageCount);
  const goPrev = () => setSelectedIndex((prev) => (prev - 1 + imageCount) % imageCount);

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div
          className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-elevated cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <motion.div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              placeholderGradients[selectedIndex % placeholderGradients.length]
            )}
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-medium text-white/30">
              {productName} - Image {selectedIndex + 1}
            </span>
          </motion.div>

          {/* Zoom Icon */}
          <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4 text-white/70" />
          </div>

          {/* Nav Arrows */}
          {imageCount > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: imageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "flex-shrink-0 aspect-square w-16 rounded-lg border overflow-hidden transition-all",
                selectedIndex === i
                  ? "border-accent-gold ring-1 ring-accent-gold/50"
                  : "border-white/[0.06] hover:border-white/20"
              )}
            >
              <div
                className={cn(
                  "flex h-full w-full items-center justify-center bg-gradient-to-br",
                  placeholderGradients[i % placeholderGradients.length]
                )}
              >
                <span className="text-[10px] text-white/30">{i + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <button
              onClick={goPrev}
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>

            <motion.div
              key={selectedIndex}
              className={cn(
                "aspect-square w-full max-w-lg rounded-xl bg-gradient-to-br",
                placeholderGradients[selectedIndex % placeholderGradients.length]
              )}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: premiumEasing }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-xl font-medium text-white/30">
                  {productName} - Image {selectedIndex + 1}
                </span>
              </div>
            </motion.div>

            <button
              onClick={goNext}
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>

            <div className="absolute bottom-6 text-sm text-white/50">
              {selectedIndex + 1} / {imageCount}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
