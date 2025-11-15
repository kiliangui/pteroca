"use client"

import { useEffect } from "react"

export function Redirect({href="/",redirect=false}){
    useEffect(()=>{
        window.location.href=href+(redirect?"?redirect="+window.location.pathname:"")
        console.log("redirecting")
    },[])
    return <></>
}