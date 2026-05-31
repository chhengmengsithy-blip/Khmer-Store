import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 48, text: "text-3xl" },
};

function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer circle frame */}
      <circle cx="32" cy="32" r="30" stroke="#C6A769" strokeWidth="2" fill="none" />

      {/* Temple spire / lotus-inspired icon mark */}
      <path
        d="M32 8L36 20H28L32 8Z"
        fill="#C6A769"
      />
      <path
        d="M32 16L38 28H26L32 16Z"
        fill="#C6A769"
        opacity="0.85"
      />
      <path
        d="M32 24L40 38H24L32 24Z"
        fill="#C6A769"
        opacity="0.7"
      />

      {/* Base platform */}
      <rect x="22" y="38" width="20" height="3" rx="1.5" fill="#C6A769" />
      <rect x="20" y="42" width="24" height="2.5" rx="1.25" fill="#C6A769" opacity="0.8" />

      {/* KS monogram below */}
      <text
        x="32"
        y="56"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="10"
        fontWeight="bold"
        fill="#C6A769"
        letterSpacing="1"
      >
        KS
      </text>
    </svg>
  );
}

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const config = sizeMap[size];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoIcon size={config.icon} />
      {!iconOnly && (
        <span
          className={cn(
            "font-playfair font-bold tracking-tight text-soft-white",
            config.text
          )}
        >
          Khmer<span className="text-accent-gold">Store</span>
        </span>
      )}
    </span>
  );
}
