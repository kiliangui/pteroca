import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        prices: {
          select: {
            id: true,
            type: true,
            value: true,
            unit: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : null
    const diskSpace = parseInt(formData.get("diskSpace") as string)
    const memory = parseInt(formData.get("memory") as string)
    const cpu = parseInt(formData.get("cpu") as string)
    const io = parseInt(formData.get("io") as string)
    const isActive = formData.get("isActive") === "on"

    if (!name || !diskSpace || !memory || !cpu || !io) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        diskSpace,
        memory,
        cpu,
        io,
        isActive,
        categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
        dbCount:3,
        swap:0,
        backups:2,
        ports:2
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        prices: {
          select: {
            id: true,
            type: true,
            value: true,
            unit: true,
            price: true,
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}