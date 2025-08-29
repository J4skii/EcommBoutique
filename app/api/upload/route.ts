import { type NextRequest, NextResponse } from "next/server"
import { uploadImage, uploadMultipleImages } from "@/lib/upload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })
      }
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024 // 5MB
    for (const file of files) {
      if (file.size > maxSize) {
        return NextResponse.json({ error: "File too large. Max size is 5MB" }, { status: 400 })
      }
    }

    let urls: string[]

    if (files.length === 1) {
      const url = await uploadImage(files[0])
      urls = [url]
    } else {
      urls = await uploadMultipleImages(files)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}
