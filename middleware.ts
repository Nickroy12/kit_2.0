import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware:
 * 1. Checks if unauthenticated visitors try to access /dashboard routes
 * 2. Redirects unauthenticated visitors to /auth/signin
 * 3. Deep role authorization (e.g. admin check) is handled by requireRole() on the server
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Better-Auth session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // If not authenticated, redirect to sign-in page
    if (!sessionToken) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
