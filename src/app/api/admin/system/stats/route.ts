import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get server statistics
    const totalServers = await prisma.server.count()
    const activeServers = await prisma.server.count({
      where: { isSuspended: false }
    })

    // Get user statistics
    const totalUsers = await prisma.user.count()
    const verifiedUsers = await prisma.user.count({
      where: { isVerified: true }
    })

    // Get product statistics
    const totalProducts = await prisma.product.count()
    const activeProducts = await prisma.product.count({
      where: { isActive: true }
    })

    // Get payment statistics (mock data for now)
    const totalRevenue = "45230.50"

    // Mock system stats (in a real app, you'd get these from system monitoring)
    const stats = {
      cpuUsage: 45,
      memoryUsage: 67,
      diskUsage: 34,
      networkUsage: 23,
      activeServers,
      totalServers,
      databaseConnections: 12,
      uptime: "7 days, 14 hours",
      lastBackup: "2 hours ago",
      totalUsers,
      verifiedUsers,
      totalProducts,
      activeProducts,
      totalRevenue,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}