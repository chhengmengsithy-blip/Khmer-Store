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
    return {
      error: "Please configure Supabase environment variables to use authentication",
    };
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
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResult | undefined> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      error: "Please configure Supabase environment variables to use authentication",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
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
    return {
      error: "Please configure Supabase environment variables to use authentication",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return undefined;
}
