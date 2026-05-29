import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side role check utility for admin pages.
 *
 * Call this at the top of admin page server components or in server actions
 * to enforce role-based access control with a real database lookup.
 * This is the authoritative check - the middleware cookie check is only a
 * first-pass optimization.
 *
 * Usage in a server component:
 *   const user = await requireAdminRole();
 *
 * Returns the user record if authorized, or redirects to /dashboard if not.
 */
export async function requireAdminRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: userExtended } = await supabase
    .from("users_extended")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (
    !userExtended ||
    (userExtended.role !== "admin" && userExtended.role !== "super_admin")
  ) {
    redirect("/dashboard");
  }

  return { ...user, role: userExtended.role, extendedId: userExtended.id };
}

/**
 * Server-side role check for seller-restricted pages.
 *
 * Returns the user record if authorized, or redirects to /dashboard if not.
 */
export async function requireSellerRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: userExtended } = await supabase
    .from("users_extended")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (
    !userExtended ||
    (userExtended.role !== "seller" &&
      userExtended.role !== "admin" &&
      userExtended.role !== "super_admin")
  ) {
    redirect("/dashboard");
  }

  return { ...user, role: userExtended.role, extendedId: userExtended.id };
}
