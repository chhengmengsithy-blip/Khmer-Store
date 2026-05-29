"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Collections", href: "/collections" },
  { label: "Sellers", href: "/sellers" },
  { label: "About", href: "/about" },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 bg-surface border-white/[0.08]">
        <SheetHeader>
          <SheetTitle className="font-playfair text-lg text-soft-white">
            Khmer<span className="text-accent-gold">Store</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-soft-white"
              onClick={() => onOpenChange(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Separator className="my-6 bg-white/[0.08]" />
        <div className="flex flex-col gap-3 px-4">
          <Button
            variant="ghost"
            className="justify-start text-sm text-muted-foreground hover:text-soft-white"
          >
            Sign In
          </Button>
          <Button className="bg-accent-gold text-background hover:bg-accent-gold/90">
            Join
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
