import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resetPasswordSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent you a password reset link." },
        { status: 200 }
      )
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Create password reset request
    await prisma.passwordResetRequest.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // TODO: Send email with reset link
    // For now, just log the reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`
    console.log(`Password reset link for ${email}: ${resetLink}`)

    return NextResponse.json(
      { message: "If an account with that email exists, we've sent you a password reset link." },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 400 }
      )
    }

    console.error("Reset password error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}