"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Network, Plus, Trash2, Globe } from "lucide-react"

interface Allocation {
  id: string
  ip: string
  port: number
  protocol: "tcp" | "udp"
  status: "active" | "inactive"
  description?: string
}

interface NetworkTabProps {
  serverId: number
}

export function NetworkTab({ serverId }: NetworkTabProps) {
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [port, setPort] = useState("")
  const [protocol, setProtocol] = useState<"tcp" | "udp">("tcp")
  const [description, setDescription] = useState("")

  useEffect(() => {
    fetchAllocations()
  }, [serverId])

  const fetchAllocations = async () => {
    try {
      const response = await fetch(`/api/servers/${serverId}/network`)
      if (response.ok) {
        const data = await response.json()
        setAllocations(data.allocations || [])
      }
    } catch (error) {
      console.error("Failed to fetch network allocations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAllocation = async () => {
    if (!port.trim()) return

    try {
      const response = await fetch(`/api/servers/${serverId}/network`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          port: parseInt(port),
          protocol,
          description
        })
      })
      if (response.ok) {
        setCreateDialogOpen(false)
        setPort("")
        setProtocol("tcp")
        setDescription("")
        fetchAllocations()
      }
    } catch (error) {
      console.error("Failed to create allocation:", error)
    }
  }

  const handleDeleteAllocation = async (allocationId: string) => {
    try {
      const response = await fetch(`/api/servers/${serverId}/network/${allocationId}`, {
        method: "DELETE"
      })
      if (response.ok) {
        fetchAllocations()
      }
    } catch (error) {
      console.error("Failed to delete allocation:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network
          </CardTitle>
          <CardDescription>Manage network allocations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading network allocations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Allocations
              </CardTitle>
              <CardDescription>Manage server network ports and allocations</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Allocation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Network Allocation</DialogTitle>
                  <DialogDescription>
                    Allocate a new port for your server.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="Enter port number"
                      min="1"
                      max="65535"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protocol">Protocol</Label>
                    <Select value={protocol} onValueChange={(value: "tcp" | "udp") => setProtocol(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP</SelectItem>
                        <SelectItem value="udp">UDP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAllocation} disabled={!port.trim()}>
                      Add Allocation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {allocations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No network allocations found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell className="font-mono text-sm">{allocation.ip}</TableCell>
                    <TableCell className="font-mono text-sm">{allocation.port}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{allocation.protocol.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={allocation.status === "active" ? "default" : "secondary"}>
                        {allocation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{allocation.description || "-"}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAllocation(allocation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Connection Info
          </CardTitle>
          <CardDescription>Server connection details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Server IP</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {allocations.find(a => a.status === "active")?.ip || "Not allocated"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Primary Port</Label>
                <p className="text-sm text-muted-foreground font-mono">
                  {allocations.find(a => a.status === "active")?.port || "Not allocated"}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Use these details to connect to your server from external applications.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}