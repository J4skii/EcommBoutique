import { getAdminProducts, getAdminOrders, getAdminStats } from "@/lib/admin"
import AdminDashboardClient from "./dashboard-client"

export default async function AdminPage() {
  const products = await getAdminProducts()
  const orders = await getAdminOrders()
  const stats = await getAdminStats()

  // Serialize dates to strings to avoid "Date object not supported" warning/error
  const serializedProducts = products.map(p => ({
    ...p,
    price: p.price.toString(), // Decimal to string
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  const serializedOrders = orders.map(o => ({
    ...o,
    subtotal: o.subtotal.toString(),
    totalAmount: o.totalAmount.toString(),
    shippingCost: o.shippingCost.toString(),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    items: o.items.map(i => ({
        ...i,
        unitPrice: i.unitPrice.toString(),
        totalPrice: i.totalPrice.toString(),
    }))
  }))

  return <AdminDashboardClient initialProducts={serializedProducts} initialOrders={serializedOrders} stats={stats} />
}
