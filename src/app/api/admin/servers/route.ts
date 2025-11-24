import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  
      await requireAdmin()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const user = searchParams.get('user')
    console.log("user",user)
    let servers;
    if (user) servers = await prisma.server.findMany({
        where:{
            userId:user
        },
      orderBy: [
        { createdAt: "asc" },
      ],
    })
    else servers = await prisma.server.findMany({
      orderBy: [
        { createdAt: "asc" },
      ],
    })

    return NextResponse.json({ servers })
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