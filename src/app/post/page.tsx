"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import { createListing, getCategories } from "@/features/listings/actions/listing-actions";
import type { Category } from "@/types";

export default function PostListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const photosRef = useRef<string[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    for (let i = 0; i < files.length && photos.length + newFiles.length < 8; i++) {
      newFiles.push(files[i]);
      const url = URL.createObjectURL(files[i]);
      newPreviews.push(url);
    }
    setPhotos((prev) => [...prev, ...newFiles].slice(0, 8));
    setPreviews((prev) => {
      const updated = [...prev, ...newPreviews].slice(0, 8);
      photosRef.current = updated;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to post a listing.",
      });
      return;
    }

    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData();

    formData.set("title", (form.elements.namedItem("title") as HTMLInputElement).value);
    formData.set("description", (form.elements.namedItem("description") as HTMLTextAreaElement).value);
    formData.set("price", (form.elements.namedItem("price") as HTMLInputElement).value);
    formData.set("currency", (form.elements.namedItem("currency") as HTMLInputElement)?.value || "USD");
    formData.set("condition", (form.elements.namedItem("condition") as HTMLInputElement)?.value || "used");
    formData.set("location", (form.elements.namedItem("location") as HTMLInputElement)?.value || "");
    formData.set("contact_phone", (form.elements.namedItem("contact_phone") as HTMLInputElement).value);
    formData.set("contact_name", (form.elements.namedItem("contact_name") as HTMLInputElement)?.value || "");
    formData.set("category_id", (form.elements.namedItem("category_id") as HTMLInputElement)?.value || "");

    for (const file of photos) {
      formData.append("images", file);
    }

    const result = await createListing(formData);
    setLoading(false);

    if (result.error) {
      toast({ title: "Error", description: result.error });
      return;
    }

    toast({ title: "Success", description: "Your listing has been posted!" });
    if (result.data) {
      router.push(`/listing/${result.data.id}`);
    } else {
      router.push("/marketplace");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
              <AlertTriangle className="h-8 w-8 text-accent-gold" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-soft-white">
              Sign in required
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              You need to sign in to post a listing on Khmer Store.
            </p>
            <Button
              asChild
              className="mt-6 bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              <a href="/sign-in">Sign In</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-soft-white font-playfair mb-6">
          Post a Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="border-white/[0.08] bg-surface">
            <CardHeader>
              <CardTitle className="text-lg text-soft-white">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-soft-white">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="What are you selling?"
                  required
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-soft-white">Category</Label>
                  <Select name="category_id">
                    <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
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
                  <Select name="condition" defaultValue="used">
                    <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-elevated border-white/10">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-soft-white">
                    Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    min="0"
                    required
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-soft-white">Currency</Label>
                  <Select name="currency" defaultValue="USD">
                    <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-elevated border-white/10">
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="KHR">KHR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-soft-white">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Phnom Penh"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-white/[0.08] bg-surface">
            <CardHeader>
              <CardTitle className="text-lg text-soft-white">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="description"
                placeholder="Describe your item in detail..."
                rows={5}
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold resize-none"
              />
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-white/[0.08] bg-surface">
            <CardHeader>
              <CardTitle className="text-lg text-soft-white">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="text-soft-white">
                  Contact Name
                </Label>
                <Input
                  id="contact_name"
                  name="contact_name"
                  placeholder="Your name"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="text-soft-white">
                  Contact Phone
                </Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  placeholder="+855 XX XXX XXXX"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="border-white/[0.08] bg-surface">
            <CardHeader>
              <CardTitle className="text-lg text-soft-white">
                Photos (up to 8)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="relative">
                    {previews[i] ? (
                      <div className="aspect-square overflow-hidden rounded-lg border border-white/[0.08]">
                        <img
                          src={previews[i]}
                          alt={`Photo ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/20 hover:border-accent-gold/40 transition-colors">
                        <Camera className="h-6 w-6 text-muted-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-gold text-background hover:bg-accent-gold/90 text-base py-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Listing"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
