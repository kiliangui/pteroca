"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Database, Trash2, Plus, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Database {
  id: number
  name: string
  username: string
  host: string
  maxConnections: number | null
  createdAt: string
}

interface DatabasesTabProps {
  serverId: number
}

export function DatabasesTab({ serverId }: DatabasesTabProps) {
  const [databases, setDatabases] = useState<Database[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null)
  const [databaseName, setDatabaseName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchDatabases()
  }, [serverId])

  const fetchDatabases = async () => {
    try {
      const response = await fetch(`/api/servers/${serverId}/databases`)
      if (response.ok) {
        const data = await response.json()
        setDatabases(data.databases || [])
      }
    } catch (error) {
      console.error("Failed to fetch databases:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDatabase = async () => {
    if (!databaseName.trim()) return

    try {
      const response = await fetch(`/api/servers/${serverId}/databases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ database: databaseName })
      })
      if (response.ok) {
        setCreateDialogOpen(false)
        setDatabaseName("")
        fetchDatabases()
      }
    } catch (error) {
      console.error("Failed to create database:", error)
    }
  }

  const handleDeleteDatabase = async (databaseId: number) => {
    if (!confirm("Are you sure you want to delete this database? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/servers/${serverId}/databases/${databaseId}`, {
        method: "DELETE"
      })
      if (response.ok) {
        fetchDatabases()
        toast({
          title: "Success",
          description: "Database deleted successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete database",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Failed to delete database:", error)
      toast({
        title: "Error",
        description: "Failed to delete database",
        variant: "destructive"
      })
    }
  }

  const handleResetPassword = async () => {
    if (!selectedDatabase || !newPassword.trim()) return

    try {
      const response = await fetch(`/api/servers/${serverId}/databases/${selectedDatabase.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: newPassword })
      })
      if (response.ok) {
        setResetPasswordDialogOpen(false)
        setSelectedDatabase(null)
        setNewPassword("")
        toast({
          title: "Success",
          description: "Database password reset successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to reset database password",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Failed to reset database password:", error)
      toast({
        title: "Error",
        description: "Failed to reset database password",
        variant: "destructive"
      })
    }
  }

  const openResetPasswordDialog = (database: Database) => {
    setSelectedDatabase(database)
    setResetPasswordDialogOpen(true)
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
            Databases
          </CardTitle>
          <CardDescription>Manage server databases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading databases...</div>
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
                Databases
              </CardTitle>
              <CardDescription>Manage server databases</CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Database
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Database</DialogTitle>
                  <DialogDescription>
                    Create a new database for your server.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="database-name">Database Name</Label>
                    <Input
                      id="database-name"
                      value={databaseName}
                      onChange={(e) => setDatabaseName(e.target.value)}
                      placeholder="Enter database name"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateDatabase} disabled={!databaseName.trim()}>
                      Create Database
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {databases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No databases found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Max Connections</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {databases.map((database) => (
                  <TableRow key={database.id}>
                    <TableCell className="font-medium">{database.name}</TableCell>
                    <TableCell>{database.username}</TableCell>
                    <TableCell>{database.host}</TableCell>
                    <TableCell>{database.maxConnections || 'Unlimited'}</TableCell>
                    <TableCell>{formatDate(database.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openResetPasswordDialog(database)}
                          title="Reset password"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteDatabase(database.id)}
                          title="Delete database"
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

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Database Password</DialogTitle>
            <DialogDescription>
              Reset the password for database "{selectedDatabase?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleResetPassword} disabled={!newPassword.trim()}>
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}