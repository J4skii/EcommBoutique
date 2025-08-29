import { supabase } from "./database"

export async function uploadImage(file: File, bucket = "product-images"): Promise<string> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw error
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload image")
  }
}

export async function uploadMultipleImages(files: File[], bucket = "product-images"): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, bucket))
  return Promise.all(uploadPromises)
}

export async function deleteImage(url: string, bucket = "product-images"): Promise<void> {
  try {
    // Extract filename from URL
    const fileName = url.split("/").pop()
    if (!fileName) return

    const { error } = await supabase.storage.from(bucket).remove([fileName])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Delete error:", error)
    throw new Error("Failed to delete image")
  }
}
