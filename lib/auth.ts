import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/database"
import type { AdminUser, UserRole } from "@/lib/rbac"

const SESSION_COOKIE = "admin_session"
const SESSION_DURATION_DAYS = 30

export interface SessionPayload {
  userId: string
  email: string
  role: UserRole
  expiresAt: number
}

function encodeSession(payload: SessionPayload): string {
  return `admin_${Buffer.from(JSON.stringify(payload)).toString("base64")}`
}

function decodeSession(token: string): SessionPayload | null {
  try {
    if (!token.startsWith("admin_")) return null
    const data = Buffer.from(token.slice(6), "base64").toString("utf-8")
    return JSON.parse(data) as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(user: AdminUser): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt,
  }

  const token = encodeSession(payload)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
  })

  // Update last_login_at in DB
  await supabaseAdmin
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id)

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const payload = decodeSession(token)
  if (!payload) return null

  if (Date.now() > payload.expiresAt) {
    await clearSession()
    return null
  }

  return payload
}

export async function refreshSession(): Promise<void> {
  const session = await getSession()
  if (!session) return

  const { data: user } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, role, is_active")
    .eq("id", session.userId)
    .eq("is_active", true)
    .single()

  if (!user) {
    await clearSession()
    return
  }

  const newPayload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  }

  const token = encodeSession(newPayload)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const session = await getSession()
  if (!session) return null

  const { data: user } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, first_name, last_name, role, is_active, last_login_at")
    .eq("id", session.userId)
    .eq("is_active", true)
    .single()

  return user ?? null
}
