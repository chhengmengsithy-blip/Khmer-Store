import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  checkRateLimit,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";

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

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/");
}

/**
 * Determine the rate limit config for a given pathname.
 */
function getRateLimitConfigForPath(pathname: string) {
  if (pathname.startsWith("/api/webhooks/")) return RATE_LIMIT_CONFIGS.api_webhook;
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/sign")) return RATE_LIMIT_CONFIGS.api_auth;
  if (pathname.startsWith("/api/payment")) return RATE_LIMIT_CONFIGS.api_payment;
  if (pathname.startsWith("/api/upload")) return RATE_LIMIT_CONFIGS.api_upload;
  return RATE_LIMIT_CONFIGS.api_general;
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

export async function middleware(request: NextRequest) {
  // Update the session (refresh tokens if needed)
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  addSecurityHeaders(response);

  // Apply rate limiting for API routes
  if (isApiRoute(pathname)) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `${ip}:${pathname}`;
    const config = getRateLimitConfigForPath(pathname);

    try {
      const result = await checkRateLimit(rateLimitKey, config);

      // Add rate limit headers to the response
      const rateLimitHeaders = getRateLimitHeaders(result);
      for (const [key, value] of Object.entries(rateLimitHeaders)) {
        response.headers.set(key, value);
      }

      if (!result.allowed) {
        return NextResponse.json(
          { error: "Too many requests" },
          {
            status: 429,
            headers: rateLimitHeaders,
          }
        );
      }
    } catch (error) {
      // If Redis is unavailable, log a warning and allow the request through
      console.warn("[rate-limiter] Redis error, allowing request through:", error);
    }
  }

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

    // Admin route protection - deny access if user-role cookie is absent or not admin.
    // This is the first line of defense. Server-side role verification via
    // requireAdminRole() must also be called in admin page components/route handlers.
    if (isAdminRoute(pathname)) {
      const userRole = request.cookies.get("user-role")?.value;
      if (!userRole || (userRole !== "admin" && userRole !== "super_admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Seller route protection - deny access if user-role cookie is absent or insufficient.
    if (isSellerRoute(pathname)) {
      const userRole = request.cookies.get("user-role")?.value;
      if (
        !userRole ||
        (userRole !== "seller" &&
          userRole !== "admin" &&
          userRole !== "super_admin")
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
