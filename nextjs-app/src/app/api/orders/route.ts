import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { pterodactylAccountService, pterodactylServerService } from "@/lib/pterodactyl"
import { createServerFactory, ServerConfig } from "@/lib/server-factory"

const createOrderSchema = z.object({
  productId: z.number(),
  priceId: z.number(),
  billingCycle: z.string(),
  serverName: z.string().min(1).max(100),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { productId, priceId, billingCycle, serverName } = createOrderSchema.parse(body)

    // Get product and price details
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      include: { prices: true }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const selectedPrice = product.prices.find(p => p.id === priceId)
    if (!selectedPrice) {
      return NextResponse.json({ error: "Price not found" }, { status: 404 })
    }

    // Get user with Pterodactyl info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true, pterodactylUserId: true, pterodactylUserApiKey: true, email: true, name: true, surname: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure user has a Pterodactyl account
    let pterodactylUserId = user.pterodactylUserId
    if (!pterodactylUserId) {
      try {
        const pterodactylUser = await pterodactylAccountService.createUser(
          user.email,
          user.email.split('@')[0], // Use email prefix as username
          user.name || 'User',
          user.surname || '',
          undefined // No password for API users
        )
        pterodactylUserId = pterodactylUser.id

        // Update user with Pterodactyl user ID
        await prisma.user.update({
          where: { id: session.user.id },
          data: { pterodactylUserId }
        })
      } catch (error) {
        console.error('Error creating Pterodactyl user:', error)
        return NextResponse.json({ error: "Failed to create Pterodactyl account" }, { status: 500 })
      }
    }

    const orderAmount = parseFloat(selectedPrice.price)
    const currentBalance = parseFloat(user.balance)

    if (currentBalance < orderAmount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Calculate expiration date
    const expiresAt = new Date()
    if (billingCycle === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    } else if (billingCycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    }

    // Create Pterodactyl server using the factory pattern
    let pterodactylServer
    try {
      // Get default allocation from settings or find free one
      const allocationSetting = await prisma.setting.findUnique({
        where: { name: 'pterodactyl_default_allocation' }
      })
      const defaultAllocationId = allocationSetting?.value ? parseInt(allocationSetting.value) : await pterodactylServerService.getFreeAllocationOnNode(1)

      // Create server configuration
      const serverConfig: ServerConfig = {
        name: serverName,
        userId: pterodactylUserId,
        limits: {
          memory: product.memory,
          swap: product.swap,
          disk: product.diskSpace,
          io: product.io,
          cpu: product.cpu
        },
        featureLimits: {
          databases: product.dbCount,
          allocations: product.ports,
          backups: product.backups
        },
        allocationId: defaultAllocationId
      }

      // Create Paper server instance (for now, we assume all servers are Paper/Minecraft)
      // In the future, this could be determined by product type or egg configuration
      const serverFactory = createServerFactory('paper', serverConfig, {
        minecraftVersion: 'latest',
        buildNumber: 'latest',
        serverJarFile: 'server.jar'
      })

      pterodactylServer = await serverFactory.createServer()
      console.log('Pterodactyl server created successfully:', pterodactylServer.id)
    } catch (error) {
      console.error('Error creating Pterodactyl server:', error)
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
      return NextResponse.json({
        error: "Failed to create server in Pterodactyl",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 })
    }

    // Create server record with real Pterodactyl data
    const server = await prisma.server.create({
      data: {
        pterodactylServerId: pterodactylServer.id,
        pterodactylServerIdentifier: pterodactylServer.identifier,
        name: serverName,
        createdAt: new Date(),
        expiresAt,
        userId: session.user.id,
      }
    })

    try {
      // Create server product linked to the server
      await prisma.serverProduct.create({
        data: {
          serverId: server.id,
          originalProductId: productId,
          name: product.name,
          diskSpace: product.diskSpace,
          memory: product.memory,
          io: product.io,
          cpu: product.cpu,
          dbCount: product.dbCount,
          swap: product.swap,
          backups: product.backups,
          ports: product.ports,
          nodes: product.nodes || undefined,
          nest: 1, // Use default nest for now
          eggs: product.eggs || undefined,
          eggsConfiguration: product.eggsConfiguration,
          allowChangeEgg: product.allowChangeEgg,
          schedules: product.schedules,
          threads: product.threads,
          prices: {
            create: {
              type: selectedPrice.type,
              value: selectedPrice.value,
              unit: selectedPrice.unit,
              price: selectedPrice.price,
              isSelected: true
            }
          }
        }
      })

      // Update user balance
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          balance: (currentBalance - orderAmount).toString()
        }
      })

      // Create payment record
      await prisma.payment.create({
        data: {
          sessionId: `order_${server.id}`,
          status: "completed",
          amount: selectedPrice.price,
          currency: "USD",
          balanceAmount: selectedPrice.price,
          userId: session.user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Create log entry
      await prisma.log.create({
        data: {
          actionId: 'server_created',
          details: `Server "${serverName}" created successfully with Pterodactyl ID ${pterodactylServer.id}`,
          userId: session.user.id,
          createdAt: new Date(),
        },
      })
    } catch (error) {
      // If any database operation fails, delete the Pterodactyl server
      console.error('Error completing order, rolling back:', error)
      try {
        await pterodactylServerService.deleteServer(pterodactylServer.id)
      } catch (deleteError) {
        console.error('Error deleting Pterodactyl server during rollback:', deleteError)
      }
      // Delete the server record
      await prisma.server.delete({ where: { id: server.id } }).catch(() => {})
      throw error
    }

    return NextResponse.json({
      success: true,
      server: {
        id: server.id,
        name: server.name,
        expiresAt: server.expiresAt
      }
    })
  } catch (error) {
    console.error("Error creating order:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}