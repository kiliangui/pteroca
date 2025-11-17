import { Card } from "@/components/ui/card";
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/components/SubscribeButton";
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function OfferPage({ params }: { params: { game: string; offer: string } }) {
  const { game, offer } =await params

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return (
      <div className="max-w-2/3 m-auto">
        <h1 className="text-3xl font-bold py-4">Create Server</h1>
        <p className="mt-4">Please sign in to create your server.</p>
      </div>
    )
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true,stripeId:true  },
  })

  // Resolve the selected Product by "offer" segment (case-insensitive) and its first ProductPrice with a stripePriceId.
  // Using contains/insensitive via raw filter object keeps TS happy with Prisma's generated types.
  const product = await prisma.product.findFirst({
    where: {
      isActive: true,
      // Match by name (case-insensitive) without relying on typed "mode" helper here.
      name: {
        contains: offer,
      } as any,
    },
    include: {
      prices: true,
    },
  })

  const activePrice = product?.prices?.find((price: any) => !!price.stripePriceId)
  const productPriceId: number | undefined = activePrice?.id
  const stripePriceId: string | undefined = activePrice?.stripePriceId || undefined

  return (
    <div className="max-w-2/3 m-auto">
      <h1 className="text-3xl font-bold py-4">Create Server</h1>
      <Card className="flex rounded-lg relative p-0 items-center justify-center">
        <div
          className="h-full rounded-lg w-full absolute"
          style={{
            backgroundImage: `url(${"/images/games/minecraft.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black rounded-lg opacity-40" />
        </div>
        <div
          style={{ zIndex: "2" }}
          className="flex w-full items-center justify-between p-4 rounded-xl cursor-pointer"
        >
          <a href={`/create/${game}`}>
            <ArrowLeft style={{ zIndex: "2" }} color="white" size={64} />
          </a>
          <div
            className="text-white font-black text-4xl"
            style={{ zIndex: "2" }}
          >
            {game}
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          You have selected the {offer} plan
        </h2>
        <p className="text-muted-foreground mb-6">
          Proceed to checkout to complete your server setup.
        </p>

        {!product || !productPriceId || !stripePriceId ? (
          <div className="text-red-500 mb-4">
            No Stripe price configured for this offer. Please ensure a
            ProductPrice with a valid stripePriceId exists for this plan.
          </div>
        ) : (
          <SubscribeButton
            stripePriceId={stripePriceId}
            productPriceId={productPriceId}
            game={game}
            content={"Pay"}
          />
        )}
      </div>
    </div>
  )
}
