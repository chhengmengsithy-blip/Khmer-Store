"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  );
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    const data = await getAllCategories();
    setCategories(data as CategoryItem[]);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setFormIcon("");
    setFormDescription("");
  }

  function openAddDialog() {
    resetForm();
    setShowAddDialog(true);
  }

  function openEditDialog(cat: CategoryItem) {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon || "");
    setFormDescription(cat.description || "");
  }

  async function handleAdd() {
    setSaving(true);
    const result = await createCategory({
      name: formName,
      slug: formSlug || slugify(formName),
      icon: formIcon || undefined,
      description: formDescription || undefined,
    });
    if (!result.error) {
      await loadCategories();
      setShowAddDialog(false);
      resetForm();
    }
    setSaving(false);
  }

  async function handleEdit() {
    if (!editingCategory) return;
    setSaving(true);
    const result = await updateCategory(editingCategory.id, {
      name: formName,
      slug: formSlug,
      icon: formIcon || undefined,
      description: formDescription || undefined,
    });
    if (!result.error) {
      await loadCategories();
      setEditingCategory(null);
      resetForm();
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
          <h1 className="text-2xl font-playfair text-soft-white">
            Categories
          </h1>
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

      <Card className="border-white/[0.08] bg-surface">
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
                  className="flex items-center justify-between py-3 px-4 rounded-lg bg-elevated/50 border border-white/[0.05]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-accent-gold/10 flex items-center justify-center text-xs text-accent-gold">
                      {cat.icon || cat.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-soft-white font-medium truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{cat.slug}
                        {cat.description && ` - ${cat.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categories.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-surface border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-soft-white">
              Add Category
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  setFormSlug(slugify(e.target.value));
                }}
                placeholder="Category name"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="category-slug"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="Icon name (e.g. car, phone)"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
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
              onClick={() => setShowAddDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={saving || !formName}
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              {saving ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent className="bg-surface border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-soft-white">
              Edit Category
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Category name"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="category-slug"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon</Label>
              <Input
                id="edit-icon"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                placeholder="Icon name"
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
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
              onClick={() => setEditingCategory(null)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={saving || !formName}
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
