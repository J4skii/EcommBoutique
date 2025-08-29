import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database types
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  image_urls: string[] | null
  stock_quantity: number
  category: string
  colors: string[] | null
  sizes: string[] | null
  is_featured: boolean
  is_active: boolean
  sku: string | null
  weight_grams: number | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  customer_email: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string | null
  subtotal: number
  shipping_cost: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  is_custom_order: boolean
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  selected_color: string | null
  selected_size: string | null
}

export interface CustomOrderRequest {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  colors: string[]
  size: string
  quantity: number
  special_requests: string | null
  is_rush_order: boolean
  status: "submitted" | "quoted" | "approved" | "in_progress" | "completed" | "cancelled"
  estimated_price: number | null
  created_at: string
}
