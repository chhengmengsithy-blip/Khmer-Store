"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(listingId: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Not configured", favorited: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required", favorited: false };

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("favorites")
      .insert({ user_id: user.id, listing_id: listingId });
  }

  revalidatePath("/dashboard");
  return { favorited: !existing, error: null };
}

export async function getUserFavorites() {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("favorites")
    .select("*, listings(*)")
    .eq("user_id", user.id);
  return data || [];
}

export async function isFavorited(listingId: string) {
  const supabase = await createClient();
  if (!supabase) return false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .single();
  return !!data;
}
