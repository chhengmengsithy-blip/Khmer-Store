"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback: just show brief feedback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="flex-1 border-white/10"
      title={`Share ${title}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  );
}
