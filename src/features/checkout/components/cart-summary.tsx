"use client";

import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";

export function CartSummary() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  const subtotal = total();
  const shippingFee = subtotal > 50 ? 0 : 5.99;
  const platformFee = subtotal * 0.03;
  const grandTotal = subtotal + shippingFee + platformFee;

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-surface p-6 text-center">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-4">
      <h3 className="text-sm font-semibold text-soft-white">
        Order Summary ({items.length} items)
      </h3>

      {/* Items */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-3 rounded-lg bg-elevated p-3"
          >
            <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-accent-gold/10" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-soft-white truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-accent-gold">
                ${item.product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  updateQuantity(item.product_id, item.quantity - 1)
                }
                className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-muted-foreground hover:bg-white/10"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-xs text-soft-white">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.product_id, item.quantity + 1)
                }
                className="flex h-6 w-6 items-center justify-center rounded bg-white/5 text-muted-foreground hover:bg-white/10"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.product_id)}
              className="text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Separator className="bg-white/5" />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-green-400">Free</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Platform Fee (3%)</span>
          <span>${platformFee.toFixed(2)}</span>
        </div>
        <Separator className="bg-white/5" />
        <div className="flex justify-between text-base font-semibold">
          <span className="text-soft-white">Total</span>
          <span className="text-accent-gold">${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
