import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(
  request: Request
){
     const session = await getServerSession(authOptions)
    const body = await request.json()
        if (!session?.user?.id) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
    const freetrialPorduct = await prisma.product.findFirst({
        where:{
            name:"freetrial"
        }
    })
    if (!freetrialPorduct?.id) return NextResponse.json({ error: "Error" }, { status: 500 })
    const userFreeTrials = await prisma.server.findMany({
        where:{
            userId:session.user.id,
            productId:freetrialPorduct?.id
        }
    })
    if (userFreeTrials.length>0){
        return NextResponse.json({ message:"Vous avez déja un essaie en cours" }, { status: 200 })
    }
    if (!body.game) return NextResponse.json({ message:"Aucun jeu" }, { status: 400 })
    const server = await prisma.server.create({
            data: {
              user: {
                connect: { id: session.user.id },
              },
              status: "active",
              installed: false,
              isSuspended: false,
              name: `${body.game}-freetrial`,
              product:{
                connect: {id: Number(freetrialPorduct?.id)}
              },
              autoRenewal: true,
              createdAt: new Date(),
              expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1))
               
            },

          })

        return NextResponse.json({
          server:server
        },{status:200})


}