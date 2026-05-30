import React from "react";
import Link from "next/link";
import { Globe, Send, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  Marketplace: [
    { label: "Browse", href: "/marketplace" },
    { label: "Categories", href: "/marketplace" },
    { label: "Post Listing", href: "/post" },
    { label: "Featured", href: "/marketplace?sort=featured" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Safety Tips", href: "/about" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-surface">
      {/* Gradient separator at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      {/* Newsletter Section - UI scaffold only, no backend submission handler yet */}
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-white/[0.06] bg-elevated/50 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-soft-white">
              Stay updated
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get the latest listings and marketplace news delivered to your inbox.
            </p>
          </div>
          <div className="flex w-full max-w-sm gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60"
            />
            <Button className="shrink-0 bg-accent-gold text-background hover:bg-accent-gold/90">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Cambodia&apos;s premier marketplace for buying and selling. Connect
              with buyers and sellers across the country.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-colors hover:border-blue-500/30 hover:text-blue-400"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-colors hover:border-teal-500/30 hover:text-teal-400"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground transition-colors hover:border-pink-500/30 hover:text-pink-400"
              >
                <Camera className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-medium text-soft-white">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-accent-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Khmer Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Payment methods accepted
            </span>
            <span className="text-xs text-muted-foreground">|</span>
            <span className="text-xs text-muted-foreground">EN / KH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
