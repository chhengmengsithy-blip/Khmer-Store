"use client";

import React from "react";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Header */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-white/10">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background border-white/[0.06] p-6">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold text-accent-gold">Admin Panel</h1>
          <div className="w-10" />
        </div>

        {/* Desktop Layout */}
        <div className="flex gap-8">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <AdminSidebar />
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
