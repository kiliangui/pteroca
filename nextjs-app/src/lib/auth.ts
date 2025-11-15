import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { getServerSession } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          role: (user.roles as any)?.admin ? 'ADMIN' : 'USER',
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}

export async function checkAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions)
    const user = await prisma.user.findUnique({
      where:{id:session?.user.id}
    })
    if (!user || !user.roles) return false
    //@ts-expect-error roles is str
    return user.roles.findLast((role)=>((role==="admin")||(role==="ADMIN")))
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export async function requireAdmin(): Promise<void> {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.hash(password, 12)
}