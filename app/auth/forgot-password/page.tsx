"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {submitted ? (
          <>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check Your Inbox</CardTitle>
              <CardDescription>We've sent a reset link to your email</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                If <strong>{email}</strong> is registered with Paitons Boutique, you'll receive a
                password reset link within a few minutes.
              </p>
              <p className="text-gray-500 text-sm">
                The link expires in <strong>1 hour</strong>. Check your spam folder if you don't see it.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </Button>
              <Button asChild variant="ghost" className="w-full text-sm">
                <Link href="/auth/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Mail className="h-8 w-8 text-pink-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Forgot Password?</CardTitle>
              <CardDescription>
                No worries — enter your email and we'll send you a reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be the email linked to your account
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-500 hover:text-pink-600 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  Don't have an email on your account?{" "}
                  <Link href="/contact" className="text-pink-600 hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
