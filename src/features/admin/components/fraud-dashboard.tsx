"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Shield,
  Fingerprint,
  Users,
  Search,
  Ban,
  CheckCircle,
} from "lucide-react";

interface FraudAlert {
  id: string;
  type: "high_risk" | "medium_risk" | "low_risk";
  category: "suspicious_activity" | "device_conflict" | "multi_account" | "velocity";
  userName: string;
  description: string;
  riskScore: number;
  timestamp: string;
}

const mockAlerts: FraudAlert[] = [
  {
    id: "f1",
    type: "high_risk",
    category: "multi_account",
    userName: "Unknown User",
    description: "Multiple accounts detected from same device fingerprint. 4 accounts created in 2 hours.",
    riskScore: 95,
    timestamp: "2 min ago",
  },
  {
    id: "f2",
    type: "high_risk",
    category: "suspicious_activity",
    userName: "Vann Sokha",
    description: "Unusual purchase pattern: 12 high-value orders in 30 minutes from new account.",
    riskScore: 88,
    timestamp: "15 min ago",
  },
  {
    id: "f3",
    type: "medium_risk",
    category: "device_conflict",
    userName: "Kosal Phan",
    description: "Login from unrecognized device in different country. Previous device: Cambodia, New: Vietnam.",
    riskScore: 62,
    timestamp: "1 hour ago",
  },
  {
    id: "f4",
    type: "low_risk",
    category: "velocity",
    userName: "Dara Meas",
    description: "Multiple failed payment attempts (5) within 10 minutes.",
    riskScore: 35,
    timestamp: "3 hours ago",
  },
];

function getRiskBadge(type: FraudAlert["type"]) {
  switch (type) {
    case "high_risk":
      return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">High Risk</Badge>;
    case "medium_risk":
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Medium Risk</Badge>;
    case "low_risk":
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Low Risk</Badge>;
  }
}

function getCategoryIcon(category: FraudAlert["category"]) {
  switch (category) {
    case "suspicious_activity":
      return <AlertTriangle className="h-4 w-4 text-red-400" />;
    case "device_conflict":
      return <Fingerprint className="h-4 w-4 text-yellow-400" />;
    case "multi_account":
      return <Users className="h-4 w-4 text-purple-400" />;
    case "velocity":
      return <Shield className="h-4 w-4 text-blue-400" />;
  }
}

function getRiskScoreColor(score: number) {
  if (score >= 80) return "text-red-400";
  if (score >= 50) return "text-yellow-400";
  return "text-blue-400";
}

export function FraudDashboard() {
  return (
    <div className="space-y-6">
      {/* Risk Score Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-red-500/20 bg-red-500/[0.03]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-400">2</p>
                <p className="text-xs text-muted-foreground">High Risk Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/20 bg-yellow-500/[0.03]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-yellow-400">1</p>
                <p className="text-xs text-muted-foreground">Medium Risk Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20 bg-blue-500/[0.03]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-400">1</p>
                <p className="text-xs text-muted-foreground">Low Risk Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Feed */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-soft-white">Suspicious Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(alert.category)}
                      {getRiskBadge(alert.type)}
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium text-soft-white">{alert.userName}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Risk Score:</span>
                      <span className={`text-sm font-bold ${getRiskScoreColor(alert.riskScore)}`}>
                        {alert.riskScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-white/10 text-xs">
                      <Search className="mr-1 h-3 w-3" />
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
                      <Ban className="mr-1 h-3 w-3" />
                      Ban
                    </Button>
                    <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
