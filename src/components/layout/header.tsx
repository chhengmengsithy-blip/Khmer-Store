"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Bell,
  Car,
  Home,
  Smartphone,
  Briefcase,
  Wrench,
  Shirt,
  Flower2,
  Dumbbell,
  Gamepad2,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Heart,
  MessageSquare,
  ListOrdered,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { categories } from "@/constants/categories";
import { useAuthStore } from "@/stores/auth-store";
import { signOut } from "@/features/auth/actions/auth-actions";
import { Logo, LogoIcon } from "@/components/shared/logo";

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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();
  const { t, locale, toggleLocale } = useTranslation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/marketplace");
    }
    setMobileSearchOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/10"
            : "bg-background/60 backdrop-blur-md"
        )}
      >
        {/* Gradient glow line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoIcon className="h-7 w-7 md:hidden" />
            <Logo className="hidden md:flex" />
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
                placeholder={t.common.searchListings}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold focus:ring-accent-gold/20 rounded-full"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-soft-white gap-1"
              onClick={toggleLocale}
            >
              <Globe className="h-3.5 w-3.5" />
              {locale.toUpperCase()}
            </Button>

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-soft-white"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
            </Button>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm text-muted-foreground hover:text-soft-white"
                >
                  {t.nav.categories}
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

            {/* Sell Now Button */}
            <Button
              asChild
              className="bg-accent-gold text-background hover:bg-accent-gold/90 text-sm font-semibold rounded-full px-5 transition-all hover:shadow-[0_0_20px_rgba(198,167,105,0.3)]"
            >
              <Link href="/post">{t.nav.sellNow}</Link>
            </Button>

            {/* Auth - conditional rendering */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-soft-white"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold/20 text-accent-gold ring-2 ring-accent-gold/30">
                      <User className="h-4 w-4" />
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-elevated border-white/10"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-soft-white truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{t.nav.dashboard}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/marketplace?my=true"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <ListOrdered className="h-4 w-4" />
                      <span>{t.nav.myListings}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{t.nav.favorites}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/messages"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{t.nav.messages}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="h-4 w-4" />
                      <span>{t.nav.settings}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t.nav.signOut}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                asChild
                className="text-sm text-muted-foreground hover:text-soft-white"
              >
                <Link href="/sign-in">{t.nav.signIn}</Link>
              </Button>
            )}
          </div>

          {/* Mobile: Search icon + Hamburger */}
          <div className="flex items-center gap-1 md:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-soft-white"
              aria-label="Search"
              onClick={() => setMobileSearchOpen(true)}
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

        {/* Mobile Search Overlay - slides down from header */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-background/95 backdrop-blur-xl px-4 py-3 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.common.searchListings}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold rounded-full"
                  autoFocus
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileSearchOpen(false)}
                className="text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-80 bg-surface border-white/[0.08]"
        >
          <SheetHeader>
            <SheetTitle className="font-playfair text-lg text-soft-white">
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            <Link
              href="/marketplace"
              className="rounded-md px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-soft-white"
              onClick={() => setMobileOpen(false)}
            >
              {t.nav.browseMarketplace}
            </Link>
            <Link
              href="/post"
              className="rounded-md px-4 py-3 text-sm text-accent-gold font-medium transition-colors hover:bg-elevated"
              onClick={() => setMobileOpen(false)}
            >
              {t.nav.sellNow}
            </Link>
            <Separator className="my-2 bg-white/[0.08]" />
            <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t.nav.categories}
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
            {user ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold/20 text-accent-gold">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-soft-white truncate">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  asChild
                  className="justify-start text-sm text-muted-foreground hover:text-soft-white"
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.nav.dashboard}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="justify-start text-sm text-muted-foreground hover:text-soft-white"
                >
                  <Link
                    href="/messages"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.nav.messages}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="justify-start text-sm text-muted-foreground hover:text-soft-white"
                >
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t.nav.settings}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-sm text-red-400 hover:text-red-400"
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                >
                  {t.nav.signOut}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="justify-start text-sm text-muted-foreground hover:text-soft-white"
                >
                  <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                    {t.nav.signIn}
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
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
