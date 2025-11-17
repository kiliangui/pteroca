"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Server, ExternalLink } from "lucide-react"
import Link from "next/link"
import axios from "axios"

interface ServerData {
  id: number
  name: string | null
  pterodactylServerIdentifier: string
  isSuspended: boolean
  installed: boolean
  productId: number | null
  expiresAt: string
  createdAt: string
}

export function ServersTable() {
  const [servers, setServers] = useState<ServerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServers() {
      try {
        const response = await fetch("/api/user/servers")
        if (response.ok) {
          const data = await response.json()
          setServers(data.servers || [])
        }
      } catch (error) {
        console.error("Failed to fetch servers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Recent Servers
          </CardTitle>
          <CardDescription>Your server overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading servers...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Recent Servers
        </CardTitle>
        <CardDescription>Your server overview</CardDescription>
      </CardHeader>
      <CardContent>
        
        {servers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No servers found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servers.slice(0, 5).map((server) => (
                <TableRow key={server.id}>
                  <TableCell className="font-medium">
                    {server.name || `Server ${server.id}`}
                  </TableCell>
 
                  <TableCell>
                    <Badge variant={server.isSuspended ? "destructive" : "default"}>
                      {server.isSuspended ? "Suspended" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!server.installed ? <Button onClick={async ()=>{
                      await axios.post("/api/servers/install",{
                        serverId:server.id,
                        game:server.name?.split("-")[0] || "unknown",
                        productId: server.productId?.toString() || ""

                      })
                        window.location.reload()
                    }}>Install</Button>:
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/sso/redirect?redirectPath=/server/${server.pterodactylServerIdentifier}`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}