import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function LogoIcon({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C6A769" />
          <stop offset="100%" stopColor="#D4B87A" />
        </linearGradient>
      </defs>
      {/* Shield/storefront shape */}
      <path
        d="M20 2L36 10V22C36 30.837 28.837 38 20 38C11.163 38 4 30.837 4 22V10L20 2Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        fill="none"
      />
      {/* Stylized K */}
      <path
        d="M13 13V27M13 20L19 13M13 20L19 27"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stylized S */}
      <path
        d="M24 14C24 14 27 13 27 15.5C27 18 23 18.5 23 18.5C23 18.5 27 19 27 21.5C27 24 24 26 24 26"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon />
      <span className="font-playfair text-xl font-semibold text-soft-white">
        Khmer <span className="text-accent-gold">Store</span>
      </span>
    </div>
  );
}
