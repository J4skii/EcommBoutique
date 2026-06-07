import { supabase, supabaseAdmin } from "@/lib/database"

export const BUCKETS = {
  PRODUCT_IMAGES: "product-images",
  PRODUCT_VARIANTS: "product-variants",
  ADMIN_ASSETS: "admin-assets",
} as const

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS]

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface UploadResult {
  url: string
  path: string
  bucket: string
}

export interface UploadOptions {
  bucket?: BucketName
  folder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
}

function validateFile(file: File, options: UploadOptions = {}): string | null {
  const maxSize = (options.maxSizeMB ?? 10) * 1024 * 1024
  const allowed = options.allowedTypes ?? ALLOWED_TYPES

  if (file.size > maxSize) {
    return `File "${file.name}" is too large. Max size is ${options.maxSizeMB ?? 10}MB.`
  }
  if (!allowed.includes(file.type)) {
    return `File "${file.name}" has an unsupported type: ${file.type}.`
  }
  return null
}

function buildPath(file: File, folder?: string): string {
  const ext = file.name.split(".").pop() ?? "jpg"
  const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  return folder ? `${folder}/${name}` : name
}

export async function uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResult> {
  const validationError = validateFile(file, options)
  if (validationError) throw new Error(validationError)

  const bucket = options.bucket ?? BUCKETS.PRODUCT_IMAGES
  const path = buildPath(file, options.folder)

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)

  return { url: publicUrl, path, bucket }
}

export async function uploadMultiple(files: File[], options: UploadOptions = {}): Promise<UploadResult[]> {
  return Promise.all(files.map((f) => uploadFile(f, options)))
}

export async function deleteFile(path: string, bucket: BucketName = BUCKETS.PRODUCT_IMAGES): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw new Error(`Delete failed: ${error.message}`)
}

export async function deleteMultiple(paths: string[], bucket: BucketName = BUCKETS.PRODUCT_IMAGES): Promise<void> {
  if (paths.length === 0) return
  const { error } = await supabase.storage.from(bucket).remove(paths)
  if (error) throw new Error(`Delete failed: ${error.message}`)
}

export function getPublicUrl(path: string, bucket: BucketName = BUCKETS.PRODUCT_IMAGES): string {
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}

export async function listFiles(folder: string, bucket: BucketName = BUCKETS.PRODUCT_IMAGES) {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    sortBy: { column: "created_at", order: "desc" },
  })
  if (error) throw new Error(`List failed: ${error.message}`)
  return data ?? []
}

export async function initializeStorage(): Promise<void> {
  for (const bucket of Object.values(BUCKETS)) {
    const { data: existing } = await supabaseAdmin.storage.getBucket(bucket)
    if (!existing) {
      await supabaseAdmin.storage.createBucket(bucket, { public: true })
    }
  }
}
