import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { getServerSession } from "next-auth"
import posthog from "posthog-js";
async function generateAuthOptions(): Promise<NextAuthOptions> {
  const [discordId, discordSecret] = await Promise.all([
    prisma.setting.findFirst({ where: { name: "discord_client_id" }}),
    prisma.setting.findFirst({ where: { name: "discord_client_secret" }})
  ]);
  console.log("discordId",discordId)

  return {
    adapter: PrismaAdapter(prisma),

    providers: [
      DiscordProvider({
        clientId: discordId?.value ?? "",
        clientSecret: discordSecret?.value ?? "",
        
      }),

      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },

        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user?.password) return null;

          const ok = await compare(credentials.password, user.password);
          if (!ok) return null;

          // Parse roles from JSON string or use default
          let role = "USER";
          if (user.roles) {
            try {
              const roles = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
              role = roles.includes("admin") || roles.includes("ADMIN") ? "ADMIN" : "USER";
            } catch {
              role = "USER";
            }
          }
          posthog.identify()
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            role,
          };
        },
      }),
    ],

    session: {
      strategy: "jwt",
    },

    callbacks: {
      async jwt({ token, user, account, profile }) {
        // Handle new user creation via OAuth
        if (account && profile && account.provider === "discord") {
          // Check if this is a new user by looking for existing user in DB
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email as string }
          });
          
          if (!existingUser) {
            // Create new user with default roles
            await prisma.user.create({
              data: {
                email: profile.email as string,
                name: (profile as any).name || "",
                surname: (profile as any).name || "",
                roles: JSON.stringify(["USER"]),
                balance: "0.00",
                emailVerified: new Date(),
                isVerified: true
              }
            });
          }
        }
        if (user) token.role = user.role;
        return token;
      },

      async session({ session, token }) {
        // Ensure user has roles
        const user = await prisma.user.findUnique({
          where: { id: token.sub as string }
        });
        
        session.user.id = token.sub!;
        if (user && user.roles) {
          // Parse roles from JSON string or use default
          try {
            const roles = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
            session.user.role = roles.includes("ADMIN") ? "ADMIN" : "USER";
          } catch {
            session.user.role = "USER";
          }
        } else {
          session.user.role = "USER";
        }
        return session;
      },
    },

    pages: { signIn: "/auth/signin" },
  };
}

export const authOptions = await generateAuthOptions();

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