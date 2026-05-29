import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that are always publicly accessible
const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/auth/callback",
  "/auth/reset-password",
  "/marketplace",
  "/about",
  "/terms",
  "/privacy",
];

// Routes that require authentication
const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/marketplace/checkout",
  "/settings",
  "/messages",
  "/wallet",
];

// Routes that require completed verification
const VERIFICATION_REQUIRED_PREFIXES = [
  "/marketplace/checkout",
  "/dashboard/seller",
  "/dashboard/listings",
];

function isPublicRoute(pathname: string): boolean {
  // Exact match for public routes
  if (PUBLIC_ROUTES.includes(pathname)) return true;

  // Allow marketplace browsing (but not checkout)
  if (pathname.startsWith("/marketplace") && !pathname.startsWith("/marketplace/checkout")) {
    return true;
  }

  return false;
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

function requiresVerification(pathname: string): boolean {
  return VERIFICATION_REQUIRED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

export async function middleware(request: NextRequest) {
  // Update the session (refresh tokens if needed)
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Skip auth checks for public routes
  if (isPublicRoute(pathname)) {
    return response;
  }

  // For protected routes, check if user is authenticated
  if (isProtectedRoute(pathname)) {
    // The session update handles token refresh; check for auth cookie presence
    const hasAuthCookie = request.cookies.getAll().some(
      (cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
    );

    if (!hasAuthCookie) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // For verification-required routes, redirect to verify if not verified
    if (requiresVerification(pathname)) {
      // Note: Full verification check requires a DB call, which is handled
      // at the page level. Middleware provides the first line of defense.
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
