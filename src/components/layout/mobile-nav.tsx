"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Search,
  PlusCircle,
  MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { label: t.nav.home, icon: House, href: "/" },
    { label: t.nav.browse, icon: Search, href: "/marketplace" },
    { label: t.nav.sell, icon: PlusCircle, href: "/post" },
    { label: t.nav.messages, icon: MessageSquare, href: "/messages" },
    { label: t.nav.profile, icon: User, href: "/dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block border-t border-white/[0.08] bg-background/95 backdrop-blur-md md:hidden">
      {/* Top glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const isPost = item.href === "/post";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] transition-colors duration-200",
                isPost
                  ? "text-accent-gold"
                  : isActive
                  ? "text-soft-white"
                  : "text-muted-foreground"
              )}
            >
              {/* Active gradient background */}
              {isActive && !isPost && (
                <span className="absolute inset-0 bg-gradient-to-t from-accent-gold/10 to-transparent rounded-lg" />
              )}
              {/* Active indicator dot */}
              {isActive && !isPost && (
                <span className="absolute -top-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-accent-gold" />
              )}
              <item.icon
                className={cn(
                  "relative h-5 w-5 transition-transform duration-200",
                  isPost && "h-6 w-6",
                  isActive && "scale-110"
                )}
              />
              <span className={cn(
                "relative font-medium",
                isPost && "bg-gradient-to-r from-accent-gold to-amber-400 bg-clip-text text-transparent"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
