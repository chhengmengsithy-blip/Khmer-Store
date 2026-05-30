"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-lg border border-white/[0.08] bg-gradient-to-br from-accent-gold/10 to-elevated">
        <Package className="h-16 w-16 text-muted-foreground" />
      </div>
    );
  }

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="group relative aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.08] bg-elevated">
        <Image
          src={images[selectedIndex]}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />

        {/* Image count badge */}
        <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
          {selectedIndex + 1}/{images.length}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 p-0 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 p-0 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                index === selectedIndex
                  ? "border-accent-gold ring-1 ring-accent-gold/30"
                  : "border-white/[0.08] hover:border-white/20"
              )}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
