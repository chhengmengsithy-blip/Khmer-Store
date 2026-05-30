import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback handler.
 *
 * Supabase redirects here after the user clicks the confirmation link in the
 * sign-up email (and for OAuth / magic-link flows). It carries a one-time
 * `code` query param that must be exchanged for a session, otherwise the
 * email is never confirmed and the account effectively cannot be used.
 *
 * Flow:
 *   1. Read the `code` from the URL.
 *   2. Exchange it for a session (this sets the auth cookies via the SSR client).
 *   3. Redirect the user onward (defaults to /dashboard, or `next` if provided).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Optional post-login destination, defaults to the dashboard.
  const next = searchParams.get("next") ?? "/dashboard";

  // Surface Supabase-provided errors (e.g. expired/invalid link).
  const authError = searchParams.get("error_description") ?? searchParams.get("error");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(error.message)}`
    );
  }

  // No code present — send back to sign-in with whatever error we have.
  return NextResponse.redirect(
    `${origin}/sign-in?error=${encodeURIComponent(
      authError ?? "Invalid or missing confirmation code."
    )}`
  );
}
