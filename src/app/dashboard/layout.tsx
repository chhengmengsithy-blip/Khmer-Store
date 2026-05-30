"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Heart,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const navLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Listings", href: "/dashboard/listings", icon: Package },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* User greeting */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-gold/10">
                  <User className="h-4 w-4 text-accent-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-soft-white truncate">
                    {user?.email?.split("@")[0] || "Welcome"}
                  </p>
                  <p className="text-xs text-muted-foreground">Your account</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === link.href ||
                        pathname.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-accent-gold/10 text-accent-gold font-medium"
                          : "text-muted-foreground hover:bg-elevated hover:text-soft-white"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile horizontal tabs */}
          <div className="fixed top-[64px] left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-b border-white/[0.06] lg:hidden">
            <div className="flex overflow-x-auto px-4 py-2 gap-1 scrollbar-hide">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === link.href ||
                      pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                      isActive
                        ? "bg-accent-gold/10 text-accent-gold"
                        : "text-muted-foreground hover:text-soft-white"
                    )}
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0 pt-12 lg:pt-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
