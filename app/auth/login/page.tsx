"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CustomerLoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Phone login
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  // Email login
  const [email, setEmail] = useState("")
  const [emailPassword, setEmailPassword] = useState("")

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    let digits = input.replace(/\D/g, "")
    
    // Handle South African numbers
    if (digits.startsWith("0")) {
      digits = "27" + digits.substring(1)
    } else if (!digits.startsWith("27") && digits.length > 0) {
      // Assume it's a local number without 0
      digits = "27" + digits
    }
    
    return digits
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formattedPhone = formatPhoneNumber(phone)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("customer_token", data.token)
        localStorage.setItem("customer_id", data.customer.id)
        localStorage.setItem("customer_phone", data.customer.phone || "")
        localStorage.setItem("customer_email", data.customer.email || "")
        localStorage.setItem("customer_name", `${data.customer.first_name} ${data.customer.last_name}`)
        
        window.dispatchEvent(new Event("auth-changed"))
        router.push("/")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: emailPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("customer_token", data.token)
        localStorage.setItem("customer_id", data.customer.id)
        localStorage.setItem("customer_phone", data.customer.phone || "")
        localStorage.setItem("customer_email", data.customer.email || "")
        localStorage.setItem("customer_name", `${data.customer.first_name} ${data.customer.last_name}`)
        
        window.dispatchEvent(new Event("auth-changed"))
        router.push("/")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Paitons Boutique account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phone">Phone Number</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="082 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your South African cellphone number
                  </p>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In with Phone"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emailPassword">Password</Label>
                  <Input
                    id="emailPassword"
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In with Email"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-pink-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
