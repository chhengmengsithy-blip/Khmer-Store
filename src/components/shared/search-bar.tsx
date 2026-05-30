"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/constants/categories";
import { cn } from "@/lib/utils";

const locations = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Kampong Cham",
  "Sihanoukville",
];

interface SearchBarProps {
  defaultQuery?: string;
  defaultCategory?: string;
  defaultLocation?: string;
  className?: string;
}

export function SearchBar({
  defaultQuery = "",
  defaultCategory = "",
  defaultLocation = "",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState(defaultCategory);
  const [location, setLocation] = useState(defaultLocation);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-full border bg-surface/80 backdrop-blur-sm p-1.5 transition-all duration-300",
        isFocused
          ? "border-accent-gold/40 shadow-[0_0_20px_rgba(198,167,105,0.1)]"
          : "border-white/[0.08]",
        "flex flex-col gap-2 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search listings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-9 border-0 bg-transparent text-soft-white placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Desktop category and location dropdowns */}
      <div className="hidden sm:flex sm:items-center sm:gap-1">
        <div className="h-5 w-px bg-white/[0.08]" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[140px] border-0 bg-transparent text-soft-white focus:ring-0">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-elevated border-white/10">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="h-5 w-px bg-white/[0.08]" />
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[140px] border-0 bg-transparent text-soft-white focus:ring-0">
            <MapPin className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-elevated border-white/10">
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile category and location dropdowns */}
      <div className="flex gap-2 sm:hidden">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="flex-1 border-white/10 bg-white/5 text-soft-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-elevated border-white/10">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="flex-1 border-white/10 bg-white/5 text-soft-white">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-elevated border-white/10">
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="rounded-full bg-accent-gold px-6 text-background hover:bg-accent-gold/90 transition-colors"
      >
        <Search className="mr-2 h-4 w-4 sm:hidden" />
        <span className="sm:hidden">Search</span>
        <Search className="hidden sm:block h-4 w-4" />
      </Button>
    </form>
  );
}
