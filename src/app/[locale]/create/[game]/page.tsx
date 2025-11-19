import { Card } from "@/components/ui/card"
import { GameClient } from "./client"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export default  async function GamePage({ params }: { params: { game: string } }) {
  const { game } = await params
  const session = await getServerSession(authOptions);
  
  let offers = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      prices: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          value: "asc",
        },
      },
    },
  })
  offers = offers.sort((a,b)=>{
    const GBa = a.memory
    const GBb = b.memory
    return GBa - GBb
  })
  return <GameClient offers={offers} game={game}  />
  
}


