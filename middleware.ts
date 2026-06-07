import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/accept-invite", "/admin/forgot-password"]

function isSessionExpired(token: string): boolean {
  try {
    if (!token.startsWith("admin_")) return true
    const data = Buffer.from(token.slice(6), "base64").toString("utf-8")
    const payload = JSON.parse(data)
    return Date.now() > payload.expiresAt
  } catch {
    return true
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/admin")) return NextResponse.next()

  // Allow public admin paths through
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get("admin_session")?.value

  if (!token || !token.startsWith("admin_")) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (isSessionExpired(token)) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url))
    response.cookies.delete("admin_session")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
