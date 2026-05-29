"use client";

import React from "react";
import { VerificationQueue } from "@/features/admin/components/verification-queue";

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">Verification Queue</h1>
        <p className="mt-1 text-muted-foreground">
          Review and process KYC verification requests
        </p>
      </div>

      <VerificationQueue />
    </div>
  );
}
