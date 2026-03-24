import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

/**
 * GET /api/orders/by-number?order_number=PAI-...
 *
 * Returns a minimal public view of an order so the payment success page can
 * display the real payment_status from the database instead of assuming success.
 * Only non-sensitive fields (status, payment_status, payment_method, order_number,
 * total_amount) are returned.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get("order_number")

  if (!orderNumber) {
    return NextResponse.json({ error: "order_number is required" }, { status: 400 })
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("order_number, status, payment_status, payment_method, total_amount, created_at")
    .eq("order_number", orderNumber)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ order })
}
