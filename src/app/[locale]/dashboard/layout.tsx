import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/navigation/Header"
import { Redirect } from "@/components/navigation/Redirect"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log("redirecting")
    return <Redirect href="/auth/login" redirect={true}/>
  }

  const siteName = await prisma.setting.findFirst({
    where:{
      name:"site_name"
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}