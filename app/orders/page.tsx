"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, Eye, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "processing":
      return <Clock className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Get customer info from localStorage
const getCustomerId = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("customer_id")
}

const getCustomerEmail = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("customer_email")
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const customerId = getCustomerId()
      const customerEmail = getCustomerEmail()

      // If no customer info, show empty state
      if (!customerId && !customerEmail) {
        setOrders([])
        setLoading(false)
        return
      }

      try {
        let url = "/api/orders?"
        if (customerId) {
          url += `customer_id=${customerId}`
        } else if (customerEmail) {
          url += `customer_email=${encodeURIComponent(customerEmail)}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
          setOrders(data.orders || [])
        } else {
          setError(data.error || "Failed to load orders")
        }
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
            <span className="ml-3 text-gray-600">Loading your orders...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="border-red-200">
            <CardContent className="py-8 text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4 bg-pink-600 hover:bg-pink-700">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-pink-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                    <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.order_items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={item.products?.image_url || item.image_url || "/placeholder.svg"}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} {item.selected_color && `• ${item.selected_color}`} {item.selected_size && `• ${item.selected_size}`}
                          </p>
                        </div>
                        <p className="font-medium">R{(item.unit_price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {order.shipping_address && (
                        <p>Shipping to: {order.shipping_address.city || "See details"}</p>
                      )}
                      {order.payment_reference && (
                        <p>Payment Ref: {order.payment_reference}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        R{order.total_amount?.toFixed(2) || order.total?.toFixed(2)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" className="border-pink-200 text-pink-600 bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {order.status === "shipped" && order.tracking_number && (
                          <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping for beautiful handcrafted bows!</p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700 rounded-full">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
