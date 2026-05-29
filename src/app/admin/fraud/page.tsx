"use client";

import React from "react";
import { FraudDashboard } from "@/features/admin/components/fraud-dashboard";

export default function AdminFraudPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white">Fraud Monitoring</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor suspicious activities and manage fraud alerts
        </p>
      </div>

      <FraudDashboard />
    </div>
  );
}
