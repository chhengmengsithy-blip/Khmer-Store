"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Wallet,
  ArrowUpRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface WithdrawalRequest {
  id: string;
  sellerName: string;
  amount: string;
  method: string;
  requestedAt: string;
  status: "pending" | "processing";
}

const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: "w1",
    sellerName: "Sokha Electronics",
    amount: "$1,250.00",
    method: "Bank Transfer",
    requestedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "w2",
    sellerName: "Phnom Fashion",
    amount: "$890.50",
    method: "PayPal",
    requestedAt: "5 hours ago",
    status: "pending",
  },
  {
    id: "w3",
    sellerName: "KH Digital Store",
    amount: "$2,100.00",
    method: "Bank Transfer",
    requestedAt: "1 day ago",
    status: "processing",
  },
];

const financialStats = [
  {
    label: "Total Revenue (MTD)",
    value: "$124,580",
    change: "+18.3%",
    icon: DollarSign,
  },
  {
    label: "Commission Earned",
    value: "$12,458",
    change: "+22.1%",
    icon: TrendingUp,
  },
  {
    label: "Pending Payouts",
    value: "$8,920",
    change: "12 sellers",
    icon: Clock,
  },
  {
    label: "Escrow Balance",
    value: "$45,200",
    change: "89 orders",
    icon: Wallet,
  },
];

export function FinancialDashboard() {
  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((stat) => (
          <Card key={stat.label} className="border-white/[0.06] bg-white/[0.02]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-xl font-bold text-soft-white">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-green-400">{stat.change}</p>
                </div>
                <div className="rounded-lg bg-accent-gold/10 p-2">
                  <stat.icon className="h-4 w-4 text-accent-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <CardTitle className="text-soft-white">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-white/10">
            <div className="text-center">
              <ArrowUpRight className="mx-auto h-8 w-8 text-accent-gold/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Revenue chart visualization
              </p>
              <p className="text-xs text-muted-foreground">
                Integrate with analytics provider
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Requests */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-soft-white">Withdrawal Requests</CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              {mockWithdrawals.filter((w) => w.status === "pending").length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.01] p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-soft-white">
                    {withdrawal.sellerName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{withdrawal.method}</span>
                    <span>-</span>
                    <span>{withdrawal.requestedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-soft-white">
                    {withdrawal.amount}
                  </span>
                  <Badge
                    className={
                      withdrawal.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }
                  >
                    {withdrawal.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-green-400 hover:bg-green-500/10"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="h-4 w-4" />
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
