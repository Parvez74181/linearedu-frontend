import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (e.g., /public/images)
     * - including the API auth routes (so we don't block auth requests)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth/).*)",
  ],
};

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public and protected routes
  const isPublicRoute = ["/login", "/signup", "/"].includes(path);
  const isProtectedRoute = ["/dashboard", "/user"].includes(path);

  // Get the session cookie from the request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const sessionCookie = cookieStore.get("better-auth.session_token")?.value;

  // Function to validate the session by calling Express backend
  const validateSession = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/me`, {
        headers: {
          cookie: cookieHeader,
        },
      });

      return response.ok; // Returns true if status is 200-299
    } catch (error) {
      console.error("Session validation failed:", error);
      return false;
    }
  };

  // Check if the user has a valid session
  let isAuthenticated = false;
  if (sessionCookie) {
    isAuthenticated = await validateSession();
  }

  // Handle protected routes - Redirect to login if not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    // Add redirect path for after login
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle public routes - Redirect to dashboard if already authenticated
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to continue if no conditions are met
  return NextResponse.next();
}
