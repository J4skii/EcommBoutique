"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Star, Edit2, Eye, GripVertical, Loader2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { ProductImage } from "@/lib/types/variants"

interface ProductImageGalleryProps {
  productId: string
  images: ProductImage[]
  onImageDelete?: (imageId: string) => Promise<void>
  onImageUpdate?: (imageId: string, updates: Partial<ProductImage>) => Promise<void>
  onReorder?: (orderedImages: ProductImage[]) => Promise<void>
  disabled?: boolean
}

export function ProductImageGallery({
  productId,
  images,
  onImageDelete,
  onImageUpdate,
  onReorder,
  disabled = false,
}: ProductImageGalleryProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null)
  const [editingAlt, setEditingAlt] = useState<string | null>(null)
  const [altText, setAltText] = useState("")
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  async function handleDelete(imageId: string) {
    if (!onImageDelete) return
    if (!confirm("Delete this image?")) return
    setLoadingId(imageId)
    setError(null)
    try {
      await onImageDelete(imageId)
    } catch (e: any) {
      setError(e.message ?? "Failed to delete image")
    } finally {
      setLoadingId(null)
    }
  }

  async function handleSetPrimary(imageId: string) {
    if (!onImageUpdate) return
    setLoadingId(imageId)
    setError(null)
    try {
      await onImageUpdate(imageId, { is_primary: true })
    } catch (e: any) {
      setError(e.message ?? "Failed to set primary image")
    } finally {
      setLoadingId(null)
    }
  }

  async function handleSaveAlt(imageId: string) {
    if (!onImageUpdate) return
    setLoadingId(imageId)
    setError(null)
    try {
      await onImageUpdate(imageId, { alt_text: altText })
      setEditingAlt(null)
    } catch (e: any) {
      setError(e.message ?? "Failed to save alt text")
    } finally {
      setLoadingId(null)
    }
  }

  function handleDragStart(imageId: string) {
    setDraggedId(imageId)
  }

  function handleDragOver(e: React.DragEvent, imageId: string) {
    e.preventDefault()
    setDragOverId(imageId)
  }

  async function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    if (!draggedId || draggedId === targetId || !onReorder) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const reordered = [...images]
    const fromIdx = reordered.findIndex((img) => img.id === draggedId)
    const toIdx = reordered.findIndex((img) => img.id === targetId)
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)

    const withOrder = reordered.map((img, i) => ({ ...img, display_order: i }))
    setDraggedId(null)
    setDragOverId(null)

    try {
      await onReorder(withOrder)
    } catch (e: any) {
      setError(e.message ?? "Failed to reorder images")
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
        No images yet. Upload images to get started.
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            draggable={!disabled}
            onDragStart={() => handleDragStart(image.id)}
            onDragOver={(e) => handleDragOver(e, image.id)}
            onDrop={(e) => handleDrop(e, image.id)}
            onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
            className={`relative group rounded-lg border-2 overflow-hidden bg-gray-50 transition-all ${
              dragOverId === image.id ? "border-pink-400 scale-105" : "border-gray-200"
            } ${draggedId === image.id ? "opacity-50" : ""}`}
          >
            {/* Drag handle */}
            {!disabled && (
              <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-gray-400">
                <GripVertical className="w-4 h-4" />
              </div>
            )}

            {/* Primary badge */}
            {image.is_primary && (
              <Badge className="absolute top-1 right-1 z-10 bg-pink-500 text-white text-xs px-1 py-0">
                Primary
              </Badge>
            )}

            {/* Image */}
            <div className="aspect-square relative">
              <Image
                src={image.image_url}
                alt={image.alt_text ?? "Product image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            {/* Loading overlay */}
            {loadingId === image.id && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
              </div>
            )}

            {/* Actions */}
            {!disabled && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-around p-1">
                <button
                  title="Preview"
                  onClick={() => setPreviewImage(image)}
                  className="text-white hover:text-pink-300 p-1"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {!image.is_primary && (
                  <button
                    title="Set as primary"
                    onClick={() => handleSetPrimary(image.id)}
                    className="text-white hover:text-yellow-300 p-1"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  title="Edit alt text"
                  onClick={() => { setEditingAlt(image.id); setAltText(image.alt_text ?? "") }}
                  className="text-white hover:text-blue-300 p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  title="Delete image"
                  onClick={() => handleDelete(image.id)}
                  className="text-white hover:text-red-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Alt text editor modal */}
      {editingAlt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-lg mb-4">Edit Alt Text</h3>
            <p className="text-sm text-gray-500 mb-3">
              Alt text describes the image for screen readers and SEO.
            </p>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Red faux leather hair bow"
              className="mb-4"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditingAlt(null)}>Cancel</Button>
              <Button
                onClick={() => handleSaveAlt(editingAlt)}
                disabled={loadingId === editingAlt}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                {loadingId === editingAlt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-pink-300"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={previewImage.image_url}
              alt={previewImage.alt_text ?? "Preview"}
              width={800}
              height={800}
              className="object-contain rounded-lg max-h-[85vh] w-auto mx-auto"
            />
            {previewImage.alt_text && (
              <p className="text-white text-center mt-2 text-sm">{previewImage.alt_text}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
