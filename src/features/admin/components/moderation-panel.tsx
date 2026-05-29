"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  Trash2,
  AlertTriangle,
  Ban,
  Clock,
  CheckCircle,
} from "lucide-react";

interface ReportItem {
  id: string;
  type: "product" | "user";
  targetName: string;
  reportedBy: string;
  reason: string;
  evidence: string;
  reportedAt: string;
  status: "pending" | "reviewing" | "resolved";
}

interface ModerationLog {
  id: string;
  action: string;
  moderator: string;
  target: string;
  reason: string;
  timestamp: string;
}

const mockReports: ReportItem[] = [
  {
    id: "r1",
    type: "product",
    targetName: "Suspicious Electronics Bundle",
    reportedBy: "Sokha Chan",
    reason: "Counterfeit goods",
    evidence: "Product images match known counterfeit patterns. Prices unrealistically low.",
    reportedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "r2",
    type: "user",
    targetName: "FastDealz_KH",
    reportedBy: "Dara Pich",
    reason: "Scam / Fraud",
    evidence: "Multiple buyers report paying but never receiving goods. Account created 3 days ago.",
    reportedAt: "4 hours ago",
    status: "reviewing",
  },
  {
    id: "r3",
    type: "product",
    targetName: "Brand Name Luxury Watch",
    reportedBy: "Nimol Tep",
    reason: "Misleading listing",
    evidence: "Listed as authentic but description mentions 'inspired by'. Price suggests replica.",
    reportedAt: "6 hours ago",
    status: "pending",
  },
];

const mockLogs: ModerationLog[] = [
  {
    id: "l1",
    action: "Product Removed",
    moderator: "Admin_Kea",
    target: "Fake Designer Bags Collection",
    reason: "Counterfeit goods violation",
    timestamp: "1 day ago",
  },
  {
    id: "l2",
    action: "User Warned",
    moderator: "Admin_Kea",
    target: "QuickSell99",
    reason: "Misleading product descriptions",
    timestamp: "1 day ago",
  },
  {
    id: "l3",
    action: "User Banned",
    moderator: "Admin_Sophea",
    target: "ScammerX",
    reason: "Repeated fraud attempts",
    timestamp: "2 days ago",
  },
];

function getStatusBadge(status: ReportItem["status"]) {
  switch (status) {
    case "pending":
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
    case "reviewing":
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Reviewing</Badge>;
    case "resolved":
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Resolved</Badge>;
  }
}

export function ModerationPanel() {
  return (
    <div className="space-y-6">
      {/* Reports Queue */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-soft-white">Reports Queue</CardTitle>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
              {mockReports.filter((r) => r.status === "pending").length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-400" />
                      <Badge
                        className={
                          report.type === "product"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }
                      >
                        {report.type}
                      </Badge>
                      {getStatusBadge(report.status)}
                      <span className="text-xs text-muted-foreground">{report.reportedAt}</span>
                    </div>
                    <p className="text-sm font-medium text-soft-white">{report.targetName}</p>
                    <p className="text-xs text-muted-foreground">
                      Reported by: {report.reportedBy} | Reason: {report.reason}
                    </p>
                    <p className="text-sm text-muted-foreground">{report.evidence}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Remove
                    </Button>
                    <Button size="sm" variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 text-xs">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Warn
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
                      <Ban className="mr-1 h-3 w-3" />
                      Ban
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Moderation History */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-soft-white">Moderation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.01] p-3"
              >
                <div className="rounded-full bg-white/5 p-2">
                  {log.action.includes("Removed") ? (
                    <Trash2 className="h-3 w-3 text-red-400" />
                  ) : log.action.includes("Warned") ? (
                    <AlertTriangle className="h-3 w-3 text-yellow-400" />
                  ) : log.action.includes("Banned") ? (
                    <Ban className="h-3 w-3 text-red-400" />
                  ) : (
                    <CheckCircle className="h-3 w-3 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-soft-white">
                    <span className="font-medium">{log.moderator}</span>{" "}
                    <span className="text-muted-foreground">{log.action.toLowerCase()}</span>{" "}
                    <span className="font-medium">{log.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{log.reason}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
