"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  ChevronDown,
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";
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

export function Header() {
  const { y } = useScrollPosition();
  const isScrolled = y > 20;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/marketplace");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/10"
          : "bg-background/60 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="font-playfair text-xl font-bold text-soft-white">
            Khmer<span className="text-accent-gold">Store</span>
          </span>
        </Link>

        {/* Search bar - desktop */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 md:flex md:max-w-md lg:max-w-lg mx-auto"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold focus:ring-accent-gold/20"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-soft-white"
              >
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-elevated border-white/10"
            >
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Briefcase;
                return (
                  <DropdownMenuItem key={cat.slug} asChild>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-accent-gold" />
                      <span>{cat.name}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Post Listing */}
          <Button
            asChild
            className="bg-accent-gold text-background hover:bg-accent-gold/90 text-sm"
          >
            <Link href="/post">Post Listing</Link>
          </Button>

          {/* Sign In */}
          <Button
            variant="ghost"
            asChild
            className="text-sm text-muted-foreground hover:text-soft-white"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        {/* Mobile: Search icon + Hamburger */}
        <div className="flex items-center gap-1 md:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-soft-white"
            aria-label="Search"
            onClick={() => router.push("/marketplace")}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-soft-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-80 bg-surface border-white/[0.08]"
        >
          <SheetHeader>
            <SheetTitle className="font-playfair text-lg text-soft-white">
              Khmer<span className="text-accent-gold">Store</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            <Link
              href="/marketplace"
              className="rounded-md px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-soft-white"
              onClick={() => setMobileOpen(false)}
            >
              Browse Marketplace
            </Link>
            <Link
              href="/post"
              className="rounded-md px-4 py-3 text-sm text-accent-gold font-medium transition-colors hover:bg-elevated"
              onClick={() => setMobileOpen(false)}
            >
              Post Listing
            </Link>
            <Separator className="my-2 bg-white/[0.08]" />
            <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Briefcase;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-soft-white"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="h-4 w-4 text-accent-gold" />
                  {cat.name}
                </Link>
              );
            })}
          </nav>
          <Separator className="my-4 bg-white/[0.08]" />
          <div className="flex flex-col gap-3 px-4">
            <Button
              variant="ghost"
              asChild
              className="justify-start text-sm text-muted-foreground hover:text-soft-white"
            >
              <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
