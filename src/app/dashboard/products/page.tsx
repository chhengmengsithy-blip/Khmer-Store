"use client";

import React from "react";
import Link from "next/link";
import { Plus, Eye, Pencil } from "lucide-react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockProducts = [
  { id: "1", name: "Handwoven Krama Scarf", price: 89, stock: 12, status: "Active", sales: 45 },
  { id: "2", name: "Blue Krama Pattern", price: 75, stock: 8, status: "Active", sales: 32 },
  { id: "3", name: "Golden Thread Shawl", price: 110, stock: 0, status: "Out of Stock", sales: 28 },
  { id: "4", name: "Silk Table Runner", price: 55, stock: 20, status: "Active", sales: 15 },
  { id: "5", name: "Traditional Wedding Cloth", price: 250, stock: 3, status: "Draft", sales: 0 },
];

const statusColors: Record<string, string> = {
  Active: "border-green-500/30 text-green-400 bg-green-500/5",
  "Out of Stock": "border-red-500/30 text-red-400 bg-red-500/5",
  Draft: "border-yellow-500/30 text-yellow-400 bg-yellow-500/5",
};

export default function ProductsPage() {
  return (
    <FadeIn className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-soft-white">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your product listings.
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-accent-gold text-background hover:bg-accent-gold/90 gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-white/[0.06] bg-surface p-4 space-y-3"
          >
            <div className="aspect-video rounded-lg bg-elevated" />
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium text-soft-white">
                  {product.name}
                </h4>
                <p className="text-lg font-bold text-accent-gold">
                  ${product.price}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("text-xs", statusColors[product.status])}
              >
                {product.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Stock: {product.stock}</span>
              <span>{product.sales} sold</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs text-muted-foreground hover:text-soft-white gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs text-muted-foreground hover:text-soft-white gap-1"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
