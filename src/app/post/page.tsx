"use client";

import { useState } from "react";
import { Camera, AlertTriangle } from "lucide-react";
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
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { categories } from "@/constants/categories";
import { useToast } from "@/hooks/use-toast";

const locations = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Kampong Cham",
  "Sihanoukville",
];

export default function PostListingPage() {
  const { toast } = useToast();
  const supabaseReady = isSupabaseConfigured();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const category = categories.find((c) => c.slug === selectedCategory);
  const subcategories = category?.subcategories || [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    for (let i = 0; i < files.length && photos.length + newPhotos.length < 8; i++) {
      newPhotos.push(URL.createObjectURL(files[i]));
    }
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 8));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseReady) {
      toast({
        title: "Database not connected",
        description:
          "Configure Supabase to enable posting. Contact the admin for setup.",
      });
      return;
    }
    toast({
      title: "Listing posted",
      description: "Your listing is now live on the marketplace.",
    });
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-soft-white font-playfair mb-6">
          Post a Listing
        </h1>

        {!supabaseReady && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">
                Sign in to post listings
              </p>
              <p className="mt-1 text-xs text-amber-500/80">
                Database connection required. Configure Supabase environment
                variables to enable posting.
              </p>
            </div>
          </div>
        )}

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
                  placeholder="What are you selling?"
                  required
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-soft-white">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-elevated border-white/10">
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {subcategories.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-soft-white">Subcategory</Label>
                    <Select>
                      <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent className="bg-elevated border-white/10">
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.slug} value={sub.slug}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-soft-white">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    min="0"
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-soft-white">Currency</Label>
                  <Select defaultValue="USD">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-soft-white">Condition</Label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-elevated border-white/10">
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-soft-white">Location</Label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-elevated border-white/10">
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
            <CardContent className="space-y-4">
              <Textarea
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
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-soft-white">
                  Contact Phone
                </Label>
                <Input
                  id="phone"
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
                    {photos[i] ? (
                      <div className="aspect-square overflow-hidden rounded-lg border border-white/[0.08]">
                        <img
                          src={photos[i]}
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
            className="w-full bg-accent-gold text-background hover:bg-accent-gold/90 text-base py-6"
          >
            Post Listing
          </Button>
        </form>
      </div>
    </div>
  );
}
