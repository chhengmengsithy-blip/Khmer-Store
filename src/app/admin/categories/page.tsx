"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Car,
  Smartphone,
  Home,
  Shirt,
  Laptop,
  BookOpen,
  Dumbbell,
  Baby,
  Sofa,
  Music,
  Camera,
  Briefcase,
  Heart,
  ShoppingBag,
  Utensils,
  Bike,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "@/features/admin/actions/admin-actions";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  order_index: number;
}

const iconOptions = [
  { name: "car", icon: Car },
  { name: "smartphone", icon: Smartphone },
  { name: "home", icon: Home },
  { name: "shirt", icon: Shirt },
  { name: "laptop", icon: Laptop },
  { name: "book", icon: BookOpen },
  { name: "dumbbell", icon: Dumbbell },
  { name: "baby", icon: Baby },
  { name: "sofa", icon: Sofa },
  { name: "music", icon: Music },
  { name: "camera", icon: Camera },
  { name: "briefcase", icon: Briefcase },
  { name: "heart", icon: Heart },
  { name: "shopping", icon: ShoppingBag },
  { name: "utensils", icon: Utensils },
  { name: "bike", icon: Bike },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  );
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAllCategories().then((data) => {
      if (mounted) {
        setCategories(data as CategoryItem[]);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function loadCategories() {
    const data = await getAllCategories();
    setCategories(data as CategoryItem[]);
  }

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setFormIcon("");
    setFormDescription("");
  }

  function openAddDialog() {
    resetForm();
    setEditingCategory(null);
    setShowDialog(true);
  }

  function openEditDialog(cat: CategoryItem) {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon || "");
    setFormDescription(cat.description || "");
    setShowDialog(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editingCategory) {
      const result = await updateCategory(editingCategory.id, {
        name: formName,
        slug: formSlug,
        icon: formIcon || undefined,
        description: formDescription || undefined,
      });
      if (!result.error) {
        await loadCategories();
        setShowDialog(false);
        resetForm();
        setEditingCategory(null);
      }
    } else {
      const result = await createCategory({
        name: formName,
        slug: formSlug || slugify(formName),
        icon: formIcon || undefined,
        description: formDescription || undefined,
      });
      if (!result.error) {
        await loadCategories();
        setShowDialog(false);
        resetForm();
      }
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await deleteCategory(id);
    await loadCategories();
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newOrder = [...categories];
    [newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ];
    setCategories(newOrder);
    await reorderCategories(newOrder.map((c) => c.id));
  }

  async function handleMoveDown(index: number) {
    if (index === categories.length - 1) return;
    const newOrder = [...categories];
    [newOrder[index], newOrder[index + 1]] = [
      newOrder[index + 1],
      newOrder[index],
    ];
    setCategories(newOrder);
    await reorderCategories(newOrder.map((c) => c.id));
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-playfair text-soft-white">Categories</h1>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-soft-white">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {categories.length} categories
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="border-white/[0.06] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base">
            All Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No categories yet. Add one to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-elevated/30 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-accent-gold/10 flex items-center justify-center text-xs text-accent-gold shrink-0">
                      {cat.icon
                        ? (() => {
                            const iconDef = iconOptions.find(
                              (i) => i.name === cat.icon
                            );
                            if (iconDef) {
                              const IconComp = iconDef.icon;
                              return <IconComp className="h-4 w-4" />;
                            }
                            return cat.icon.charAt(0).toUpperCase();
                          })()
                        : cat.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-soft-white font-medium truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{cat.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cat.description && (
                      <Badge className="hidden sm:inline-flex bg-muted text-muted-foreground text-[10px]">
                        {cat.description}
                      </Badge>
                    )}
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === categories.length - 1}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditDialog(cat)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowDialog(false);
            setEditingCategory(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="bg-surface border-white/[0.08] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-soft-white">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!editingCategory) {
                    setFormSlug(slugify(e.target.value));
                  }
                }}
                placeholder="Category name"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="category-slug"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-1.5">
                {iconOptions.map((opt) => {
                  const IconComp = opt.icon;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setFormIcon(opt.name)}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                        formIcon === opt.name
                          ? "bg-accent-gold/20 text-accent-gold ring-1 ring-accent-gold/40"
                          : "bg-elevated text-muted-foreground hover:text-soft-white hover:bg-elevated/80"
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-description">Description</Label>
              <Input
                id="cat-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Short description"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDialog(false);
                setEditingCategory(null);
                resetForm();
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formName}
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              {saving
                ? "Saving..."
                : editingCategory
                  ? "Save Changes"
                  : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
