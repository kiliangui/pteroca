"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react"
import { useState } from "react";
export function GameClient({offers,game}){
  const [offer, setOffer] = useState("8GB");
  return <div className="max-w-2/3 m-auto">
    <h1 className="text-3xl font-bold py-4">Create Server</h1>
    <Card className=" flex rounded-lg relative p-0 items-center justify-center ">
      <div className="h-full  rounded-lg w-full absolute  " style={{backgroundImage: `url(${"/images/games/minecraft.jpg"})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>

        <div className="absolute inset-0 bg-black rounded-lg opacity-40"></div>

        </div>
        <div style={{zIndex:"2"}} className="flex w-full items-center justify-between p-4 rounded-xl cursor-pointer" >
        <ArrowLeft style={{zIndex:"2"}}  color="white" size={64} onClick={()=>{
            window.location.href=`/create`
        }} />
              <div className="text-white font-black text-4xl" style={{zIndex:"2"}}>{game}</div>
              
        </div>
      
    </Card>
    <div>
                <Card className={"px-8 cursor-pointer mt-8 py-6  border-2 hover:shadow-lg transition-shadow "+ (offer=="freetrial"?"border-blue-500":"border-transparent")} onClick={()=>{
                    setOffer("freetrial")
                }}>
                  <div >
                    <div className="text-lg font-bold mb-2">Free Trial</div>
                  </div>
                </Card>
                <div className="grid grid-cols-2 gap-4 mt-4 ">
                  {offers.map((o)=><OfferCard key={o.id} memory={Math.ceil(o.memory/1024)+"GB"} cores={o.cpu/100} recommended={o.recommended} storage={o.diskSpace/1024+"GB"} price={o?.prices.length > 0 ?o?.prices[0].price:"" } offer={offer} setOffer={setOffer} recommended={o.recommended} />)}
                
                </div>
                <h2 className="text-xl font-bold pt-4">Location</h2>
                  <Select defaultValue="eu-fr">
                    <SelectTrigger className="w-[180px] mt-2">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu-fr">Europe - France</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="mt-8 w-full" size="lg" onClick={()=>{

                 window.location.href=`/create/${game}/${offer}`

                }}>
                    {offer=="freetrial"?"Start Free Trial":"Continue to Checkout"}
                  
                </Button>

  </div>
}

function OfferCard({
  memory, cores, storage, price,setOffer,offer,recommended=false
}){
  return (<Card onClick={()=>{
    setOffer(memory)
  }} className={"px-8 relative cursor-pointer py-6  border-2 hover:shadow-lg transition-shadow "+ (offer==memory?"border-blue-500":"border-transparent")} 
  >
    <div className="absolute top-[-10px] right-0 m-2">
      {recommended && <div className="bg-blue-600 text-white text-md px-2 py-1 rounded-tr-lg rounded-bl-lg">Recommended</div>}
    </div>

    <div className="flex items-center justify-between p-4">
      <div>
        <div className="text-lg font-bold">{memory} RAM / {cores} Cores / {storage} Storage</div>
        <div className="text-sm text-gray-500">Perfect for small to medium-sized servers</div>
      </div>
      <div className="text-2xl font-bold">{price}€/month</div>
    </div>

  </Card>
  )
}