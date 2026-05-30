"use client";

import { useEffect, useRef, useState } from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  trend?: {
    direction: "up" | "down";
    percentage: number;
  };
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function StatsCard({
  icon: Icon,
  value,
  label,
  trend,
  prefix = "",
  suffix = "",
  className,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(eased * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-lg border border-white/[0.06] bg-surface p-6 transition-colors hover:border-accent-gold/20",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gold/10">
          <Icon className="h-5 w-5 text-accent-gold" />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              trend.direction === "up"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            {trend.direction === "up" ? "+" : "-"}
            {trend.percentage}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-soft-white font-mono">
          {prefix}
          {displayValue.toLocaleString()}
          {suffix}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}
