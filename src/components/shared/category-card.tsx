import Link from "next/link";
import {
  Car,
  Home,
  Smartphone,
  Briefcase,
  Wrench,
  Shirt,
  Flower2,
  Dumbbell,
  Gamepad2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryItem } from "@/constants/categories";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Car,
  Home,
  Smartphone,
  Briefcase,
  Wrench,
  Shirt,
  Flower2,
  Dumbbell,
  Gamepad2,
};

const categoryColors: Record<string, { bg: string; text: string; hoverBorder: string; gradient: string; topBorder: string }> = {
  vehicles: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
    gradient: "group-hover:from-blue-500/5",
    topBorder: "bg-blue-500",
  },
  property: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/30",
    gradient: "group-hover:from-emerald-500/5",
    topBorder: "bg-emerald-500",
  },
  electronics: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    hoverBorder: "hover:border-purple-500/30",
    gradient: "group-hover:from-purple-500/5",
    topBorder: "bg-purple-500",
  },
  jobs: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    hoverBorder: "hover:border-amber-500/30",
    gradient: "group-hover:from-amber-500/5",
    topBorder: "bg-amber-500",
  },
  services: {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    hoverBorder: "hover:border-teal-500/30",
    gradient: "group-hover:from-teal-500/5",
    topBorder: "bg-teal-500",
  },
  fashion: {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    hoverBorder: "hover:border-pink-500/30",
    gradient: "group-hover:from-pink-500/5",
    topBorder: "bg-pink-500",
  },
  "home-garden": {
    bg: "bg-lime-500/10",
    text: "text-lime-400",
    hoverBorder: "hover:border-lime-500/30",
    gradient: "group-hover:from-lime-500/5",
    topBorder: "bg-lime-500",
  },
  "sports-leisure": {
    bg: "bg-red-500/10",
    text: "text-red-400",
    hoverBorder: "hover:border-red-500/30",
    gradient: "group-hover:from-red-500/5",
    topBorder: "bg-red-500",
  },
  "digital-products": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    hoverBorder: "hover:border-indigo-500/30",
    gradient: "group-hover:from-indigo-500/5",
    topBorder: "bg-indigo-500",
  },
};

const defaultColors = {
  bg: "bg-accent-gold/10",
  text: "text-accent-gold",
  hoverBorder: "hover:border-accent-gold/30",
  gradient: "group-hover:from-accent-gold/5",
  topBorder: "bg-accent-gold",
};

interface CategoryCardProps {
  category: CategoryItem;
  listingCount?: number;
  className?: string;
}

export function CategoryCard({ category, listingCount, className }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Briefcase;
  const colors = categoryColors[category.slug] || defaultColors;

  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-white/[0.06] bg-surface p-6 text-center transition-all duration-300 hover:bg-elevated hover:scale-[1.02]",
        colors.hoverBorder,
        className
      )}
    >
      {/* Colored top border */}
      <div className={`absolute inset-x-0 top-0 h-0.5 ${colors.topBorder} opacity-60`} />

      {/* Subtle gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent transition-all duration-300 ${colors.gradient} group-hover:to-transparent`} />

      <div className={`relative flex h-14 w-14 items-center justify-center rounded-full ${colors.bg} transition-all duration-300 group-hover:scale-110`}>
        <Icon className={`h-7 w-7 ${colors.text}`} />
      </div>
      <div className="relative">
        <h3 className="text-sm font-medium text-soft-white">{category.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {category.description}
        </p>
        {listingCount !== undefined && (
          <span className={`mt-2 inline-block rounded-full ${colors.bg} px-2.5 py-0.5 text-xs font-medium ${colors.text}`}>
            {listingCount} listing{listingCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </Link>
  );
}
