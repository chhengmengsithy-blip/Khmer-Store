"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 6,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const remaining = maxImages - images.length;
      if (remaining <= 0) return;

      const newImages: string[] = [];
      const filesToProcess = Array.from(files).slice(0, remaining);

      filesToProcess.forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const url = URL.createObjectURL(file);
        newImages.push(url);
      });

      onChange([...images, ...newImages]);
    },
    [images, maxImages, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    onChange(newImages);
  };

  const handleMoveRight = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
    onChange(newImages);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-accent-gold bg-accent-gold/5"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
          images.length >= maxImages && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag & drop images or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          {images.length}/{maxImages} images uploaded
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-white/[0.06] bg-elevated"
            >
              <Image
                src={src}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveLeft(index);
                  }}
                  disabled={index === 0}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="h-6 w-6 p-0 text-red-400 hover:bg-red-500/20"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveRight(index);
                  }}
                  disabled={index === images.length - 1}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
