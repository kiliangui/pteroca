"use client";
import SubscribeButton from "@/components/SubscribeButton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card } from "@/components/ui/card";
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, ProductPrice } from "@prisma/client";
import axios from "axios";
import { ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export function GameClient({offers,game,user}:any){
  const [offer, setOffer] = useState("8GB");
  const [periodName,setPeriodName] = useState("month")
  const [period,setPeriod] = useState(1)
  const [priceId,setPriceId] = useState("")
  const [productId,setProductId] = useState("")

  useEffect(()=>{
    const currentOffer = offers.find((ofr)=>ofr.name==offer)
    if (offer=="freetrial"){
      setPriceId("freetrial")

    }else{
      const price = currentOffer.prices.find((price)=>(price.type==periodName && price.value==period)) as ProductPrice
      console.log("price",price)
      if (price?.stripePriceId) setPriceId(price?.stripePriceId)
      if (currentOffer.id) setProductId(currentOffer.id)
    }
    


  },[offer])
  

  return <div className="max-w-2/3 m-auto">
    <p>{priceId}</p>
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
    <div className="mt-8">
      <ButtonGroup className="mb-2 ml-auto">
        <Button onClick={()=>{setPeriod(1);setPeriodName("month")}} variant={periodName=="month" && period==1 ? "default": "outline"}>1 mois</Button>
        <Button onClick={()=>{setPeriod(3);setPeriodName("month")}} variant={periodName=="month" && period==3 ? "default": "outline"}>3 mois <span className="text-green-600 font-bold">(-33%)</span></Button>
        <Button onClick={()=>{setPeriod(1);setPeriodName("year")}} variant={periodName=="year" && period==1 ? "default": "outline"}>1 an <span className="text-green-600 font-bold">(-43%)</span></Button>
      </ButtonGroup>
                {periodName === "month" && period === 1 && (
                  <Card className={"px-8 cursor-pointer  py-6  border-2 hover:shadow-lg transition-shadow "+ (offer=="freetrial"?"border-blue-500":"border-transparent")} onClick={()=>{
                      setOffer("freetrial")
                  }}>
                    <div  className="flex items-center gap-2">
                      <div className="text-lg font-bold">Essaie gratuit</div>
                      <p>(1 mois)</p>
                    </div>
                  </Card>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4 ">
                  {offers.map((o)=>{      
                    const odPrice = o.prices.find((price)=>(price.type=="month" && price.value==1)).price

                    const price = o.prices.find((price)=>(price.type==periodName && price.value==period)).price
                    const monthlyPrice = Math.ceil((periodName=="year" ? price/12 : (period==3 && periodName=="month" ? price/3:price))*100 )/100
                   return  <OfferCard key={o.id} memory={Math.ceil(o.memory/1024)+"GB"} cores={o.cpu/100} recommended={o.recommended} storage={o.diskSpace/1024+"GB"} 
                  price={monthlyPrice} ogPrice={odPrice} offer={offer} setOffer={setOffer}/>
                
})}
                
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

                <SubscribeButton
                stripePriceId={priceId.toString()}
                productPriceId={Number(productId)}game={game}
                  content={offer=="freetrial"?"Start Free Trial":"Pay Now"}
                >
                    

                </SubscribeButton>

  </div>
}

function OfferCard({
  memory, cores, storage, price, ogPrice,setOffer,offer,recommended=false
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
        <div className="text-lg font-bold">{memory} RAM / {cores} CPU / {storage} de Stockage</div>
        <div className="text-sm text-gray-500">Perfect for small to medium-sized servers</div>
      </div>
      {ogPrice == price ? (
        <div className="text-2xl font-bold text-black">{price}€/mois</div>
      ) : (
        <div className="text-right">
          <div className="text-lg line-through text-gray-500">{ogPrice}€/mois</div>
          <div className="text-2xl font-bold text-green-600">{price}€/mois</div>
        </div>
      )}
    </div>

  </Card>
  )
}