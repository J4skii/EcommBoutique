import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

// GET /api/settings - Fetch all settings or a specific setting
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const key = searchParams.get("key")

        let query = supabase.from("store_settings").select("*")

        if (key) {
            const { data, error } = await supabase
                .from("store_settings")
                .select("*")
                .eq("setting_key", key)
                .single()

            if (error && error.code !== "PGRST116") {
                console.error("Error fetching setting:", error)
                return NextResponse.json(
                    { error: "Failed to fetch setting" },
                    { status: 500 }
                )
            }

            return NextResponse.json({ setting: data })
        } else {
            const { data, error } = await query

            if (error) {
                console.error("Error fetching settings:", error)
                return NextResponse.json(
                    { error: "Failed to fetch settings" },
                    { status: 500 }
                )
            }

            // Convert array to key-value object
            const settings: Record<string, string> = {}
            for (const item of data || []) {
                settings[item.setting_key] = item.setting_value
            }

            return NextResponse.json({ settings })
        }
    } catch (error) {
        console.error("Error in settings GET:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { settings } = body

        if (!settings || typeof settings !== "object") {
            return NextResponse.json(
                { error: "Invalid settings format" },
                { status: 400 }
            )
        }

        // Update each setting
        const results = []
        for (const [key, value] of Object.entries(settings)) {
            const { data, error } = await supabase
                .from("store_settings")
                .upsert(
                    {
                        setting_key: key,
                        setting_value: value,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "setting_key" }
                )
                .select()

            if (error) {
                console.error(`Error updating setting ${key}:`, error)
                results.push({ key, success: false, error: error.message })
            } else {
                results.push({ key, success: true })
            }
        }

        const allSuccessful = results.every((r) => r.success)

        return NextResponse.json({
            success: allSuccessful,
            results,
        })
    } catch (error) {
        console.error("Error in settings PUT:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
