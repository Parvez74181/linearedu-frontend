// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./actions";

// Define protected routes and auth routes
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/courses"];
const authRoutes = ["/auth/login", "/auth/signup"];
const adminRoutes = ["/dashboard"];
const teacherRoutes = ["/dashboard/teacher"];
const studentRoutes = ["/dashboard/student"];

// Role-based route mappings
const roleBaseRoutes: Record<string, string> = {
  admin: "/dashboard",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
  staff: "/dashboard",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  // Check if user is authenticated
  const isAuthenticated = session.success;
  const userRole = session.user?.role;

  // Check route types
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isTeacherRoute = teacherRoutes.some((route) => pathname.startsWith(route));
  const isStudentRoute = studentRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth routes
  if (isAuthenticated && isAuthRoute) {
    // Redirect to role-specific dashboard
    const redirectPath = roleBaseRoutes[userRole] || "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Protect admin routes - only allow admin and staff roles
  if (isAuthenticated && isAdminRoute) {
    const allowedRoles = ["admin", "staff"];
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      const redirectPath = roleBaseRoutes[userRole] || "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Protect teacher routes - only allow teacher role
  if (isAuthenticated && isTeacherRoute && userRole !== "teacher") {
    const redirectPath = roleBaseRoutes[userRole] || "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Protect student routes - only allow student role
  if (isAuthenticated && isStudentRoute && userRole !== "student") {
    const redirectPath = roleBaseRoutes[userRole] || "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For API routes, return proper error responses
  if (!isAuthenticated && pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Add role-based headers for downstream use
  const response = NextResponse.next();
  if (isAuthenticated && userRole) {
    response.headers.set("x-user-role", userRole);
  }

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
