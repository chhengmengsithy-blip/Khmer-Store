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

const navItems = [
  { label: "Home", icon: House, href: "/" },
  { label: "Browse", icon: Search, href: "/marketplace" },
  { label: "Post", icon: PlusCircle, href: "/post" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Profile", icon: User, href: "/dashboard" },
];

export function MobileNav() {
  const pathname = usePathname();

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
              {/* Active indicator dot */}
              {isActive && !isPost && (
                <span className="absolute -top-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-accent-gold" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isPost && "h-6 w-6",
                  isActive && "scale-110"
                )}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
