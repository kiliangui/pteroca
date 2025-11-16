import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Header } from "@/components/navigation/Header"
import { headers } from "next/headers"
import { Redirect } from "@/components/navigation/Redirect"
import { prisma } from "@/lib/prisma"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  if (!session) {
    console.log("ehadersList",pathname)
    //redirect("/auth/login?redirect="+fullUrl)
    return <Redirect href="/auth/login" redirect={true}/>
  }
  const siteName = await prisma.setting.findFirst({
      where:{
        name:"site_name"
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}