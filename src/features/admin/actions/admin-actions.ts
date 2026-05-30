"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, error: "Not configured" };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase: null, error: "Not authenticated" };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin")
    return { supabase: null, error: "Not authorized" };
  return { supabase, error: null };
}

export async function getAdminStats() {
  const { supabase } = await verifyAdmin();
  if (!supabase)
    return {
      totalUsers: 0,
      totalListings: 0,
      activeListings: 0,
      pendingReports: 0,
    };

  const [usersRes, listingsRes, activeRes, reportsRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    totalUsers: usersRes.count || 0,
    totalListings: listingsRes.count || 0,
    activeListings: activeRes.count || 0,
    pendingReports: reportsRes.count || 0,
  };
}

export async function getAllUsers(page = 1, search?: string) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { data: [], count: 0 };

  const pageSize = 20;
  const from = (page - 1) * pageSize;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" });
  if (search) query = query.ilike("full_name", `%${search}%`);
  query = query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  const { data, count } = await query;
  return { data: data || [], count: count || 0 };
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  // Prevent admin from demoting themselves
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && user.id === userId) {
    return { error: "You cannot change your own role" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { error: null };
}

export async function deleteUser(userId: string) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { error: null };
}

export async function getAllListings(page = 1, status?: string) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { data: [], count: 0 };

  const pageSize = 20;
  const from = (page - 1) * pageSize;

  let query = supabase
    .from("listings")
    .select("*", { count: "exact" });
  if (status && status !== "all") query = query.eq("status", status);
  query = query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  const { data, count } = await query;
  if (!data) return { data: [], count: count || 0 };

  // Fetch related profiles and categories
  const userIds = [...new Set(data.map((l) => l.user_id))];
  const categoryIds = [...new Set(data.map((l) => l.category_id).filter(Boolean))] as string[];

  const [profilesRes, categoriesRes] = await Promise.all([
    userIds.length > 0
      ? supabase.from("profiles").select("id, full_name").in("id", userIds)
      : { data: [] },
    categoryIds.length > 0
      ? supabase.from("categories").select("id, name").in("id", categoryIds)
      : { data: [] },
  ]);

  const profileMap = new Map(
    (profilesRes.data || []).map((p) => [p.id, p.full_name])
  );
  const categoryMap = new Map(
    (categoriesRes.data || []).map((c) => [c.id, c.name])
  );

  const enriched = data.map((listing) => ({
    ...listing,
    seller_name: profileMap.get(listing.user_id) || "Unknown",
    category_name: listing.category_id ? categoryMap.get(listing.category_id) || "-" : "-",
  }));

  return { data: enriched, count: count || 0 };
}

export async function updateListingStatus(listingId: string, status: string) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId);
  if (error) return { error: error.message };

  revalidatePath("/admin/listings");
  return { error: null };
}

export async function adminDeleteListing(listingId: string) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId);
  if (error) return { error: error.message };

  revalidatePath("/admin/listings");
  return { error: null };
}

export async function getAllCategories() {
  const { supabase } = await verifyAdmin();
  if (!supabase) return [];

  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("order_index");
  return data || [];
}

export async function createCategory(data: {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  const { data: last } = await supabase
    .from("categories")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const order_index = (last?.order_index || 0) + 1;

  const { error } = await supabase
    .from("categories")
    .insert({ ...data, order_index });
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { error: null };
}

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string; icon?: string; description?: string }
) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  const { error } = await supabase
    .from("categories")
    .update(data)
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { error: null };
}

export async function deleteCategory(id: string) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { error: null };
}

export async function reorderCategories(orderedIds: string[]) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("categories")
      .update({ order_index: i + 1 })
      .eq("id", orderedIds[i]);
  }

  revalidatePath("/admin/categories");
  return { error: null };
}

export async function getAllReports(status?: string) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return [];

  let query = supabase
    .from("reports")
    .select("*");
  if (status && status !== "all") query = query.eq("status", status);
  query = query.order("created_at", { ascending: false });

  const { data } = await query;
  if (!data || data.length === 0) return [];

  // Fetch related profiles and listings
  const reporterIds = [...new Set(data.map((r) => r.reporter_id))];
  const listingIds = [...new Set(data.map((r) => r.listing_id))];

  const [profilesRes, listingsRes] = await Promise.all([
    reporterIds.length > 0
      ? supabase.from("profiles").select("id, full_name").in("id", reporterIds)
      : { data: [] },
    listingIds.length > 0
      ? supabase.from("listings").select("id, title").in("id", listingIds)
      : { data: [] },
  ]);

  const profileMap = new Map(
    (profilesRes.data || []).map((p) => [p.id, p.full_name])
  );
  const listingMap = new Map(
    (listingsRes.data || []).map((l) => [l.id, l.title])
  );

  return data.map((report) => ({
    ...report,
    reporter_name: profileMap.get(report.reporter_id) || "Unknown",
    listing_title: listingMap.get(report.listing_id) || null,
  }));
}

export async function updateReportStatus(
  reportId: string,
  status: "resolved" | "dismissed"
) {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Not authorized" };

  const { error } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId);
  if (error) return { error: error.message };

  revalidatePath("/admin/reports");
  return { error: null };
}

export async function getRecentListings() {
  const { supabase } = await verifyAdmin();
  if (!supabase) return [];

  const { data } = await supabase
    .from("listings")
    .select("id, title, status, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data) return [];

  // Fetch seller names separately
  const userIds = [...new Set(data.map((l) => l.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles || []).map((p) => [p.id, p.full_name])
  );

  return data.map((listing) => ({
    ...listing,
    seller_name: profileMap.get(listing.user_id) || "Unknown",
  }));
}
