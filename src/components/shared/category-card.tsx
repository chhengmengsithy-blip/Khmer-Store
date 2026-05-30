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
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Briefcase;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-lg border border-white/[0.08] bg-surface p-6 text-center transition-colors hover:border-accent-gold/30 hover:bg-elevated"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/10 transition-colors group-hover:bg-accent-gold/20">
        <Icon className="h-6 w-6 text-accent-gold" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-soft-white">{category.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
