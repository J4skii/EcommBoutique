import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check for admin session token
    const adminToken = request.cookies.get("admin_session")?.value
    
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    
    // In production, validate the token against your auth system
    // For now, we'll check if it matches the expected format
    if (!adminToken.startsWith("admin_")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
