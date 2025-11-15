import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { connect } from "http2";
import { pterodactylServerService } from "@/lib/pterodactyl";
import { installServerOnPterodactyl } from "../servers/install/route";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature") as string;

  try {
    // Fetch Stripe settings from database
    const stripeSecretKey = await prisma.setting.findUnique({
      where: { name: "stripe_secret_key" },
    });

    const stripeWebhookSecret = await prisma.setting.findUnique({
      where: { name: "stripe_webhook_secret" },
    });
    if (!stripeSecretKey?.value) {
      throw new Error("Stripe secret key is not configured in settings");
    }
    if (!stripeWebhookSecret?.value) {
      throw new Error("Stripe webhook secret is not configured in settings");
    }

    const stripe = new Stripe(stripeSecretKey.value);

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      stripeWebhookSecret.value
    );

    switch (event.type) {
      case "invoice.paid":
        if (event.data.object.billing_reason === "subscription_create") {
          const subscriptionId = event.data.object.lines.data[0].parent?.subscription_item_details?.subscription;
          const game = event.data.object.lines.data[0].metadata
            .game;
          const priceId = event.data.object.lines.data[0].pricing?.price_details?.price;
          const price = await prisma.productPrice.findFirst({
            where: { stripePriceId: priceId as string },
            include: { product: true },
          });
          const product = price?.product;
          const customerId = event.data.object.customer;
          if (!customerId || !game || !product) return new NextResponse(null, { status: 404 });
          const user = await prisma.user.findFirst({
            where: { stripeId: customerId.toString() },
          });
          const expiresAt = event.data.object.lines.data[0].period?.end
          console.log("PRODUCT ID : ", product)
          
          if (!user) return new NextResponse(null, { status: 404 });
          const server = await prisma.server.create({
            data: {
              stripeSubscriptionId: subscriptionId as string,
              user: {
                connect: { id: user.id },
              },
              status: "active",
              installed: false,
              isSuspended: false,
              name: `${game}-server`,
              product:{
                connect: {id: Number(product.id)}
              },
              autoRenewal: true,
              createdAt: new Date(),
              expiresAt: expiresAt ? new Date(expiresAt * 1000) : new Date(),
              
            },

          })

          await installServerOnPterodactyl(server.id,game,product.id.toString());
          console.log("New subscription created for game:", game);
          console.log("Customer ID:", customerId);
        }
      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error(err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}

export const config = {
  api: { bodyParser: false },
};



  