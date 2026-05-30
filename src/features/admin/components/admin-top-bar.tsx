"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminTopBarProps {
  adminName: string;
}

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/listings": "Listings",
  "/admin/categories": "Categories",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

export function AdminTopBar({ adminName }: AdminTopBarProps) {
  const pathname = usePathname();
  const currentPage = breadcrumbMap[pathname] || "Admin";

  return (
    <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 lg:px-8 h-14">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Admin</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-soft-white font-medium">{currentPage}</span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-soft-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Site
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-muted-foreground hover:text-soft-white"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/[0.08]">
            <div className="h-7 w-7 rounded-full bg-accent-gold/10 flex items-center justify-center text-xs font-medium text-accent-gold">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-soft-white">{adminName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
