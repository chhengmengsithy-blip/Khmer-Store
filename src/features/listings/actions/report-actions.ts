"use server";

import { createClient } from "@/lib/supabase/server";

export async function createReport(
  listingId: string,
  reason: string,
  description?: string
) {
  const supabase = await createClient();
  if (!supabase) return { error: "Not configured" };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    listing_id: listingId,
    reason,
    description: description || null,
  });

  return { error: error?.message || null };
}
