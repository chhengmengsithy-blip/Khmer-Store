"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  ShoppingBag,
  AlertTriangle,
  Flag,
  ScrollText,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Verifications",
    href: "/admin/verifications",
    icon: ShieldCheck,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Fraud Monitoring",
    href: "/admin/fraud",
    icon: AlertTriangle,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    label: "Moderation Logs",
    href: "/admin/moderation",
    icon: ScrollText,
  },
  {
    label: "Financial",
    href: "/admin/financial",
    icon: DollarSign,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-2 lg:w-64">
      <div className="mb-4 px-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-gold">
          Admin Panel
        </h2>
      </div>

      <nav className="space-y-1">
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-accent-gold/10 text-accent-gold font-medium border-l-2 border-accent-gold"
                  : "text-muted-foreground hover:bg-white/5 hover:text-soft-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-2 bg-white/5" />

      <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-red-400">
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </aside>
  );
}
