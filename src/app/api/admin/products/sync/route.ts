import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(){
    await requireAdmin()
    const stripeSecretKey = await prisma.setting.findUnique({
      where: { name: "stripe_secret_key" },
    });
    if (!stripeSecretKey) return Response.json({},{status:404})
    const stripe = new Stripe(stripeSecretKey.value);
    const products = await stripe.products.list({})
    products.data.forEach(async product => {
        if (product.active){
            await checkProductOrCreate(product)
            const prices = await stripe.prices.list({
                product:product.id
            })
            if (prices) await checkPricesOrCreate(prices.data)
        }
        
    });
}

async function checkPricesOrCreate(prices:Stripe.Price[]){
    prices.forEach(async price => {
        const localPrice = await prisma.productPrice.findFirst({
            where:{
                stripePriceId:price.id
            }
        })
            console.log("PRICE:",price,localPrice)

        if (!localPrice && price){
            const product = await prisma.product.findFirst({
                where:{
                    stripeId:price.product.toString()
                }
            })
            console.log("product",product)
            if (product) await prisma.productPrice.create({
                data:{
                    productId:product.id,
                    stripePriceId:price.id,
                    price:price?.unit_amount ? (price?.unit_amount/100).toString() :"99",
                    // @ts-expect-error interval typing
                    type:price.type=="recurring" ? price.recurring?.interval.toString() : "month",
                    value:price.type=="recurring" ? Number(price.recurring?.interval_count) : 1,
                    unit:price.currency,
                }
            })
        }else{
            await prisma.productPrice.update({
                where:{
                    id:localPrice?.id
                },
                data:{
                    price:price?.unit_amount ? (price?.unit_amount/100).toString() :"99",
                    type:price.type=="recurring" ? price.recurring?.interval.toString() : "month",
                    value:price.type=="recurring" ? Number(price.recurring?.interval_count) : 1,
                    unit:price.currency,
                }
            })
        }
        
    });
    
}

async function checkProductOrCreate(product:Stripe.Product){
    const localProduct = await prisma.product.findFirst({
        where:{
            stripeId:product.id
        }
    })
    if (!localProduct){
        await prisma.product.create({
            data:{
                name:product.name,
                stripeId:product.id,
                diskSpace:1024,
                cpu:200,
                memory:1024,
                io:500,
                dbCount:1,
                backups:1,
                ports:2,
                isActive:false,
                swap:512,
                createdAt: new Date()
            }
        })
    }
}