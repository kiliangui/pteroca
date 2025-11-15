"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Server, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface ServerData {
  id: number
  pterodactylServerId: number
  pterodactylServerIdentifier: string
  name: string | null
  isSuspended: boolean
  createdAt: string
  existsOnPanel: boolean
}

interface UserServersViewProps {
  userId: string
}

export function UserServersView({ userId }: UserServersViewProps) {
  const [servers, setServers] = useState<ServerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserServers()
  }, [userId])

  const fetchUserServers = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/servers`)
      if (response.ok) {
        const data = await response.json()
        setServers(data.servers || [])
      } else {
        toast.error("Failed to load user servers")
      }
    } catch (error) {
      console.error("Failed to fetch user servers:", error)
      toast.error("Failed to load user servers")
    } finally {
      setLoading(false)
    }
  }

  const handleViewOnPanel = async (pterodactylServerId: number) => {
    try {
      const response = await fetch('/api/settings/pterodactyl-panel-url')
      if (response.ok) {
        const data = await response.json()
        const panelUrl = data.value
        if (panelUrl) {
          window.open(`${panelUrl}/admin/servers/view/${pterodactylServerId}`, '_blank')
        } else {
          toast.error("Pterodactyl panel URL not configured")
        }
      } else {
        toast.error("Failed to get Pterodactyl panel URL")
      }
    } catch (error) {
      toast.error("Failed to open server page")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading servers...</div>
        </CardContent>
      </Card>
    )
  }

  if (servers.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            No servers found for this user
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Server Name</TableHead>
            <TableHead>Identifier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Panel Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servers.map((server) => (
            <TableRow key={server.id}>
              <TableCell className="font-medium">
                {server.name || `Server ${server.id}`}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {server.pterodactylServerIdentifier}
              </TableCell>
              <TableCell>
                <Badge variant={server.isSuspended ? "destructive" : "default"}>
                  {server.isSuspended ? "Suspended" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {server.existsOnPanel ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Exists</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Not Found</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>{formatDate(server.createdAt)}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewOnPanel(server.pterodactylServerId)}
                  disabled={!server.existsOnPanel}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on Panel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}