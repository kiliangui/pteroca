import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { pterodactylAccountService } from "@/lib/pterodactyl"
import Stripe from "stripe"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  const stripeSecretKey = await prisma.setting.findUnique({
          where: { name: "stripe_secret_key" },
        });
    if (!stripeSecretKey) return
    const stripe = new Stripe(stripeSecretKey.value);
  try {
    await requireAdmin()

    const { id } = await context.params
    const userId = id

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.stripeId) {
      return NextResponse.json({ error: "User already has a Stripe account" }, { status: 400 })
    }

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id.toString() }
    })
    // Update user with Stripe customer ID
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeId: stripeCustomer.id }
    })

    return NextResponse.json({ success: true, stripeId: stripeCustomer.id })
  } catch (error) {
    console.error("Error creating Pterodactyl user:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to create Pterodactyl user" },
      { status: 500 }
    )
  }
}