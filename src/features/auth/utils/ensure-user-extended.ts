import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ensure a `users_extended` row exists for the given user.
 *
 * Uses upsert with `onConflict: "auth_user_id"` to avoid race conditions
 * when two auth paths fire concurrently for the same user.
 *
 * Returns the user's role string (defaults to "buyer" on failure).
 */
export async function ensureUserExtended(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  // Try to fetch the existing row first
  const { data } = await supabase
    .from("users_extended")
    .select("role")
    .eq("auth_user_id", userId)
    .single();

  if (data?.role) {
    return data.role;
  }

  // Row does not exist - upsert to handle concurrent inserts safely
  const { data: upserted, error } = await supabase
    .from("users_extended")
    .upsert(
      { auth_user_id: userId, role: "buyer" },
      { onConflict: "auth_user_id" }
    )
    .select("role")
    .single();

  if (error) {
    console.error(
      `[ensureUserExtended] Failed to upsert users_extended for user ${userId}:`,
      error
    );
  }

  return upserted?.role ?? "buyer";
}
