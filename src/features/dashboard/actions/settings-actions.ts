"use server";

import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  success?: boolean;
  error?: string;
}

interface ProfileResult {
  full_name: string;
  display_name: string;
  email: string;
  phone: string;
  country: string;
  bio: string;
  avatar_url: string;
  error?: string;
}

export async function getProfile(): Promise<ProfileResult | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  // Look up users_extended to get the extended user id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User record not found." };
  }

  // Fetch profile using the users_extended id
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, display_name, avatar_url, bio, phone, country")
    .eq("user_id", extUser.id)
    .single();

  return {
    full_name: profile?.full_name ?? "",
    display_name: profile?.display_name ?? "",
    email: user.email ?? "",
    phone: profile?.phone ?? "",
    country: profile?.country ?? "",
    bio: profile?.bio ?? "",
    avatar_url: profile?.avatar_url ?? "",
  };
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  // Look up users_extended to get the extended user id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User record not found." };
  }

  const full_name = (formData.get("full_name") as string) || "";
  const display_name = (formData.get("display_name") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const country = (formData.get("country") as string) || "";
  const bio = (formData.get("bio") as string) || "";

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        user_id: extUser.id,
        full_name,
        display_name,
        phone,
        country,
        bio,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (upsertError) {
    return { error: upsertError.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  // Re-authenticate by verifying current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: "Current password is incorrect." };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}
