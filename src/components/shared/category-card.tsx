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

interface CategoryCardProps {
  category: CategoryItem;
  listingCount?: number;
  className?: string;
}

export function CategoryCard({ category, listingCount, className }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Briefcase;

  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-white/[0.06] bg-surface p-6 text-center transition-all duration-300 hover:border-accent-gold/30 hover:bg-elevated hover:scale-[1.02]",
        className
      )}
    >
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/0 to-accent-gold/0 transition-all duration-300 group-hover:from-accent-gold/5 group-hover:to-transparent" />

      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10 transition-all duration-300 group-hover:bg-accent-gold/20 group-hover:scale-110">
        <Icon className="h-7 w-7 text-accent-gold" />
      </div>
      <div className="relative">
        <h3 className="text-sm font-medium text-soft-white">{category.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {category.description}
        </p>
        {listingCount !== undefined && (
          <span className="mt-2 inline-block rounded-full bg-accent-gold/10 px-2.5 py-0.5 text-xs font-medium text-accent-gold">
            {listingCount} listing{listingCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </Link>
  );
}
