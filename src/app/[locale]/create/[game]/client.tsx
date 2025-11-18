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
import { useTranslations } from "next-intl";
export function GameClient({offers,game,user}:any){
  const [offer, setOffer] = useState("8GB");
  const [periodName,setPeriodName] = useState("month")
  const [period,setPeriod] = useState(1)
  const [priceId,setPriceId] = useState("")
  const [productId,setProductId] = useState("")
  const t = useTranslations("create")

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




  },[offer, period, periodName])

  return <div className="max-w-2/3 m-auto">
    <h1 className="text-3xl font-bold py-4">{t("flow.clientTitle")}</h1>
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
        <Button onClick={()=>{setPeriod(1);setPeriodName("month")}} variant={periodName=="month" && period==1 ? "default": "outline"}>{t("flow.duration.monthly")}</Button>
        <Button onClick={()=>{setPeriod(3);setPeriodName("month")}} variant={periodName=="month" && period==3 ? "default": "outline"}>
          {t("flow.duration.quarterly").split(" ").slice(0,2).join(" ")}
          <span className=" rounded bg-emerald-200/20 px-1.5 py-0.5 text-sm font-semibold text-emerald-400">
            (-33%)
          </span>
        </Button>
        <Button onClick={()=>{setPeriod(1);setPeriodName("year")}} variant={periodName=="year" && period==1 ? "default": "outline"}>
          {t("flow.duration.yearly").split(" ").slice(0,2).join(" ")}
          <span className=" rounded bg-emerald-200/20 px-1.5 py-0.5 text-sm font-semibold text-emerald-400">
            (-43%)
          </span>
        </Button>
      </ButtonGroup>
                {periodName === "month" && period === 1 && (
                  <Card className={"px-8 cursor-pointer  py-6  border-2 hover:shadow-lg transition-shadow "+ (offer=="freetrial"?"border-blue-500":"border-transparent")} onClick={()=>{
                      setOffer("freetrial")
                  }}>
                    <div  className="flex items-center gap-2">
                      <div className="text-lg font-bold">{t("flow.freeTrialCard")}</div>
                      <p>({t("flow.duration.monthly")})</p>
                    </div>
                  </Card>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4 ">
                  {offers.map((o)=>{      
                    const odPrice = o.prices.find((price)=>(price.type=="month" && price.value==1)).price

                    const price = o.prices.find((price)=>(price.type==periodName && price.value==period)).price
                    const monthlyPrice = Math.ceil((periodName=="year" ? price/12 : (period==3 && periodName=="month" ? price/3:price))*100 )/100
                   return  <OfferCard key={o.id} memory={Math.ceil(o.memory/1024)+"GB"} cores={o.cpu/100} recommended={o.recommended} storage={o.diskSpace/1024+"GB"} 
                  price={monthlyPrice} ogPrice={odPrice} offer={offer} setOffer={setOffer}
                  description={t("flow.offerDescription")}
                  recommendedLabel={t("flow.recommended")}
                  />
                
})}
                
                </div>
                </div>
                <div className="mt-8 flex justify-center">
                  <SubscribeButton
                    stripePriceId={priceId.toString()}
                    productPriceId={Number(productId)}game={game}
                    content={offer=="freetrial"?t("flow.startFreeTrial"):t("flow.payNow")}
                  >
                  </SubscribeButton>
                </div>

  </div>
}

function OfferCard({
  memory, cores, storage, price, ogPrice,setOffer,offer,recommended=false,description,recommendedLabel
}){
  return (<Card onClick={()=>{
    setOffer(memory)
  }} className={"px-8 relative cursor-pointer py-6  border-2 hover:shadow-lg transition-shadow "+ (offer==memory?"border-blue-500":"border-transparent")} 
  >
    <div className="absolute top-[-10px] right-0 m-2">
      {recommended && <div className="bg-blue-600 text-white text-md px-2 py-1 rounded-tr-lg rounded-bl-lg">{recommendedLabel}</div>}
    </div>

    <div className="flex items-center justify-between p-4">
      <div>
        <div className="text-lg font-bold">{memory} RAM / {cores} CPU / {storage} de Stockage</div>
        <div className="text-sm text-gray-500">{description}</div>
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
