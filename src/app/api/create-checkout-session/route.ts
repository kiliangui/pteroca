import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stripePriceId, productPriceId,code} = body;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

    const user = await prisma.user.findFirst({
      where:{
        id:session.user.id
      }
    })
    const customerId=await getOrCreateStripeUser(user)
    // Fetch Stripe settings from database
    const stripeSecretKey = await prisma.setting.findUnique({
      where: { name: "stripe_secret_key" },
    });

    const siteUrl = await prisma.setting.findUnique({
      where: { name: "site_url" },
    });

    if (!stripeSecretKey?.value) {
      throw new Error("Stripe secret key is not configured in settings");
    }
    if (!siteUrl?.value) {
      throw new Error("Site URL is not configured in settings");
    }

    let priceId = stripePriceId;

    // If no stripePriceId provided, try to get it from productPriceId
    if (!priceId && productPriceId) {
      const productPrice = await prisma.productPrice.findUnique({
        where: { id: parseInt(productPriceId) },
      });
      priceId = productPrice?.stripePriceId;
    }

    if (!priceId) {
      throw new Error("No valid Stripe price ID found");
    }
    console.log("priceId",priceId)

    const stripe = new Stripe(stripeSecretKey.value);

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      allow_promotion_codes:true,
      subscription_data:{
        metadata:{
          game: "minecraft",
        }
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl.value}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl.value}/cancel`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

async function getOrCreateStripeUser(user){
  if (user.stripeId) return user.stripeId
  const stripeSecretKey = await prisma.setting.findUnique({
          where: { name: "stripe_secret_key" },
        });
    if (!stripeSecretKey) return
    const stripe = new Stripe(stripeSecretKey.value);

    // creating stripe customer
    const cus = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id.toString() }
    })
    await prisma.user.update({
      where:{
        id:user.id
      },data:{
        stripeId:cus.id
      }
    })
    return cus.id
}