"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface AuthResult {
  error?: string;
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult | undefined> {
  const supabase = await createClient();

  if (!supabase) {
    return { error: "Authentication service is not configured." };
  }

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

  if (!supabase) {
    return { error: "Authentication service is not configured." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/verify");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/sign-in");
  }
  await supabase.auth.signOut();
  redirect("/sign-in");
}

export async function resetPassword({
  email,
}: {
  email: string;
}): Promise<AuthResult | undefined> {
  const supabase = await createClient();

  if (!supabase) {
    return { error: "Authentication service is not configured." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/auth/reset-password`,
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

  if (!supabase) {
    return { error: "Authentication service is not configured." };
  }

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
