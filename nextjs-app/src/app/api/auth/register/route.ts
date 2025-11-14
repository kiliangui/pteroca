import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { pterodactylAccountService } from "@/lib/pterodactyl"
import { z } from "zod"
import Stripe from "stripe"

const registerSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    

    const body = await request.json()
    const { name, surname, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create Pterodactyl user
    let pterodactylUserId: number | undefined
    let pterodactylUserApiKey: string | undefined

    try {
      const pterodactylUser = await pterodactylAccountService.createUser(
        email,
        `${name}_${surname}`.toLowerCase().replace(/\s+/g, '_'),
        name,
        surname,
        password
      )
      pterodactylUserId = pterodactylUser.id

      // Create API key for the user
      pterodactylUserApiKey = await pterodactylAccountService.createUserApiKey(
        pterodactylUserId,
        'User API Key'
      )
    } catch (pterodactylError) {
      console.error('Failed to create Pterodactyl user:', pterodactylError)
      // Continue with local user creation even if Pterodactyl fails
    }

    // Create local user
    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
        balance: "0",
        roles: JSON.stringify(["user"]),
        pterodactylUserId,
        pterodactylUserApiKey,
      },
    })

    const stripeSecretKey = await prisma.setting.findUnique({
          where: { name: "stripe_secret_key" },
        });
    if (!stripeSecretKey) return
    const stripe = new Stripe(stripeSecretKey.value);

    // creating stripe customer
    const cus = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id.toString() }
    })
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeId: cus.id }
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}