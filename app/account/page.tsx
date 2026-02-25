import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AccountPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // Read-only here
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login/customer')
  }

  // Fetch orders by email (linking strategy since we might not have user_id in orders table yet if they checked out as guest with same email, or we updated it)
  // Ideally, orders should have user_id. Let's assume we link by email for now or user_id if we update checkout.
  // checkout.ts doesn't save user_id currently. We should probably update checkout to save user_id if logged in.

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.customerEmail, user.email!),
    orderBy: [desc(orders.createdAt)],
    with: {
        items: true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600">Welcome back, {user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
             {/* We need a signout route or client component. Using Link for now to a route we'll create or client comp */}
             <Button variant="outline" asChild>
                 <Link href="/auth/signout">Sign Out</Link>
             </Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex flex-col sm:flex-row justify-between mb-4">
                    <div>
                      <p className="font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="font-medium">R{order.totalAmount}</p>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                      {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.productName} {item.variantName ? `(${item.variantName})` : ''}</span>
                              <span>R{item.totalPrice}</span>
                          </div>
                      ))}
                  </div>
                </div>
              ))}
              {userOrders.length === 0 && (
                <p className="text-gray-500 text-center py-8">You haven't placed any orders yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
