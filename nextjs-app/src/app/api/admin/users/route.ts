import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        balance: true,
        isVerified: true,
        isBlocked: true,
        createdAt: true,
        roles: true,
        pterodactylUserId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const surname = formData.get("surname") as string
    const password = formData.get("password") as string
    const balance = formData.get("balance") as string
    const isVerified = formData.get("isVerified") === "on"
    const isBlocked = formData.get("isBlocked") === "on"

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        surname: surname || null,
        password: hashedPassword,
        balance: balance || "0.00",
        isVerified,
        isBlocked,
        roles: {},
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        balance: true,
        isVerified: true,
        isBlocked: true,
        createdAt: true,
        roles: true,
        pterodactylUserId: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error creating user:", error)
    if (error instanceof Error && error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}