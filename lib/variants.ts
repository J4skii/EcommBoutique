import type { Variant, VariantCombination, VariantGroup, StockStatus } from "@/lib/types/variants"

export function groupVariantsByType(variants: Variant[]): VariantGroup {
  return {
    colors: variants.filter((v) => v.variant_type === "color").sort((a, b) => a.display_order - b.display_order),
    sizes: variants.filter((v) => v.variant_type === "size").sort((a, b) => a.display_order - b.display_order),
    customText: variants.filter((v) => v.variant_type === "custom_text").sort((a, b) => a.display_order - b.display_order),
    combinations: [],
  }
}

export function sortVariants(variants: Variant[]): Variant[] {
  return [...variants].sort((a, b) => a.display_order - b.display_order)
}

export function calculateVariantPrice(basePrice: number, selectedVariants: Variant[]): number {
  const modifier = selectedVariants.reduce((sum, v) => sum + (v.price_modifier ?? 0), 0)
  return Math.max(0, basePrice + modifier)
}

export function getPriceModifier(variant: Variant): number {
  return variant.price_modifier ?? 0
}

export function formatPrice(amount: number): string {
  return `R${amount.toFixed(2)}`
}

export function formatPriceModifier(modifier: number): string {
  if (modifier === 0) return ""
  return modifier > 0 ? `+R${modifier.toFixed(2)}` : `-R${Math.abs(modifier).toFixed(2)}`
}

export function generateSKU(productId: string, ...variants: Variant[]): string {
  const parts = [productId.slice(-6).toUpperCase()]
  for (const v of variants) {
    parts.push(v.variant_value.toUpperCase().slice(0, 4))
  }
  return parts.join("-")
}

export function createSKULabel(...variants: Variant[]): string {
  return variants.map((v) => v.variant_name).join(", ")
}

export function generateVariantCombinations(colors: Variant[], sizes: Variant[]): Array<{
  color: Variant
  size: Variant
  label: string
}> {
  const combinations: Array<{ color: Variant; size: Variant; label: string }> = []
  for (const color of colors) {
    for (const size of sizes) {
      combinations.push({
        color,
        size,
        label: `${color.variant_name} / ${size.variant_name}`,
      })
    }
  }
  return combinations
}

export function isStockAvailable(combination: VariantCombination, quantity = 1): boolean {
  return combination.is_available && combination.stock_quantity >= quantity
}

export function getStockStatus(quantity: number, lowThreshold = 5): StockStatus {
  if (quantity <= 0) return "out_of_stock"
  if (quantity <= lowThreshold) return "low_stock"
  return "in_stock"
}

export function validateVariant(variant: Partial<Variant>): string[] {
  const errors: string[] = []
  if (!variant.variant_type) errors.push("Variant type is required")
  if (!variant.variant_name?.trim()) errors.push("Variant name is required")
  if (!variant.variant_value?.trim()) errors.push("Variant value is required")
  if (variant.price_modifier !== undefined && isNaN(Number(variant.price_modifier))) {
    errors.push("Price modifier must be a number")
  }
  if (variant.stock_quantity !== undefined && (isNaN(Number(variant.stock_quantity)) || Number(variant.stock_quantity) < 0)) {
    errors.push("Stock quantity must be a non-negative number")
  }
  if (variant.variant_type === "color" && variant.color_hex) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(variant.color_hex)) {
      errors.push("Color hex must be a valid hex color (e.g. #FF0000)")
    }
  }
  return errors
}

export function validateCustomText(text: string, maxLength = 50): string | null {
  if (!text.trim()) return "Custom text cannot be empty"
  if (text.length > maxLength) return `Custom text cannot exceed ${maxLength} characters`
  return null
}

export const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

export const COLOR_PRESETS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Green", hex: "#22C55E" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Gold", hex: "#F59E0B" },
  { name: "Silver", hex: "#9CA3AF" },
  { name: "Brown", hex: "#92400E" },
  { name: "Cream", hex: "#FEF3C7" },
]
