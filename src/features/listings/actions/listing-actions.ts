"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Listing } from "@/types";

export async function getListings(params?: {
  search?: string;
  category?: string;
  sort?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  if (!supabase) return { data: [], error: null };

  let query = supabase.from("listings").select("*").eq("status", "active");

  if (params?.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }
  if (params?.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (params?.sort === "price-asc")
    query = query.order("price", { ascending: true });
  else if (params?.sort === "price-desc")
    query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  if (params?.limit) query = query.limit(params.limit);

  const { data, error } = await query;
  return { data: (data as Listing[]) || [], error: error?.message || null };
}

export async function getListingById(id: string) {
  const supabase = await createClient();
  if (!supabase) return { data: null, error: null };

  const { data, error } = await supabase
    .from("listings")
    .select("*, profiles(*), categories(*)")
    .eq("id", id)
    .single();

  return { data, error: error?.message || null };
}

export async function createListing(formData: FormData) {
  const supabase = await createClient();
  if (!supabase)
    return { data: null, error: "Please configure Supabase environment variables" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "You must be signed in to post a listing" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const currency = (formData.get("currency") as string) || "USD";
  const condition = (formData.get("condition") as string) || "used";
  const location = formData.get("location") as string;
  const contact_phone = formData.get("contact_phone") as string;
  const contact_name = formData.get("contact_name") as string;
  const category_id = formData.get("category_id") as string;

  const images: string[] = [];
  const imageFiles = formData.getAll("images") as File[];
  for (const file of imageFiles) {
    if (file.size === 0) continue;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("listings")
      .upload(path, file);
    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("listings")
        .getPublicUrl(path);
      images.push(urlData.publicUrl);
    }
  }

  const { data, error } = await supabase
    .from("listings")
    .insert({
      user_id: user.id,
      title,
      description,
      price,
      currency,
      condition,
      location,
      contact_phone,
      contact_name,
      category_id: category_id || null,
      images,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };

  revalidatePath("/marketplace");
  return { data, error: null };
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = await createClient();
  if (!supabase)
    return { error: "Please configure Supabase environment variables" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in" };

  const updates: Record<string, unknown> = {};
  const fields = [
    "title",
    "description",
    "price",
    "currency",
    "condition",
    "location",
    "contact_phone",
    "contact_name",
    "category_id",
    "status",
  ];
  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null)
      updates[field] = field === "price" ? parseFloat(value as string) : value;
  }

  const { error } = await supabase
    .from("listings")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/marketplace");
  revalidatePath(`/listing/${id}`);
  return { error: null };
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  if (!supabase)
    return { error: "Please configure Supabase environment variables" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in" };

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/marketplace");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function incrementViews(id: string) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.rpc("increment_views", { listing_id: id });
}

export async function getCategories() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("order_index");
  return data || [];
}

export async function getUserListings() {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return (data as Listing[]) || [];
}
