import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions, requireAdmin } from "@/lib/auth"
import { Header } from "@/components/navigation/Header"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Redirect } from "@/components/navigation/Redirect"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
     
  try{
  await requireAdmin()

  }catch(e){
    return <Redirect href="/"/>
  }
  

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}