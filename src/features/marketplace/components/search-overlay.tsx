"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, TrendingUp, Tag } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const recentSearches = [
  "Silk scarves",
  "Handmade jewelry",
  "Cambodian pottery",
  "Organic spices",
];

const trendingSearches = [
  "Krama traditional",
  "Silver accessories",
  "Kampot pepper",
  "Angkor art prints",
  "Palm sugar",
];

const categoryItems = [
  { name: "Fashion & Apparel", slug: "fashion" },
  { name: "Jewelry & Accessories", slug: "jewelry" },
  { name: "Home & Living", slug: "home" },
  { name: "Food & Spices", slug: "food" },
  { name: "Art & Crafts", slug: "art" },
];

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (query: string) => void;
}

export function SearchOverlay({ open, onOpenChange, onSearch }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (value: string) => {
    onSearch(value);
    setQuery("");
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            className="fixed inset-x-0 top-0 z-50 mx-auto max-w-2xl px-4 pt-[10vh]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: premiumEasing }}
          >
            <Command className="rounded-xl border border-white/10 bg-elevated shadow-2xl">
              <CommandInput
                placeholder="Search products, sellers, categories..."
                value={query}
                onValueChange={setQuery}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    handleSelect(query.trim());
                  }
                }}
              />
              <CommandList className="max-h-[400px]">
                <CommandEmpty>No results found.</CommandEmpty>

                {!query && (
                  <>
                    <CommandGroup heading="Recent Searches">
                      {recentSearches.map((item) => (
                        <CommandItem
                          key={item}
                          className="gap-3"
                          onSelect={() => handleSelect(item)}
                        >
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{item}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Trending">
                      {trendingSearches.map((item) => (
                        <CommandItem
                          key={item}
                          className="gap-3"
                          onSelect={() => handleSelect(item)}
                        >
                          <TrendingUp className="h-4 w-4 text-accent-gold" />
                          <span>{item}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Categories">
                      {categoryItems.map((cat) => (
                        <CommandItem
                          key={cat.slug}
                          className="gap-3"
                          onSelect={() => handleSelect(cat.name)}
                        >
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{cat.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
