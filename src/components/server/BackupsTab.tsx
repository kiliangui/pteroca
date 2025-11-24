"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Database, Download, Trash2, Plus, RotateCcw } from "lucide-react"

interface Backup {
  id: string
  name: string
  size: string
  createdAt: string
  status: "completed" | "pending" | "failed"
}

interface ConsoleTabProps {
  serverId: number
  serverIdentifier: string | null
  userApiKey: string
  pterodactylUrl: string
}

export function BackupsTab({ serverId, serverIdentifier, userApiKey, pterodactylUrl }: ConsoleTabProps) {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [backupName, setBackupName] = useState("")

  useEffect(() => {
    fetchBackups()
  }, [serverId])

  const fetchBackups = async () => {
    try {
      const response = await fetch(`${pterodactylUrl}/api/client/servers/${serverIdentifier}/backups`,{
        headers: {
          'Authorization': `Bearer ${userApiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBackups(data.backups || [])
      }
    } catch (error) {
      console.error("Failed to fetch backups:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    if (!backupName.trim()) return

    try {
      const response = await fetch(`${pterodactylUrl}/api/client/servers/${serverIdentifier}/backups`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${userApiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json'
        },
        body: JSON.stringify({ name: backupName })
      })
      if (response.ok) {
        setCreateDialogOpen(false)
        setBackupName("")
        fetchBackups()
      }
    } catch (error) {
      console.error("Failed to create backup:", error)
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/servers/${serverId}/backups/${backupId}`, {
        method: "DELETE"
      })
      if (response.ok) {
        fetchBackups()
      }
    } catch (error) {
      console.error("Failed to delete backup:", error)
    }
  }

  const handleDownloadBackup = async (backupId: string) => {
    try {
      // Redirect to download URL
      window.open(`/api/servers/${serverId}/backups/${backupId}/download`, '_blank')
    } catch (error) {
      console.error("Failed to download backup:", error)
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm("Are you sure you want to restore this backup? This will overwrite your current server data.")) {
      return
    }

    try {
      const response = await fetch(`/api/servers/${serverId}/backups/${backupId}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ truncate: false })
      })
      if (response.ok) {
        alert("Backup restoration initiated. The server will restart automatically.")
        fetchBackups()
      }
    } catch (error) {
      console.error("Failed to restore backup:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backups
          </CardTitle>
          <CardDescription>Manage server backups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading backups...</div>
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
                <Database className="h-5 w-5" />
                Backups
              </CardTitle>
              <CardDescription>Manage server backups</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Backup</DialogTitle>
                  <DialogDescription>
                    Create a backup of your server data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backup-name">Backup Name</Label>
                    <Input
                      id="backup-name"
                      value={backupName}
                      onChange={(e) => setBackupName(e.target.value)}
                      placeholder="Enter backup name"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBackup} disabled={!backupName.trim()}>
                      Create Backup
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No backups found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          backup.status === "completed"
                            ? "default"
                            : backup.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(backup.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadBackup(backup.id)}
                          disabled={backup.status !== "completed"}
                          title="Download backup"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={backup.status !== "completed"}
                          title="Restore backup"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBackup(backup.id)}
                          title="Delete backup"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}