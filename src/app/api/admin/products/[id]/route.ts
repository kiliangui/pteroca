import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
        await requireAdmin()
    
    const { id } = await params
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : null
    const diskSpace = parseInt(formData.get("diskSpace") as string)
    const memory = parseInt(formData.get("memory") as string)
    const cpu = parseInt(formData.get("cpu") as string)
    const io = parseInt(formData.get("io") as string)
    const isActive = formData.get("isActive") === "on"
    const recommended = formData.get("recommended") === "on"

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description: description || null,
        diskSpace,
        memory,
        cpu,
        io,
        isActive,
        categoryId,
        recommended,
        updatedAt: new Date(),
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
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    await requireAdmin()

  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}