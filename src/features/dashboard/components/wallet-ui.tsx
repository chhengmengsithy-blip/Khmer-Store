"use client";

import React from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "credit" | "debit" | "escrow";
  description: string;
  amount: number;
  date: string;
  status: string;
}

const mockTransactions: Transaction[] = [
  { id: "t1", type: "credit", description: "Payment received - Order #KS-001", amount: 89, date: "2024-01-15", status: "Completed" },
  { id: "t2", type: "debit", description: "Withdrawal to bank account", amount: -200, date: "2024-01-14", status: "Completed" },
  { id: "t3", type: "escrow", description: "Escrow hold - Order #KS-003", amount: 120, date: "2024-01-13", status: "Pending" },
  { id: "t4", type: "credit", description: "Payment received - Order #KS-004", amount: 65, date: "2024-01-12", status: "Completed" },
  { id: "t5", type: "credit", description: "Refund processed - Order #KS-005", amount: 32, date: "2024-01-11", status: "Completed" },
  { id: "t6", type: "debit", description: "Withdrawal to bank account", amount: -500, date: "2024-01-10", status: "Completed" },
  { id: "t7", type: "escrow", description: "Escrow released - Order #KS-006", amount: 85, date: "2024-01-09", status: "Completed" },
];

export function WalletUI() {
  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Main Balance */}
        <div className="rounded-xl border border-accent-gold/20 bg-gradient-to-br from-accent-gold/5 to-transparent p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="h-4 w-4 text-accent-gold" />
            Available Balance
          </div>
          <p className="mt-2 text-3xl font-bold text-accent-gold">$2,340.00</p>
          <p className="mt-1 text-xs text-muted-foreground">USD</p>
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              className="bg-accent-gold text-background hover:bg-accent-gold/90 gap-1"
            >
              <ArrowUpRight className="h-3 w-3" />
              Withdraw
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 gap-1"
            >
              <ArrowDownLeft className="h-3 w-3" />
              Deposit
            </Button>
          </div>
        </div>

        {/* Pending Escrow */}
        <div className="rounded-xl border border-white/[0.06] bg-surface p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-yellow-400" />
            Pending Escrow
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-400">$120.00</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Held until delivery confirmed
          </p>
        </div>

        {/* Pending Withdrawal */}
        <div className="rounded-xl border border-white/[0.06] bg-surface p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-blue-400" />
            Pending Withdrawal
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-400">$0.00</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Processing time: 1-3 business days
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-white/[0.06] bg-surface">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h3 className="text-sm font-semibold text-soft-white">
            Transaction History
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-soft-white"
          >
            View All
          </Button>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02]"
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  tx.type === "credit"
                    ? "bg-green-500/10"
                    : tx.type === "debit"
                    ? "bg-red-500/10"
                    : "bg-yellow-500/10"
                )}
              >
                {tx.type === "credit" ? (
                  <ArrowDownLeft className="h-4 w-4 text-green-400" />
                ) : tx.type === "debit" ? (
                  <ArrowUpRight className="h-4 w-4 text-red-400" />
                ) : (
                  <Lock className="h-4 w-4 text-yellow-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-soft-white truncate">
                  {tx.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-medium",
                    tx.amount > 0 ? "text-green-400" : "text-red-400"
                  )}
                >
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    tx.status === "Completed"
                      ? "border-green-500/30 text-green-400"
                      : "border-yellow-500/30 text-yellow-400"
                  )}
                >
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
