import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stripePriceId, productPriceId,customerId } = body;

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

    const stripe = new Stripe(stripeSecretKey.value);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId || undefined,
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

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}