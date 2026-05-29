"use client";

import React from "react";
import { CreditCard, Wallet, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
  selected: string;
  onSelect: (method: string) => void;
}

const paymentMethods = [
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, AMEX via Stripe",
    icon: CreditCard,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with your PayPal account",
    icon: DollarSign,
  },
  {
    id: "wallet",
    name: "Wallet Balance",
    description: "Current balance: $250.00",
    icon: Wallet,
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-soft-white">
        Select Payment Method
      </h4>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
              selected === method.id
                ? "border-accent-gold bg-accent-gold/5"
                : "border-white/[0.06] bg-surface hover:border-white/20"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                selected === method.id
                  ? "bg-accent-gold/10 text-accent-gold"
                  : "bg-white/5 text-muted-foreground"
              )}
            >
              <method.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  selected === method.id
                    ? "text-accent-gold"
                    : "text-soft-white"
                )}
              >
                {method.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {method.description}
              </p>
            </div>
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full border",
                selected === method.id
                  ? "border-accent-gold"
                  : "border-white/20"
              )}
            >
              {selected === method.id && (
                <div className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
