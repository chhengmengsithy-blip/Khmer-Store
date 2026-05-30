import React from "react";
import Link from "next/link";
import { Globe, Send } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "About", href: "/about" },
    { label: "How it Works", href: "/#how-it-works" },
  ],
  Support: [
    { label: "Contact", href: "/contact" },
    { label: "Safety Tips", href: "/about" },
  ],
  Legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-playfair text-xl font-bold text-soft-white">
                Khmer<span className="text-accent-gold">Store</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Cambodia&apos;s marketplace for buying and selling.
            </p>
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Khmer Store. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="text-muted-foreground transition-colors hover:text-accent-gold"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Telegram"
              className="text-muted-foreground transition-colors hover:text-accent-gold"
            >
              <Send className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
