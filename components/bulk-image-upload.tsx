"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Upload, X, Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductImage } from "@/lib/types/variants"

interface FileState {
  file: File
  preview: string
  status: "pending" | "uploading" | "done" | "error"
  progress: number
  url?: string
  error?: string
}

interface BulkImageUploadProps {
  productId: string
  bucket?: string
  folder?: string
  onUploadComplete?: (images: ProductImage[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  maxFileSize?: number
  disabled?: boolean
}

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export function BulkImageUpload({
  productId,
  bucket = "product-images",
  folder,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxFileSize = 10,
  disabled = false,
}: BulkImageUploadProps) {
  const [files, setFiles] = useState<FileState[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const resolvedFolder = folder ?? `products/${productId}`

  function addFiles(incoming: File[]) {
    const remaining = maxFiles - files.length
    if (remaining <= 0) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`)
      return
    }

    const toAdd = incoming.slice(0, remaining)
    const newStates: FileState[] = []

    for (const file of toAdd) {
      if (!ALLOWED.includes(file.type)) {
        onUploadError?.(`"${file.name}" is not a supported image type`)
        continue
      }
      if (file.size > maxFileSize * 1024 * 1024) {
        onUploadError?.(`"${file.name}" exceeds ${maxFileSize}MB`)
        continue
      }
      newStates.push({
        file,
        preview: URL.createObjectURL(file),
        status: "pending",
        progress: 0,
      })
    }

    setFiles((prev) => [...prev, ...newStates])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    addFiles(Array.from(e.dataTransfer.files))
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(Array.from(e.target.files))
    e.target.value = ""
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      const copy = [...prev]
      URL.revokeObjectURL(copy[index].preview)
      copy.splice(index, 1)
      return copy
    })
  }

  async function uploadOne(index: number): Promise<string | null> {
    const state = files[index]
    if (!state || state.status === "done") return state?.url ?? null

    setFiles((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], status: "uploading", progress: 20 }
      return copy
    })

    try {
      const formData = new FormData()
      formData.append("file", state.file)
      formData.append("bucket", bucket)
      formData.append("folder", resolvedFolder)

      const res = await fetch("/api/upload", { method: "POST", body: formData })

      setFiles((prev) => {
        const copy = [...prev]
        copy[index] = { ...copy[index], progress: 80 }
        return copy
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Upload failed")
      }

      const data = await res.json()
      const url: string = data.urls?.[0] ?? data.url

      setFiles((prev) => {
        const copy = [...prev]
        copy[index] = { ...copy[index], status: "done", progress: 100, url }
        return copy
      })

      return url
    } catch (e: any) {
      setFiles((prev) => {
        const copy = [...prev]
        copy[index] = { ...copy[index], status: "error", progress: 0, error: e.message }
        return copy
      })
      return null
    }
  }

  async function uploadAll() {
    const pending = files.map((f, i) => ({ ...f, index: i })).filter((f) => f.status !== "done")
    const results: ProductImage[] = []

    for (const { index } of pending) {
      const url = await uploadOne(index)
      if (url) {
        // Register with the images API
        try {
          const res = await fetch(`/api/products/${productId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: url,
              storage_path: `${resolvedFolder}/${url.split("/").pop()}`,
              is_primary: false,
            }),
          })
          if (res.ok) {
            const data = await res.json()
            results.push(data.data)
          }
        } catch {
          // Image uploaded but not registered — still report the URL
        }
      }
    }

    if (results.length > 0) {
      onUploadComplete?.(results)
    }
  }

  async function retryFile(index: number) {
    setFiles((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], status: "pending", error: undefined, progress: 0 }
      return copy
    })
    await uploadOne(index)
  }

  const pending = files.filter((f) => f.status === "pending").length
  const done = files.filter((f) => f.status === "done").length
  const errors = files.filter((f) => f.status === "error").length
  const uploading = files.filter((f) => f.status === "uploading").length

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={() => !disabled && setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? "border-pink-400 bg-pink-50" : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">
          {dragging ? "Drop images here" : "Drag & drop images, or click to browse"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPEG, PNG, WebP • Max {maxFileSize}MB each • Up to {maxFiles} files
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled}
        />
      </div>

      {/* File Grid */}
      {files.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group rounded-lg border overflow-hidden bg-gray-50">
                <div className="aspect-square relative">
                  <Image
                    src={file.preview}
                    alt={file.file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>

                {/* Status overlay */}
                {file.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                    <div className="w-3/4 bg-white/30 rounded-full h-1.5">
                      <div
                        className="bg-white rounded-full h-1.5 transition-all"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {file.status === "done" && (
                  <div className="absolute top-1 left-1">
                    <CheckCircle className="w-5 h-5 text-green-500 drop-shadow" />
                  </div>
                )}
                {file.status === "error" && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.status === "error" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); retryFile(index) }}
                      className="bg-white rounded-full p-1 shadow text-blue-500 hover:text-blue-700"
                      title="Retry"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  )}
                  {file.status !== "uploading" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                      className="bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filename */}
                <div className="px-1.5 py-1 text-xs text-gray-500 truncate">{file.file.name}</div>

                {/* Error message */}
                {file.error && (
                  <div className="px-1.5 pb-1 text-xs text-red-500 truncate" title={file.error}>
                    {file.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary & Controls */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-sm text-gray-500">
              {done > 0 && <span className="text-green-600 font-medium">{done} uploaded</span>}
              {uploading > 0 && <span className="ml-2 text-blue-500">{uploading} uploading…</span>}
              {errors > 0 && <span className="ml-2 text-red-500">{errors} failed</span>}
              {pending > 0 && <span className="ml-2">{pending} waiting</span>}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { files.forEach((_, i) => URL.revokeObjectURL(files[i].preview)); setFiles([]) }}
                disabled={uploading > 0}
              >
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={uploadAll}
                disabled={pending === 0 && errors === 0 || uploading > 0}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                {uploading > 0 ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Uploading…</>
                ) : (
                  <><Upload className="w-4 h-4 mr-1" /> Upload {pending + errors} file{pending + errors !== 1 ? "s" : ""}</>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
