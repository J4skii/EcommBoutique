"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setError("No reset token found. Please request a new password reset link.")
    }
  }, [token])

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null
    if (pwd.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" }
    if (pwd.length < 8) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" }
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/))
      return { label: "Strong", color: "bg-green-500", width: "w-full" }
    return { label: "Good", color: "bg-yellow-400", width: "w-3/4" }
  }

  const strength = passwordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Password Updated!</CardTitle>
            <CardDescription>Your password has been reset successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              All existing sessions have been signed out for your security. Please sign in with your new password.
            </p>
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700"
              onClick={() => router.push("/auth/login")}
            >
              Sign In Now
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error" && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 text-sm">{error}</p>
            <Button asChild className="w-full bg-pink-600 hover:bg-pink-700">
              <Link href="/auth/forgot-password">Request New Reset Link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 rounded-full p-3">
              <Lock className="h-8 w-8 text-pink-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription>Choose a strong password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {strength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-gray-500">{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={
                  confirmPassword && confirmPassword !== password
                    ? "border-red-300 focus:ring-red-300"
                    : ""
                }
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={isLoading || !password || password !== confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
