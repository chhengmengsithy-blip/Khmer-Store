"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

interface AuthResult {
  error?: string;
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
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

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
