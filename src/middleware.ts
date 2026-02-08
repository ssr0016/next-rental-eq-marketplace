import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const isPrivateRoute =
      request.nextUrl.pathname.startsWith("/user") ||
      request.nextUrl.pathname.startsWith("/admin");

    // if the token is not present andthe route is private, redirect to login
    if (!accessToken && isPrivateRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // if token is present and the route is not private, redirect to dashboard
    if (accessToken && !isPrivateRoute) {
      const role = request.cookies.get("role")?.value;
      const redirect =
        role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      return NextResponse.redirect(new URL(redirect, request.url));
    }
  } catch (error) {
    console.log("Middleware error", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
