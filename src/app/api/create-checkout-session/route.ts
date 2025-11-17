import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeId: true, email: true, name: true },
    });

    const body = await req.json();
    const { game, offer, periodName, period } = body;

    // Find the product by name containing offer
    const product = await prisma.product.findFirst({
      where: {
        isActive: true,
        name: {
          contains: offer,
        } as any,
      },
      include: {
        prices: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Find the price matching periodName and period
    const price = product.prices.find((p: any) => p.type === periodName && p.value === period);

    if (!price?.stripePriceId) {
      throw new Error("No valid Stripe price ID found for selected period");
    }

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

    const stripe = new Stripe(stripeSecretKey.value);

    let customerId = user?.stripeId;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user?.email || (session.user as any).email,
        name: user?.name || (session.user as any).name,
      });
      customerId = customer.id;

      // Update user with stripeId
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: user.stripeId,
      subscription_data:{
        metadata:{
          game: game,
        }
      },
      line_items: [
        {
          price: price.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl.value}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl.value}/cancel`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}