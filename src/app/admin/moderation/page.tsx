"use client";

import React from "react";
import { ModerationPanel } from "@/features/admin/components/moderation-panel";

export default function AdminModerationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">Content Moderation</h1>
        <p className="mt-1 text-muted-foreground">
          Review reports and manage platform content
        </p>
      </div>

      <ModerationPanel />
    </div>
  );
}
