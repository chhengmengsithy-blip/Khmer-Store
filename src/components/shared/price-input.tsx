"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  value: string;
  currency: string;
  onValueChange: (value: string) => void;
  onCurrencyChange: (currency: string) => void;
  placeholder?: string;
  className?: string;
}

export function PriceInput({
  value,
  currency,
  onValueChange,
  onCurrencyChange,
  placeholder = "0.00",
  className,
}: PriceInputProps) {
  const currencySymbol = currency === "KHR" ? "\u17DB" : "$";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
          {currencySymbol}
        </span>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="pl-7 font-mono border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold focus:ring-accent-gold/20"
        />
      </div>
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-[90px] border-white/10 bg-white/5 text-soft-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-elevated border-white/10">
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="KHR">KHR</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
