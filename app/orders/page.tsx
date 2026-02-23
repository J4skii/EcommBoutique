"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock orders data
const mockOrders = [
  {
    id: "MON-1704123456",
    date: "2024-01-15",
    status: "delivered",
    total: 95,
    items: [
      {
        name: "Classic Rose Bow",
        quantity: 2,
        price: 45,
        image_url: "/placeholder.svg?height=60&width=60",
      },
    ],
    tracking_number: "TN123456789",
    estimated_delivery: "2024-01-20",
  },
  {
    id: "MON-1704123457",
    date: "2024-01-10",
    status: "shipped",
    total: 48,
    items: [
      {
        name: "Forest Green Bow",
        quantity: 1,
        price: 48,
        image_url: "/placeholder.svg?height=60&width=60",
      },
    ],
    tracking_number: "TN123456790",
    estimated_delivery: "2024-01-18",
  },
  {
    id: "MON-1704123458",
    date: "2024-01-08",
    status: "processing",
    total: 140,
    items: [
      {
        name: "Royal Purple Bow",
        quantity: 2,
        price: 52,
        image_url: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Ocean Blue Bow",
        quantity: 1,
        price: 46,
        image_url: "/placeholder.svg?height=60&width=60",
      },
    ],
    estimated_delivery: "2024-01-25",
  },
]

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

export default function OrdersPage() {
  const [orders] = useState(mockOrders)

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
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      {order.tracking_number && <p>Tracking: {order.tracking_number}</p>}
                      {order.estimated_delivery && (
                        <p>Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">R{order.total.toFixed(2)}</p>
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
