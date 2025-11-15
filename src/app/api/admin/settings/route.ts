import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      include: {
        options: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: [
        { hierarchy: "asc" },
        { name: "asc" },
      ],
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Update each setting from the form data
    for (const [key, value] of formData.entries()) {
      if (key !== "action") { // Skip any action fields
        await prisma.setting.update({
          where: { name: key },
          data: { value: value as string },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}