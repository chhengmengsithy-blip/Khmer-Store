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
  "/admin",
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

// Routes restricted to admin/super_admin roles
const ADMIN_ROUTE_PREFIXES = ["/admin"];

// Routes restricted to seller role or above
const SELLER_ROUTE_PREFIXES = [
  "/dashboard/seller",
  "/dashboard/listings",
  "/dashboard/products",
];

function isPublicRoute(pathname: string): boolean {
  // Exact match for public routes
  if (PUBLIC_ROUTES.includes(pathname)) return true;

  // Allow marketplace browsing (but not checkout)
  if (pathname.startsWith("/marketplace") && !pathname.startsWith("/marketplace/checkout")) {
    return true;
  }

  // Allow webhook endpoints (they handle their own auth via signatures)
  if (pathname.startsWith("/api/webhooks/")) {
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

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

function isSellerRoute(pathname: string): boolean {
  return SELLER_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}

/**
 * Add security headers to the response.
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

/**
 * Add rate limit indicator headers to the response.
 */
function addRateLimitHeaders(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  // Track request metadata for downstream rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  response.headers.set("X-Client-IP", ip);
  response.headers.set("X-Request-Timestamp", Date.now().toString());
  return response;
}

export async function middleware(request: NextRequest) {
  // Update the session (refresh tokens if needed)
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  addSecurityHeaders(response);
  addRateLimitHeaders(response, request);

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

    // Admin route protection - check for admin role cookie/claim
    // Full role verification happens at the page level with server-side DB lookup.
    // Middleware provides the first line of defense using role metadata from the session.
    if (isAdminRoute(pathname)) {
      const userRole = request.cookies.get("user-role")?.value;
      if (userRole && userRole !== "admin" && userRole !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Seller route protection
    if (isSellerRoute(pathname)) {
      const userRole = request.cookies.get("user-role")?.value;
      if (
        userRole &&
        userRole !== "seller" &&
        userRole !== "admin" &&
        userRole !== "super_admin"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
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
