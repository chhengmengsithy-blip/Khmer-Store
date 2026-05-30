import { type NextRequest, NextResponse } from "next/server";
import { updateSession, isSupabaseConfigured } from "@/lib/supabase/middleware";

// Routes that are always publicly accessible
const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/marketplace",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/auth/callback",
  "/forgot-password",
  "/reset-password",
  "/verify",
];

// Routes that require authentication
const PROTECTED_ROUTE_PREFIXES = ["/dashboard", "/messages", "/post", "/admin"];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;

  // Allow category browsing
  if (pathname.startsWith("/category")) return true;

  // Allow marketplace browsing
  if (pathname.startsWith("/marketplace")) return true;

  // Allow auth callback paths
  if (pathname.startsWith("/auth/callback")) return true;

  return false;
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) =>
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

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  addSecurityHeaders(response);

  // Skip auth checks for public routes
  if (isPublicRoute(pathname)) {
    return response;
  }

  // For protected routes, check if user is authenticated
  if (isProtectedRoute(pathname)) {
    // If Supabase is not configured, allow access (preview mode)
    if (!isSupabaseConfigured()) {
      return response;
    }

    const hasAuthCookie = request.cookies
      .getAll()
      .some(
        (cookie) =>
          cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
      );

    if (!hasAuthCookie) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
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
