"use client";

import React, { useState, useRef, useEffect } from "react";
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
import {
  createProduct,
  insertProductMedia,
} from "@/features/dashboard/actions/product-actions";
import { createClient } from "@/lib/supabase/client";

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const remaining = 6 - selectedFiles.length;
    const allFiles = Array.from(files).slice(0, remaining);

    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    for (const file of allFiles) {
      if (file.size > MAX_FILE_SIZE) {
        rejectedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    }

    if (rejectedFiles.length > 0) {
      setError(
        `The following file(s) exceed the 5MB size limit and were not added: ${rejectedFiles.join(", ")}`
      );
    }

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    }

    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
    formData.set("category", category);
    formData.set("condition", condition);

    const result = await createProduct(formData);

    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    const productId = result.productId!;

    // Upload images to Supabase Storage using browser client
    if (selectedFiles.length > 0) {
      const supabase = createClient();
      const uploadedUrls: { url: string; displayOrder: number }[] = [];
      const failedUploads: string[] = [];
      const timestamp = new Date().getTime();

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${productId}/${i}_${timestamp}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) {
          failedUploads.push(file.name);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        uploadedUrls.push({
          url: urlData.publicUrl,
          displayOrder: i,
        });
      }

      // Insert media records via server action
      if (uploadedUrls.length > 0) {
        const mediaResult = await insertProductMedia(productId, uploadedUrls);
        if (mediaResult.error) {
          failedUploads.push(`Database error: ${mediaResult.error}`);
        }
      }

      if (failedUploads.length > 0 && uploadedUrls.length === 0) {
        // All uploads failed but product was created
        setLoading(false);
        setSuccess(
          status === "published"
            ? "Product published, but image upload failed. You can add images later."
            : "Product saved as draft, but image upload failed. You can add images later."
        );
        // Reset form
        resetForm();
        return;
      }

      if (failedUploads.length > 0) {
        // Some uploads failed
        setLoading(false);
        setSuccess(
          `Product ${status === "published" ? "published" : "saved as draft"} with ${uploadedUrls.length} image(s). ${failedUploads.length} image(s) failed to upload.`
        );
        resetForm();
        return;
      }
    }

    setLoading(false);
    setSuccess(
      status === "published"
        ? "Product published successfully!"
        : "Product saved as draft."
    );
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("");
    setCondition("");
    // Revoke all preview URLs
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviews([]);
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((previewUrl, index) => (
            <div
              key={`preview-${index}`}
              className="relative aspect-square rounded-lg border border-white/[0.06] bg-elevated overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                disabled={loading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {selectedFiles.length < 6 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
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
