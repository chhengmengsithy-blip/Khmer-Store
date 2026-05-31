"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleFavorite(
  productId: string
): Promise<{ isFavorited: boolean; error?: string }> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { isFavorited: false, error: "You must be signed in." };
  }

  // Get users_extended.id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { isFavorited: false, error: "User profile not found." };
  }

  // Check if favorite exists
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", extUser.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Delete the favorite
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return { isFavorited: true, error: "Failed to remove favorite." };
    }
    return { isFavorited: false };
  } else {
    // Insert new favorite
    const { error: insertError } = await supabase.from("favorites").insert({
      user_id: extUser.id,
      product_id: productId,
    });

    if (insertError) {
      return { isFavorited: false, error: "Failed to add favorite." };
    }
    return { isFavorited: true };
  }
}

export async function getUserFavorites() {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  // Get users_extended.id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return [];
  }

  // Query favorites joined with products
  const { data: favorites, error } = await supabase
    .from("favorites")
    .select(
      `
      id,
      product_id,
      products!inner(id, name, price, seller_id, image_urls)
    `
    )
    .eq("user_id", extUser.id);

  if (error || !favorites) {
    return [];
  }

  return favorites.map((fav) => {
    const product = fav.products as unknown as {
      id: string;
      name: string;
      price: number;
      seller_id: string;
      image_urls: string[] | null;
    };
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      seller: product.seller_id,
      rating: 0,
      image: product.image_urls?.[0] || null,
    };
  });
}

export async function checkIsFavorited(productId: string): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return false;
  }

  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return false;
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", extUser.id)
    .eq("product_id", productId)
    .single();

  return !!existing;
}
