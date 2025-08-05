import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Protected routes
        const protectedPaths = ["/dashboard", "/groups", "/messages", "/analytics", "/settings"];
        const isProtectedPath = protectedPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        );

        if (isProtectedPath && !token) {
          return false;
        }

        // Admin only routes
        const adminPaths = ["/settings/users", "/analytics/export"];
        const isAdminPath = adminPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        );

        if (isAdminPath && token?.role !== "admin") {
          return false;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/groups/:path*",
    "/messages/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};