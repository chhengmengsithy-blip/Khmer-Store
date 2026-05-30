"use server";

import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  success?: boolean;
  productId?: string;
  error?: string;
}

/**
 * Generate a URL-safe slug from a title string.
 * Appends a timestamp suffix for uniqueness.
 */
function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const suffix = Date.now().toString(36);
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

  const price = parseFloat(priceRaw || "0");
  if (isNaN(price) || price <= 0) {
    return { error: "Price must be greater than zero." };
  }

  const stock = parseInt(stockRaw || "0", 10);
  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a non-negative number." };
  }

  const slug = generateSlug(title);

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
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true, productId: product.id };
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

  // Upgrade role from buyer to seller
  if (extUser.role === "buyer") {
    const { error: roleError } = await supabase
      .from("users_extended")
      .update({ role: "seller" })
      .eq("id", extUser.id);

    if (roleError) {
      return { error: roleError.message };
    }
  }

  return { success: true };
}
