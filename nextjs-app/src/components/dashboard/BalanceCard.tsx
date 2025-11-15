"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

interface BalanceData {
  balance: string
  currency: string
}

export function BalanceCard() {
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await fetch("/api/user/balance")
        if (response.ok) {
          const data = await response.json()
          setBalance(data)
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Balance</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {balance ? `${Math.round(Number(balance?.balance)*100)/100} ${balance.currency?balance.currency:"$"}` : "N/A"}
        </div>
        <p className="text-xs text-muted-foreground">
          Current account balance
        </p>
      </CardContent>
    </Card>
  )
}