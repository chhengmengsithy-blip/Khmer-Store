"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  success?: boolean;
  productId?: string;
  error?: string;
}

/**
 * Generate a URL-safe slug from a title string.
 * Falls back to "product" if the title contains only non-Latin characters.
 * Uses a random UUID segment as suffix for uniqueness.
 */
function generateSlug(title: string): string {
  let base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!base) {
    base = "product";
  }

  const suffix = crypto.randomUUID().slice(0, 8);
  return `${base}-${suffix}`;
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to create a product." };
  }

  // Look up users_extended to get the extended user id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  // Find the seller record for this user
  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", extUser.id)
    .single();

  if (sellerError || !seller) {
    return {
      error: "No seller record found. Please register as a seller first.",
    };
  }

  // Extract and validate form fields
  const title = formData.get("title") as string | null;
  const description = (formData.get("description") as string) || "";
  const priceRaw = formData.get("price") as string | null;
  const stockRaw = formData.get("stock") as string | null;
  const status =
    (formData.get("status") as "draft" | "published") || "draft";

  if (!title || title.trim().length === 0) {
    return { error: "Title is required." };
  }

  if (title.length > 200) {
    return { error: "Title must be 200 characters or fewer." };
  }

  if (description.length > 10000) {
    return { error: "Description must be 10,000 characters or fewer." };
  }

  const price = parseFloat(priceRaw || "0");
  if (isNaN(price) || price <= 0) {
    return { error: "Price must be greater than zero." };
  }

  const stock = parseInt(stockRaw || "0", 10);
  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a non-negative number." };
  }

  const slug = generateSlug(title);

  // Read optional category and condition for metadata
  const category = (formData.get("category") as string) || "";
  const condition = (formData.get("condition") as string) || "";

  const metadata: Record<string, string> = {};
  if (category) {
    metadata.category = category;
  }
  if (condition) {
    metadata.condition = condition;
  }

  // Look up the category_id by slug if a category was provided
  let categoryId: string | null = null;
  if (category) {
    const { data: categoryRow } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    categoryId = categoryRow?.id || null;
  }

  // Insert the product
  const { data: product, error: insertError } = await supabase
    .from("products")
    .insert({
      seller_id: seller.id,
      title: title.trim(),
      slug,
      description,
      price,
      stock,
      status,
      category_id: categoryId,
      condition: condition || null,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true, productId: product.id };
}

export async function insertProductMedia(
  productId: string,
  mediaUrls: { url: string; displayOrder: number }[]
): Promise<ActionResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to add product media." };
  }

  if (!productId || mediaUrls.length === 0) {
    return { error: "Product ID and at least one media URL are required." };
  }

  const rows = mediaUrls.map((item) => ({
    product_id: productId,
    url: item.url,
    type: "image" as const,
    display_order: item.displayOrder,
    alt_text: null,
  }));

  const { error: insertError } = await supabase
    .from("product_media")
    .insert(rows);

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true };
}

export async function registerAsSeller(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to register as a seller." };
  }

  // Look up users_extended
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  // Check if seller record already exists
  const { data: existingSeller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", extUser.id)
    .single();

  if (existingSeller) {
    return { error: "You are already registered as a seller." };
  }

  // Validate business name
  const businessName = formData.get("business_name") as string | null;
  if (!businessName || businessName.trim().length === 0) {
    return { error: "Business name is required." };
  }

  // Create seller record
  const { error: sellerInsertError } = await supabase
    .from("sellers")
    .insert({
      user_id: extUser.id,
      business_name: businessName.trim(),
    });

  if (sellerInsertError) {
    return { error: sellerInsertError.message };
  }

  // Upgrade role from buyer to seller (hardcoded to "seller" only).
  // Note: RLS allows users to update their own row without column restriction,
  // but this action only ever sets "seller" and only if current role is "buyer".
  if (extUser.role === "buyer") {
    const { error: roleError } = await supabase
      .from("users_extended")
      .update({ role: "seller" })
      .eq("id", extUser.id);

    if (roleError) {
      return { error: roleError.message };
    }

    // Refresh the user-role cookie so middleware sees the new role immediately
    const cookieStore = await cookies();
    cookieStore.set("user-role", "seller", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");
  }

  return { success: true };
}
