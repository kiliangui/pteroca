import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
    await requireAdmin()

  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
      await requireAdmin()
  
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const existingCategory = await prisma.category.findFirst({
      where: { name },
    })

    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}