import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ priceId: string }> }
) {
  try {
    await requireAdmin()

    const { priceId: priceIdParam } = await context.params
    const priceId = parseInt(priceIdParam)
    if (isNaN(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    await prisma.productPrice.delete({
      where: { id: priceId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting price:", error)
    if (error instanceof Error && error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ priceId: string }> }
) {
  try {
    await requireAdmin()

    const { priceId: priceIdParam } = await context.params
    const priceId = parseInt(priceIdParam)
    if (isNaN(priceId)) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 })
    }

    const formData = await request.formData()

    const type = formData.get('type') as string | null
    const valueRaw = formData.get('value') as string | null
    const unit = formData.get('unit') as string | null
    const price = formData.get('price') as string | null
    const stripePriceIdForm = formData.get('stripePriceId') as string | null

    const data: any = {}
    if (type) data.type = type
    if (valueRaw !== null && valueRaw !== undefined && valueRaw !== '') {
      const parsed = parseInt(valueRaw)
      if (!Number.isNaN(parsed)) data.value = parsed
    }
    if (unit) data.unit = unit
    if (price) data.price = price
    if (stripePriceIdForm !== undefined) {
      const trimmed = (stripePriceIdForm ?? '').trim()
      data.stripePriceId = trimmed.length ? trimmed : null
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const updated = await prisma.productPrice.update({
      where: { id: priceId },
      data
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating price:", error)
    if (error instanceof Error && error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}