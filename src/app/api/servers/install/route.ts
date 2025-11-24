import { eggs } from "@/lib/eggs";
import { prisma } from "@/lib/prisma";
import { pterodactylAccountService, pterodactylServerService } from "@/lib/pterodactyl";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // get the serverId, game, productId from the request body
    const { serverId, game, productId } = await req.json();
    await installServerOnPterodactyl(serverId, game, productId);
    return new Response(JSON.stringify({ message: "Server installation initiated" }), { status: 200 });
}



export async function installServerOnPterodactyl(serverId: number, game: string, productId: string) {

  // Placeholder function to simulate server installation on Pterodactyl
  console.log(`Installing server ${serverId} for game ${game} with product ID ${productId} on Pterodactyl...`);
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  const server = await prisma.server.findUnique({
    where: { id: serverId },
  });
  const user = await prisma.user.findUnique({
    where: { id: server?.userId },
  });
  if (!product || !server || !user){
    console.log("Cannot install server: Missing product, server, or user.");
    return
  }
  let pterodactylUserId = user?.pterodactylUserId;

  if (!pterodactylUserId) {
    const name = user.email.split("@")[0]
    const pteroUser = await pterodactylAccountService.createUser(user.email,name,name,name,Math.random().toString(36).slice(-8))
    pterodactylUserId =pteroUser.id
    const pterodactylUserApiKey = await pterodactylAccountService.createUserApiKey(pteroUser.id,"Hostchicken Managment")
    await prisma.user.update({
      where:{
        id:user.id
      },
      data:{
        pterodactylUserApiKey:pterodactylUserApiKey,
        pterodactylUserId:pterodactylUserId
      }
    })
  }

  // get an allocation from pterodactyl.
  const nodeId = 2;
// /api/application/nodes/{node}/allocations
  const allocation = await pterodactylServerService.getFreeAllocationOnNode(nodeId);
  console.log("ALLOCATION :",allocation);
  console.log("user id : ",user.id)

  const gameEgg = eggs[game]
  if (!gameEgg) return NextResponse.json({message:"GAME NOT FOUND"})


  const pteroServer = await pterodactylServerService.createServer(server.name || "myserver",pterodactylUserId,gameEgg.id,gameEgg.nest,{memory:product.memory,cpu:product.cpu,disk:product.diskSpace,io:500,swap:0},{databases:1,allocations:2,backups:1},allocation,gameEgg.environment);
  await prisma.server.update({
    where:{
        id:server.id
    },
    data:{
        pterodactylServerId:pteroServer.id,
        pterodactylServerIdentifier:pteroServer.identifier,
        installed:true
    }
  })

  if (game=="satisfactory"){
    try{
const allocation2 = await pterodactylServerService.getFreeAllocationOnNode(nodeId,"all") as any;
     await pterodactylServerService.updateServer(pteroServer.id,{
      allocation:{
        default:allocation,
        additionnal:[allocation2?.id]
      },
      limits:{
        memory: product.memory,
        swap: product.swap,
        disk: product.diskSpace,
        io: product.io,
        cpu: product.cpu
      },
      feature_limits:{
        databases:2,
        allocations:3,
        backups:5
      },
      environment:{
        ...gameEgg.environment,
        "RELIABLE_PORT":allocation2.port.toString()
      }
     })
    }catch(e){
      await pterodactylServerService.deleteServer(pteroServer.id)
      await prisma.server.delete({
        where:{
          id:server.id
        }
      })
    }
    

  }

}