"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Truck, CheckCircle, Clock, Loader2, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  selected_color: string | null
  selected_size: string | null
  products?: { name: string; image_url: string | null }
}

interface Order {
  id: string
  order_number: string
  customer_email: string
  total_amount: number
  subtotal: number
  shipping_cost: number
  status: string
  payment_status: string
  created_at: string
  tracking_number?: string
  shipping_address?: any
  order_items: OrderItem[]
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
    case "confirmed":
      return <Clock className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "processing":
    case "confirmed":
      return "bg-yellow-100 text-yellow-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    // Auto-load orders if we have an email in localStorage
    const savedEmail = localStorage.getItem("customer_email")
    if (savedEmail) {
      setEmail(savedEmail)
      setSearchEmail(savedEmail)
    }
  }, [])

  useEffect(() => {
    if (searchEmail) {
      fetchOrders(searchEmail)
    }
  }, [searchEmail])

  const fetchOrders = async (customerEmail: string) => {
    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(customerEmail)}`)
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      localStorage.setItem("customer_email", email.trim())
      setSearchEmail(email.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4">
            Your <span className="font-semibold text-pink-600">Orders</span>
          </h1>
          <p className="text-gray-600">Track and manage your beautiful bow orders</p>
        </div>

        {/* Email lookup form */}
        {!searchEmail && (
          <Card className="border-pink-100 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-pink-600" />
                Look Up Your Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter the email used when ordering"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-pink-200"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                    Find Orders
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {searchEmail && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing orders for <span className="font-medium text-pink-600">{searchEmail}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-pink-200 text-pink-600 bg-transparent"
              onClick={() => {
                setSearchEmail("")
                setOrders([])
                setSearched(false)
              }}
            >
              Change Email
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-10 w-10 text-pink-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-8 text-red-600">{error}</div>
        )}

        {!loading && searched && orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              No orders found for this email address. Make sure you used the same email when ordering.
            </p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-pink-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    {order.payment_status && (
                      <Badge variant={order.payment_status === "paid" ? "default" : "outline"} className="text-xs">
                        {order.payment_status === "paid" ? "Paid" : order.payment_status}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.order_items?.map((item, index) => (
                      <div key={item.id || index} className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.products?.image_url || "/placeholder.svg"}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <div className="text-xs text-gray-600 space-x-2">
                            {item.selected_color && <span>Color: {item.selected_color}</span>}
                            {item.selected_size && <span>Size: {item.selected_size}</span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="font-medium text-sm">R{item.total_price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="flex justify-between items-end pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {order.tracking_number && (
                        <p>Tracking: <span className="font-medium">{order.tracking_number}</span></p>
                      )}
                      {order.shipping_address && (
                        <p className="mt-1">
                          Shipping to: {order.shipping_address.city}, {order.shipping_address.province}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Subtotal: R{order.subtotal?.toFixed(2)}</p>
                        <p>Shipping: {order.shipping_cost === 0 ? "Free" : `R${order.shipping_cost?.toFixed(2)}`}</p>
                      </div>
                      <p className="font-semibold text-lg text-pink-600 mt-1">R{order.total_amount.toFixed(2)}</p>
                      {order.status === "shipped" && order.tracking_number && (
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700 mt-2">
                          <Truck className="h-3 w-3 mr-1" />
                          Track Package
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
