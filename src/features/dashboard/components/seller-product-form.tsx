"use client";

import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createProduct } from "@/features/dashboard/actions/product-actions";

const categories = [
  { id: "fashion", name: "Fashion & Apparel" },
  { id: "jewelry", name: "Jewelry & Accessories" },
  { id: "home", name: "Home & Living" },
  { id: "food", name: "Food & Spices" },
  { id: "art", name: "Art & Crafts" },
  { id: "electronics", name: "Electronics" },
];

const conditions = ["New", "Like New", "Used"];

const shippingOptions = [
  "Standard Shipping (3-5 days)",
  "Express Shipping (1-2 days)",
  "Free Shipping",
  "Local Pickup",
];

export function SellerProductForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [imageSlots, setImageSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addImageSlot = () => {
    if (imageSlots.length < 6) {
      setImageSlots([...imageSlots, `image-${Date.now()}`]);
    }
  };

  const removeImageSlot = (id: string) => {
    setImageSlots(imageSlots.filter((slot) => slot !== id));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("price", price);
    formData.set("stock", stock);
    formData.set("status", status);

    const result = await createProduct(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(
        status === "published"
          ? "Product published successfully!"
          : "Product saved as draft."
      );
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setCondition("");
      setImageSlots([]);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-soft-white">
          Product Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-soft-white">Title</Label>
            <Input
              className="bg-elevated border-white/10"
              placeholder="Product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-soft-white">Description</Label>
            <textarea
              className="w-full min-h-[120px] rounded-lg border border-white/10 bg-elevated px-3 py-2 text-sm text-soft-white placeholder:text-muted-foreground focus:border-accent-gold/30 focus:outline-none resize-none"
              placeholder="Describe your product in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-soft-white">Price (USD)</Label>
            <Input
              type="number"
              className="bg-elevated border-white/10"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-soft-white">Stock Quantity</Label>
            <Input
              type="number"
              className="bg-elevated border-white/10"
              placeholder="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-soft-white">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger className="bg-elevated border-white/10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-elevated border-white/10">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-soft-white">Condition</Label>
            <Select value={condition} onValueChange={setCondition} disabled={loading}>
              <SelectTrigger className="bg-elevated border-white/10">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent className="bg-elevated border-white/10">
                {conditions.map((cond) => (
                  <SelectItem key={cond} value={cond.toLowerCase()}>
                    {cond}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator className="bg-white/5" />

      {/* Images */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-soft-white">
          Product Images
        </h3>
        <p className="text-xs text-muted-foreground">
          Upload up to 6 images. First image will be the cover.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imageSlots.map((slot) => (
            <div
              key={slot}
              className="relative aspect-square rounded-lg border border-white/[0.06] bg-elevated"
            >
              <div className="flex h-full items-center justify-center bg-accent-gold/5 rounded-lg">
                <span className="text-xs text-muted-foreground">Image</span>
              </div>
              <button
                type="button"
                onClick={() => removeImageSlot(slot)}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {imageSlots.length < 6 && (
            <button
              type="button"
              onClick={addImageSlot}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-white/10 transition-colors hover:border-accent-gold/30"
              disabled={loading}
            >
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload className="h-5 w-5" />
                <span className="text-xs">Add Image</span>
              </div>
            </button>
          )}
        </div>
      </section>

      <Separator className="bg-white/5" />

      {/* Shipping */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-soft-white">
          Shipping Options
        </h3>
        <div className="space-y-2">
          {shippingOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-surface p-3 cursor-pointer hover:border-white/20 transition-colors"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-elevated accent-amber-500"
                disabled={loading}
              />
              <span className="text-sm text-soft-white">{option}</span>
            </label>
          ))}
        </div>
      </section>

      <Separator className="bg-white/5" />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
          onClick={() => handleSubmit("published")}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Publish Product
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-white/10 text-muted-foreground"
          onClick={() => handleSubmit("draft")}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Save as Draft
        </Button>
      </div>
    </form>
  );
}
