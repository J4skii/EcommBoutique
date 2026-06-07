"use client"

import { useState } from "react"
import { Plus, Trash2, Loader2, ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Variant, VariantType } from "@/lib/types/variants"
import { formatPrice, formatPriceModifier, COLOR_PRESETS, SIZE_PRESETS, validateVariant } from "@/lib/variants"

interface VariantBuilderProps {
  productId: string
  basePrice: number
  variants: Variant[]
  onVariantAdd?: (variant: Omit<Variant, "id" | "product_id" | "created_at" | "updated_at">) => Promise<void>
  onVariantUpdate?: (variantId: string, updates: Partial<Variant>) => Promise<void>
  onVariantDelete?: (variantId: string) => Promise<void>
  disabled?: boolean
}

const EMPTY_FORM = {
  variant_type: "color" as VariantType,
  variant_name: "",
  variant_value: "",
  color_hex: "#000000",
  price_modifier: 0,
  stock_quantity: 0,
  is_available: true,
  display_order: 0,
  sku_suffix: "",
}

export function VariantBuilder({
  productId,
  basePrice,
  variants,
  onVariantAdd,
  onVariantUpdate,
  onVariantDelete,
  disabled = false,
}: VariantBuilderProps) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [showForm, setShowForm] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Variant>>({})

  const colors = variants.filter((v) => v.variant_type === "color")
  const sizes = variants.filter((v) => v.variant_type === "size")
  const customTexts = variants.filter((v) => v.variant_type === "custom_text")

  async function handleAdd() {
    const errors = validateVariant(form)
    if (errors.length > 0) { setError(errors.join(", ")); return }

    setSubmitting(true)
    setError(null)
    try {
      await onVariantAdd?.({
        ...form,
        variant_value: form.variant_type === "color" ? (form.color_hex ?? form.variant_value) : form.variant_value,
      })
      setForm({ ...EMPTY_FORM })
      setShowForm(false)
    } catch (e: any) {
      setError(e.message ?? "Failed to add variant")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(variantId: string) {
    if (!confirm("Delete this variant?")) return
    setLoadingId(variantId)
    setError(null)
    try {
      await onVariantDelete?.(variantId)
    } catch (e: any) {
      setError(e.message ?? "Failed to delete variant")
    } finally {
      setLoadingId(null)
    }
  }

  async function handleUpdate(variantId: string) {
    setLoadingId(variantId)
    setError(null)
    try {
      await onVariantUpdate?.(variantId, editForm)
      setEditingId(null)
      setEditForm({})
    } catch (e: any) {
      setError(e.message ?? "Failed to update variant")
    } finally {
      setLoadingId(null)
    }
  }

  function startEdit(variant: Variant) {
    setEditingId(variant.id)
    setEditForm({
      variant_name: variant.variant_name,
      price_modifier: variant.price_modifier,
      stock_quantity: variant.stock_quantity,
      is_available: variant.is_available,
    })
  }

  const finalPrice = basePrice + (form.price_modifier ?? 0)

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Colors */}
      <VariantSection
        title="Colors"
        variants={colors}
        editingId={editingId}
        editForm={editForm}
        loadingId={loadingId}
        basePrice={basePrice}
        onEdit={startEdit}
        onCancelEdit={() => { setEditingId(null); setEditForm({}) }}
        onSaveEdit={(id) => handleUpdate(id)}
        onDelete={handleDelete}
        onEditFormChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
        disabled={disabled}
        renderExtra={(v) => (
          <span
            className="inline-block w-4 h-4 rounded-full border border-gray-200 mr-1"
            style={{ background: v.color_hex ?? v.variant_value }}
          />
        )}
      />

      {/* Sizes */}
      <VariantSection
        title="Sizes"
        variants={sizes}
        editingId={editingId}
        editForm={editForm}
        loadingId={loadingId}
        basePrice={basePrice}
        onEdit={startEdit}
        onCancelEdit={() => { setEditingId(null); setEditForm({}) }}
        onSaveEdit={(id) => handleUpdate(id)}
        onDelete={handleDelete}
        onEditFormChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
        disabled={disabled}
      />

      {/* Custom Text */}
      <VariantSection
        title="Custom Text Options"
        variants={customTexts}
        editingId={editingId}
        editForm={editForm}
        loadingId={loadingId}
        basePrice={basePrice}
        onEdit={startEdit}
        onCancelEdit={() => { setEditingId(null); setEditForm({}) }}
        onSaveEdit={(id) => handleUpdate(id)}
        onDelete={handleDelete}
        onEditFormChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
        disabled={disabled}
      />

      {/* Add New Variant Form */}
      {!disabled && (
        <Card>
          <CardHeader
            className="cursor-pointer py-3"
            onClick={() => setShowForm((p) => !p)}
          >
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Variant
              </span>
              {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>

          {showForm && (
            <CardContent className="space-y-4 pt-0">
              {/* Type */}
              <div>
                <Label className="text-xs mb-1 block">Variant Type</Label>
                <div className="flex gap-2">
                  {(["color", "size", "custom_text"] as VariantType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((p) => ({ ...p, variant_type: t }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        form.variant_type === t
                          ? "bg-pink-500 text-white border-pink-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      {t === "custom_text" ? "Custom Text" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              {form.variant_type === "color" && (
                <div>
                  <Label className="text-xs mb-1 block">Quick Select</Label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c.hex}
                        title={c.name}
                        onClick={() => setForm((p) => ({ ...p, variant_name: c.name, variant_value: c.hex, color_hex: c.hex }))}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                          form.color_hex === c.hex ? "border-pink-500 scale-110" : "border-gray-200"
                        }`}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={form.color_hex}
                      onChange={(e) => setForm((p) => ({ ...p, color_hex: e.target.value, variant_value: e.target.value }))}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs text-gray-500">{form.color_hex}</span>
                  </div>
                </div>
              )}

              {/* Size Presets */}
              {form.variant_type === "size" && (
                <div>
                  <Label className="text-xs mb-1 block">Quick Select</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {SIZE_PRESETS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm((p) => ({ ...p, variant_name: s, variant_value: s }))}
                        className={`px-2.5 py-1 rounded border text-xs font-medium transition-all ${
                          form.variant_name === s
                            ? "bg-pink-500 text-white border-pink-500"
                            : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Name *</Label>
                  <Input
                    placeholder={form.variant_type === "color" ? "Red" : form.variant_type === "size" ? "Large" : "Monogram"}
                    value={form.variant_name}
                    onChange={(e) => setForm((p) => ({ ...p, variant_name: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                {form.variant_type !== "color" && (
                  <div>
                    <Label className="text-xs mb-1 block">Value *</Label>
                    <Input
                      placeholder={form.variant_type === "size" ? "L" : "Custom text label"}
                      value={form.variant_value}
                      onChange={(e) => setForm((p) => ({ ...p, variant_value: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block">Price Modifier (R)</Label>
                  <Input
                    type="number"
                    value={form.price_modifier}
                    onChange={(e) => setForm((p) => ({ ...p, price_modifier: Number(e.target.value) }))}
                    className="text-sm"
                  />
                  {form.price_modifier !== 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Final price: {formatPrice(finalPrice)}
                      {" "}({formatPriceModifier(form.price_modifier)})
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Stock Quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={(e) => setForm((p) => ({ ...p, stock_quantity: Number(e.target.value) }))}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => { setShowForm(false); setForm({ ...EMPTY_FORM }) }}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={submitting}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  Add Variant
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}

function VariantSection({
  title,
  variants,
  editingId,
  editForm,
  loadingId,
  basePrice,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditFormChange,
  disabled,
  renderExtra,
}: {
  title: string
  variants: Variant[]
  editingId: string | null
  editForm: Partial<Variant>
  loadingId: string | null
  basePrice: number
  onEdit: (v: Variant) => void
  onCancelEdit: () => void
  onSaveEdit: (id: string) => void
  onDelete: (id: string) => void
  onEditFormChange: (key: string, value: any) => void
  disabled: boolean
  renderExtra?: (v: Variant) => React.ReactNode
}) {
  if (variants.length === 0) return null

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center justify-between">
          {title}
          <Badge variant="outline" className="text-xs">{variants.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {variants.map((v) => (
          <div key={v.id} className="border rounded-lg p-3 text-sm">
            {editingId === v.id ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={editForm.variant_name ?? ""}
                      onChange={(e) => onEditFormChange("variant_name", e.target.value)}
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Price Mod (R)</Label>
                    <Input
                      type="number"
                      value={editForm.price_modifier ?? 0}
                      onChange={(e) => onEditFormChange("price_modifier", Number(e.target.value))}
                      className="text-xs h-7"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      value={editForm.stock_quantity ?? 0}
                      onChange={(e) => onEditFormChange("stock_quantity", Number(e.target.value))}
                      className="text-xs h-7"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onCancelEdit}>Cancel</Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => onSaveEdit(v.id)}
                    disabled={loadingId === v.id}
                  >
                    {loadingId === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderExtra?.(v)}
                  <span className="font-medium">{v.variant_name}</span>
                  {v.price_modifier !== 0 && (
                    <span className={`text-xs ${v.price_modifier > 0 ? "text-green-600" : "text-red-500"}`}>
                      {formatPriceModifier(v.price_modifier)}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">Stock: {v.stock_quantity}</span>
                  {!v.is_available && <Badge variant="outline" className="text-xs text-red-500">Unavailable</Badge>}
                </div>
                {!disabled && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => onEdit(v)}>Edit</Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
                      onClick={() => onDelete(v.id)}
                      disabled={loadingId === v.id}
                    >
                      {loadingId === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
