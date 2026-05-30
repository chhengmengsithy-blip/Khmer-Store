"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Loader2,
  Check,
  ChevronRight,
  ChevronLeft,
  Camera,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/image-upload";
import { PriceInput } from "@/components/shared/price-input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import { createListing } from "@/features/listings/actions/listing-actions";
import { categories, type CategoryItem } from "@/constants/categories";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Category", description: "Choose a category" },
  { id: 2, label: "Details", description: "Item information" },
  { id: 3, label: "Photos", description: "Add images" },
  { id: 4, label: "Location", description: "Contact info" },
  { id: 5, label: "Review", description: "Publish listing" },
];

const CONDITIONS = [
  { value: "new", label: "New", description: "Brand new, unused item" },
  { value: "like_new", label: "Like New", description: "Used briefly, excellent condition" },
  { value: "used", label: "Used", description: "Normal wear and tear" },
];

const DRAFT_KEY = "khmer-store-post-draft";

interface FormData {
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  condition: string;
  images: string[];
  location: string;
  contactName: string;
  contactPhone: string;
}

const defaultFormData: FormData = {
  categoryId: "",
  categoryName: "",
  title: "",
  description: "",
  price: "",
  currency: "USD",
  condition: "used",
  images: [],
  location: "",
  contactName: "",
  contactPhone: "",
};

