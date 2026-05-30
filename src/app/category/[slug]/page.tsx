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
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { categories } from "@/constants/categories";

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

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <EmptyState
            icon={Package}
            title="Category not found"
            description="The category you are looking for does not exist."
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        </div>
      </div>
    );
  }

  const Icon = iconMap[category.icon] || Briefcase;

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent-gold">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/marketplace" className="hover:text-accent-gold">
            Marketplace
          </Link>
          <span className="mx-2">/</span>
          <span className="text-soft-white">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
            <Icon className="h-7 w-7 text-accent-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-soft-white font-playfair">
              {category.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>

        {/* Subcategory Chips */}
        {category.subcategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="cursor-pointer bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20"
            >
              All
            </Badge>
            {category.subcategories.map((sub) => (
              <Badge
                key={sub.slug}
                variant="secondary"
                className="cursor-pointer hover:bg-elevated"
              >
                {sub.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Listings - Empty State */}
        <EmptyState
          icon={Package}
          title={`No listings in ${category.name} yet`}
          description="Be the first to post a listing in this category"
          actionLabel="Post in this category"
          actionHref="/post"
        />
      </div>
    </div>
  );
}
