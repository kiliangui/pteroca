import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Enforce admin
    await requireAdmin()

    const { id } = await context.params
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const formData = await request.formData()
    const type = formData.get('type') as string
    const value = parseInt(formData.get('value') as string)
    const unit = formData.get('unit') as string
    const price = formData.get('price') as string
    const stripePriceId = (formData.get('stripePriceId') as string) || null

    if (!type || !value || !unit || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newPrice = await prisma.productPrice.create({
      data: {
        productId,
        type,
        value,
        unit,
        price,
        stripePriceId
      }
    })

    return NextResponse.json(newPrice)
  } catch (error) {
    console.error("Error adding price:", error)
    // Map admin errors to 403
    if (error instanceof Error && error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}