export default function PostListingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Exclude images from draft (blob URLs are not persistent)
        setFormData({ ...defaultFormData, ...parsed, images: [] });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const saveDraft = () => {
    try {
      // Save everything except images (blob URLs)
      const toSave = { ...formData, images: [] };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      toast({
        title: "Draft saved",
        description: "Your listing draft has been saved locally.",
      });
    } catch {
      // Ignore storage errors
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore
    }
  };

  const updateForm = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!formData.categoryId;
      case 2:
        return !!formData.title && !!formData.price;
      case 3:
        return true; // Photos are optional
      case 4:
        return true; // Location is optional
      case 5:
        return !!formData.title && !!formData.price;
      default:
        return false;
    }
  };

  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to post a listing.",
      });
      return;
    }

    setLoading(true);
    const fd = new globalThis.FormData();
    fd.set("title", formData.title);
    fd.set("description", formData.description);
    fd.set("price", formData.price);
    fd.set("currency", formData.currency);
    fd.set("condition", formData.condition);
    fd.set("location", formData.location);
    fd.set("contact_phone", formData.contactPhone);
    fd.set("contact_name", formData.contactName);
    fd.set("category_id", formData.categoryId);

    const result = await createListing(fd);
    setLoading(false);

    if (result.error) {
      toast({ title: "Error", description: result.error });
      return;
    }

    clearDraft();
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-soft-white">Post a Listing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your listing in a few easy steps
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  className="flex flex-col items-center"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all",
                      currentStep > step.id
                        ? "border-accent-gold bg-accent-gold text-background"
                        : currentStep === step.id
                        ? "border-accent-gold text-accent-gold"
                        : "border-white/20 text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-1.5 text-[10px] font-medium hidden sm:block",
                      currentStep >= step.id
                        ? "text-soft-white"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-6 sm:w-12 lg:w-16 transition-colors",
                      currentStep > step.id ? "bg-accent-gold" : "bg-white/10"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Category */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-soft-white mb-1">
                Choose a category
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select the category that best describes your item
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((cat: CategoryItem) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      updateForm({ categoryId: cat.id, categoryName: cat.name })
                    }
                    className={cn(
                      "rounded-lg border p-4 text-left transition-all",
                      formData.categoryId === cat.id
                        ? "border-accent-gold bg-accent-gold/5 ring-1 ring-accent-gold/30"
                        : "border-white/[0.08] bg-surface hover:border-white/20"
                    )}
                  >
                    <p className="text-sm font-medium text-soft-white">
                      {cat.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {cat.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-soft-white mb-1">
                Item details
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Provide information about what you are selling
              </p>

              <div className="space-y-2">
                <Label className="text-soft-white">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  placeholder="What are you selling?"
                  maxLength={100}
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.title.length}/100
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-soft-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  placeholder="Describe your item in detail. Include brand, model, size, color, etc."
                  rows={5}
                  maxLength={2000}
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.description.length}/2000
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-soft-white">Price</Label>
                <PriceInput
                  value={formData.price}
                  currency={formData.currency}
                  onValueChange={(v) => updateForm({ price: v })}
                  onCurrencyChange={(c) => updateForm({ currency: c })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-soft-white">Condition</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => updateForm({ condition: cond.value })}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all",
                        formData.condition === cond.value
                          ? "border-accent-gold bg-accent-gold/5 ring-1 ring-accent-gold/30"
                          : "border-white/[0.08] bg-surface hover:border-white/20"
                      )}
                    >
                      <p className="text-sm font-medium text-soft-white">
                        {cond.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {cond.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-soft-white mb-1">
                Add photos
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Add up to 10 photos. The first photo will be the cover image.
              </p>

              <ImageUpload
                images={formData.images}
                onChange={(imgs) => updateForm({ images: imgs })}
                maxImages={10}
              />

              <Card className="mt-4 border-white/[0.06] bg-elevated/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Camera className="h-5 w-5 text-accent-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-soft-white">
                        Tips for great photos
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                        <li>Use good lighting and a clean background</li>
                        <li>Show the item from multiple angles</li>
                        <li>Include close-ups of any details or defects</li>
                        <li>Make the first photo your best one</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Location & Contact */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-soft-white mb-1">
                Location & Contact
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Help buyers find and contact you
              </p>

              <div className="space-y-2">
                <Label className="text-soft-white">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => updateForm({ location: e.target.value })}
                  placeholder="e.g. Phnom Penh, Siem Reap"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-soft-white">Contact Name</Label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => updateForm({ contactName: e.target.value })}
                  placeholder="Your name"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-soft-white">Contact Phone</Label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => updateForm({ contactPhone: e.target.value })}
                  type="tel"
                  placeholder="+855 XX XXX XXXX"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-lg font-semibold text-soft-white mb-1">
                Review your listing
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Check everything looks good before publishing
              </p>

              <div className="space-y-4">
                {/* Category */}
                <ReviewSection
                  label="Category"
                  value={formData.categoryName || "Not selected"}
                  onEdit={() => goToStep(1)}
                />

                {/* Details */}
                <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-soft-white">Details</h3>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="text-xs text-accent-gold hover:text-accent-gold/80"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="text-soft-white font-medium">{formData.title || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="text-accent-gold font-medium">
                        {formData.price ? `${formData.currency === "KHR" ? "" : "$"}${formData.price} ${formData.currency}` : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="text-soft-white capitalize">{formData.condition}</span>
                    </div>
                    {formData.description && (
                      <div className="pt-2 border-t border-white/[0.06]">
                        <p className="text-muted-foreground text-xs line-clamp-3">
                          {formData.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos */}
                <ReviewSection
                  label="Photos"
                  value={
                    formData.images.length > 0
                      ? `${formData.images.length} photo${formData.images.length !== 1 ? "s" : ""}`
                      : "No photos added"
                  }
                  onEdit={() => goToStep(3)}
                />

                {/* Contact */}
                <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-soft-white">Location & Contact</h3>
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="text-xs text-accent-gold hover:text-accent-gold/80"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="text-soft-white">{formData.location || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-soft-white">{formData.contactName || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="text-soft-white">{formData.contactPhone || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-6">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="border-white/10"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={saveDraft}
              className="text-muted-foreground hover:text-soft-white"
            >
              <Save className="mr-1.5 h-4 w-4" />
              Save Draft
            </Button>

            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-accent-gold text-background hover:bg-accent-gold/90"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handlePublish}
                disabled={loading || !formData.title || !formData.price}
                className="bg-accent-gold text-background hover:bg-accent-gold/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Publish Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-surface p-4">
      <div>
        <p className="text-sm font-medium text-soft-white">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-xs text-accent-gold hover:text-accent-gold/80"
      >
        Edit
      </button>
    </div>
  );
}
