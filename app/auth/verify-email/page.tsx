"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error" | "resend">("loading")
  const [message, setMessage] = useState("")
  const [resendEmail, setResendEmail] = useState("")
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus("resend")
      return
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success")
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed")
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Something went wrong. Please try again.")
      })
  }, [token])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setResending(true)
    try {
      await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      })
      setResendSuccess(true)
    } catch {}
    setResending(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-16 w-16 text-pink-400 animate-spin" />}
            {status === "success" && (
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100 rounded-full p-4">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            )}
            {status === "resend" && (
              <div className="bg-pink-100 rounded-full p-4">
                <Mail className="h-12 w-12 text-pink-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Link Expired"}
            {status === "resend" && "Verify Your Email"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <p className="text-gray-500">Checking your verification link...</p>
          )}

          {status === "success" && (
            <>
              <p className="text-gray-600">
                Your email address has been verified. Your account is fully active!
              </p>
              <Button asChild className="w-full bg-pink-600 hover:bg-pink-700">
                <Link href="/auth/login">Continue to Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/products">Browse the Collection</Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <p className="text-gray-600">{message}</p>
              <p className="text-gray-500 text-sm">Request a new link below.</p>

              {resendSuccess ? (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                  New verification email sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3 text-left">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-300"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={resending}
                  >
                    {resending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Resend Verification Email
                  </Button>
                </form>
              )}

              <Button asChild variant="ghost" className="w-full text-sm">
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
            </>
          )}

          {status === "resend" && (
            <>
              <p className="text-gray-600">
                Enter your email address and we'll send you a new verification link.
              </p>

              {resendSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">
                  Check your inbox! A new verification link is on its way.
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3 text-left">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-300"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={resending}
                  >
                    {resending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Send Verification Email
                  </Button>
                </form>
              )}

              <Button asChild variant="ghost" className="w-full text-sm">
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
