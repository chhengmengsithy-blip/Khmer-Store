"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Collections", href: "/collections" },
  { label: "Sellers", href: "/sellers" },
  { label: "About", href: "/about" },
];

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Header() {
  const { y } = useScrollPosition();
  const isScrolled = y > 20;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-playfair text-xl font-bold text-soft-white">
            Khmer<span className="text-accent-gold">Store</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" role="navigation" aria-label="Main navigation">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="group relative px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-soft-white"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2, ease: premiumEasing }}
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-accent-gold transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-soft-white"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-soft-white"
            >
              Sign In
            </Button>
            <Button className="text-sm bg-accent-gold text-background hover:bg-accent-gold/90">
              Join
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-soft-white md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
