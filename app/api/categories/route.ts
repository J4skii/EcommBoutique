import { type NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/database"

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get("includeInactive") === "true"
    const withProductCount = searchParams.get("withProductCount") === "true"

    let query = supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })

    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data: categories, error } = await query

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      )
    }

    // Add product count if requested
    let categoriesWithCount = categories
    if (withProductCount && categories) {
      categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("category_id", category.id)
            .eq("is_active", true)
          
          return { ...category, product_count: count || 0 }
        })
      )
    }

    return NextResponse.json({ categories: categoriesWithCount })

  } catch (error) {
    console.error("Categories GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image_url, sort_order } = body

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid category name" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 }
      )
    }

    // Create category
    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .insert({
        name,
        slug,
        description,
        image_url,
        sort_order: sort_order || 0,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json(
        { error: "Failed to create category" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { category, message: "Category created successfully" },
      { status: 201 }
    )

  } catch (error) {
    console.error("Categories POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT update category (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, image_url, is_active, sort_order } = body

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (image_url !== undefined) updates.image_url = image_url
    if (is_active !== undefined) updates.is_active = is_active
    if (sort_order !== undefined) updates.sort_order = sort_order

    // If name changed, update slug
    if (name) {
      updates.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    updates.updated_at = new Date().toISOString()

    const { data: category, error } = await supabaseAdmin
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating category:", error)
      return NextResponse.json(
        { error: "Failed to update category" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { category, message: "Category updated successfully" }
    )

  } catch (error) {
    console.error("Categories PUT error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE category (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    // Check if category has products
    const { count } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${count} products. Reassign products first.` },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting category:", error)
      return NextResponse.json(
        { error: "Failed to delete category" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Category deleted successfully" }
    )

  } catch (error) {
    console.error("Categories DELETE error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
