import crypto from "crypto"

const SECRET = process.env.APP_SECRET || "paitons_boutique_secure_token_secret_2025"

function b64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function fromB64url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4
  return Buffer.from(pad ? padded + "=".repeat(4 - pad) : padded, "base64").toString("utf-8")
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex")
}

export function createToken(
  data: Record<string, unknown>,
  expiresInSeconds: number
): string {
  const payload = b64url(
    JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + expiresInSeconds })
  )
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const dot = token.lastIndexOf(".")
    if (dot === -1) return null
    const payload = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    if (sign(payload) !== sig) return null
    const data = JSON.parse(fromB64url(payload))
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch {
    return null
  }
}
