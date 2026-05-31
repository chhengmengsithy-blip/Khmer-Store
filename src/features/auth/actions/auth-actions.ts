"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

interface AuthResult {
  error?: string;
}

/** Cookie options for the user-role cookie. */
const ROLE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  // 7 days — will be refreshed on every sign-in
  maxAge: 60 * 60 * 24 * 7,
};

/**
 * Query the user's role from users_extended and persist it as a cookie
 * so middleware can gate admin/seller routes without a DB call.
 */
async function setUserRoleCookie(userId: string): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users_extended")
    .select("role")
    .eq("auth_user_id", userId)
    .single();

  let role = data?.role;

  // Auto-create users_extended row if it does not exist
  if (!role) {
    const { data: inserted } = await supabase
      .from("users_extended")
      .insert({ auth_user_id: userId, role: "buyer" })
      .select("role")
      .single();
    role = inserted?.role ?? "buyer";
  }

  const cookieStore = await cookies();
  cookieStore.set("user-role", role, ROLE_COOKIE_OPTIONS);
}

/**
 * Clear the user-role cookie (called on sign-out).
 */
async function clearUserRoleCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("user-role");
}

/**
 * Resolve the public site origin for building absolute redirect URLs
 * (e.g. Supabase `emailRedirectTo`, which must be an absolute URL).
 *
 * Order of preference:
 *   1. NEXT_PUBLIC_APP_URL env var (matches .env.example).
 *   2. The incoming request's `origin` header.
 *   3. The `host` header with an inferred protocol.
 */
async function getSiteUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult | undefined> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Set user-role cookie so middleware can gate admin/seller routes
  if (data.user) {
    await setUserRoleCookie(data.user.id);
  }

  redirect("/dashboard");
}

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult | undefined> {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/verify");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearUserRoleCookie();
  redirect("/sign-in");
}

export async function resetPassword({
  email,
}: {
  email: string;
}): Promise<AuthResult | undefined> {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return undefined;
}

export async function verifyOtp({
  phone,
  token,
}: {
  phone: string;
  token: string;
}): Promise<AuthResult | undefined> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return { error: error.message };
  }

  // Set user-role cookie so middleware can gate admin/seller routes
  if (data.user) {
    await setUserRoleCookie(data.user.id);
  }

  redirect("/dashboard");
}
