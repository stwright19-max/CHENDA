import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if this is an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/provider-schedule") ||
    request.nextUrl.pathname.startsWith("/staff") ||
    request.nextUrl.pathname.startsWith("/my-shifts")

  // If accessing admin routes, check if user is admin
  if (isAdminRoute) {
    if (!session) {
      // Not logged in, redirect to login
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin (for simplicity, checking email)
    const isAdmin = session.user.email === "stwright19@gmail.com" || session.user.email === "admin@example.com"

    if (!isAdmin) {
      // Not admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // If accessing protected routes and not logged in, redirect to login
  if (isProtectedRoute && !session && !isAuthRoute) {
    const redirectUrl = new URL("/auth/login", request.url)
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/provider-schedule/:path*", "/staff/:path*", "/my-shifts/:path*", "/auth/:path*"],
}
