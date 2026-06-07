export type VariantType = "color" | "size" | "custom_text"

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export interface Variant {
  id: string
  product_id: string
  variant_type: VariantType
  variant_name: string
  variant_value: string
  color_hex?: string | null
  price_modifier: number
  stock_quantity: number
  is_available: boolean
  display_order: number
  sku_suffix?: string | null
  created_at: string
  updated_at: string
}

export interface VariantCombination {
  id: string
  product_id: string
  color_variant_id: string | null
  size_variant_id: string | null
  sku: string | null
  price_modifier: number
  stock_quantity: number
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  storage_path: string | null
  alt_text: string | null
  is_primary: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface VariantGroup {
  colors: Variant[]
  sizes: Variant[]
  customText: Variant[]
  combinations: VariantCombination[]
}

export type CreateVariantInput = Omit<Variant, "id" | "product_id" | "created_at" | "updated_at">

export type UpdateVariantInput = Partial<Omit<Variant, "id" | "product_id" | "variant_type" | "created_at" | "updated_at">>

export type CreateImageInput = Omit<ProductImage, "id" | "product_id" | "created_at" | "updated_at">

export type UpdateImageInput = Partial<Omit<ProductImage, "id" | "product_id" | "created_at" | "updated_at">>
