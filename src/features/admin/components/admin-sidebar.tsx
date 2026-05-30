"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Grid3X3,
  Flag,
  Settings,
  Menu,
  X,
  Shield,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navSections = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Listings", href: "/admin/listings", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Grid3X3 },
    ],
  },
  {
    label: "Users",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Reports", href: "/admin/reports", icon: Flag },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("admin-sidebar-collapsed", String(next));
  }

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen border-r border-white/[0.08] bg-surface transition-all duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-white/[0.08]">
          <Shield className="h-5 w-5 text-accent-gold shrink-0" />
          {!collapsed && (
            <span className="font-playfair text-lg text-soft-white whitespace-nowrap">
              Admin
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-4 overflow-y-auto h-[calc(100vh-140px)]">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/admin" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? link.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors relative",
                        isActive
                          ? "bg-accent-gold/10 text-accent-gold"
                          : "text-muted-foreground hover:bg-elevated hover:text-soft-white",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r bg-accent-gold" />
                      )}
                      <link.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{link.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.08]">
          {/* Back to site */}
          <div className={cn("px-3 py-3", collapsed && "px-2")}>
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground hover:text-soft-white transition-colors rounded-lg px-3 py-2 hover:bg-elevated",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? "Back to Site" : undefined}
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Back to Site</span>}
            </Link>
          </div>

          {/* Collapse toggle */}
          <div className={cn("px-3 pb-3 hidden lg:block", collapsed && "px-2")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className={cn(
                "w-full justify-center text-muted-foreground hover:text-soft-white",
                !collapsed && "justify-start"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-xs">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
