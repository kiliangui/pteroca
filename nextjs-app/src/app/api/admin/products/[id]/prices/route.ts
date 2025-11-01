import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productId = parseInt(params.id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const formData = await request.formData()
    const type = formData.get('type') as string
    const value = parseInt(formData.get('value') as string)
    const unit = formData.get('unit') as string
    const price = formData.get('price') as string

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
      },
    })

    return NextResponse.json(newPrice)
  } catch (error) {
    console.error("Error adding price:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}