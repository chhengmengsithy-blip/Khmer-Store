"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAsSeller } from "@/features/dashboard/actions/product-actions";

export function BecomeSellerForm() {
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("business_name", businessName);

    const result = await registerAsSeller(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          You have been registered as a seller! Refresh this page to start
          adding products.
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-soft-white">Business Name</Label>
        <Input
          className="bg-elevated border-white/10"
          placeholder="Enter your business or store name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          disabled={loading}
          required
        />
        <p className="text-xs text-muted-foreground">
          This will be displayed as your seller store name.
        </p>
      </div>

      <Button
        type="submit"
        className="bg-accent-gold text-background hover:bg-accent-gold/90"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Register as Seller
      </Button>
    </form>
  );
}
