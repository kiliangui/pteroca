"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserServersView } from "./UserServersView"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Users, Plus, Edit, Trash2, Search, Server } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string | null
  surname: string | null
  balance: string
  isVerified: boolean
  isBlocked: boolean
  createdAt: string
  roles: any
  pterodactylUserId: number | null
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [creatingUser, setCreatingUser] = useState<string | null>(null)
  const [selectedUserForServers, setSelectedUserForServers] = useState<User | null>(null)
  const [isServersDialogOpen, setIsServersDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.surname && user.surname.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateUser = async (formData: FormData) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast.success("User created successfully")
        setIsCreateDialogOpen(false)
        fetchUsers()
      } else {
        toast.error("Failed to create user")
      }
    } catch (error) {
      toast.error("Failed to create user")
    }
  }

  const handleUpdateUser = async (formData: FormData) => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        toast.success("User updated successfully")
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        fetchUsers()
      } else {
        toast.error("Failed to update user")
      }
    } catch (error) {
      toast.error("Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      toast.error("Failed to delete user")
    }
  }

  const handleCreatePterodactylUser = async (userId: string) => {
    setCreatingUser(userId)

    try {
      const response = await fetch(`/api/admin/users/${userId}/create-pterodactyl`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Pterodactyl user created successfully")
        fetchUsers()
      } else {
        toast.error("Failed to create Pterodactyl user")
      }
    } catch (error) {
      toast.error("Failed to create Pterodactyl user")
    } finally {
      setCreatingUser(null)
    }
  }

  const handleViewPterodactylUser = async (pterodactylUserId: number) => {
    try {
      // Get Pterodactyl panel URL from settings
      const response = await fetch('/api/settings/pterodactyl-panel-url')
      if (response.ok) {
        const data = await response.json()
        const panelUrl = data.value
        if (panelUrl) {
          window.open(`${panelUrl}/admin/users/view/${pterodactylUserId}`, '_blank')
        } else {
          toast.error("Pterodactyl panel URL not configured")
        }
      } else {
        toast.error("Failed to get Pterodactyl panel URL")
      }
    } catch (error) {
      toast.error("Failed to open Pterodactyl user page")
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
            <Users className="h-5 w-5" />
            Users Management
          </CardTitle>
          <CardDescription>Manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading users...</div>
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
                <Users className="h-5 w-5" />
                Users Management
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>Add a new user to the system</DialogDescription>
                </DialogHeader>
                <form action={handleCreateUser} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="name">First Name</Label>
                    <Input id="name" name="name" />
                  </div>
                  <div>
                    <Label htmlFor="surname">Last Name</Label>
                    <Input id="surname" name="surname" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div>
                    <Label htmlFor="balance">Balance</Label>
                    <Input id="balance" name="balance" type="number" step="0.01" defaultValue="0.00" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isVerified" name="isVerified" />
                    <Label htmlFor="isVerified">Verified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isBlocked" name="isBlocked" />
                    <Label htmlFor="isBlocked">Blocked</Label>
                  </div>
                  <Button type="submit">Create User</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pterodactyl</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <button
                      onClick={() => {
                        setSelectedUserForServers(user)
                        setIsServersDialogOpen(true)
                      }}
                      className="text-left hover:text-blue-600 transition-colors"
                    >
                      {user.name && user.surname ? `${user.name} ${user.surname}` : user.email}
                    </button>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>${parseFloat(user.balance).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={user.isVerified ? "default" : "secondary"}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                      {user.isBlocked && (
                        <Badge variant="destructive">Blocked</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.pterodactylUserId ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="default">ID: {user.pterodactylUserId}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPterodactylUser(user.pterodactylUserId!)}
                        >
                          View
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Not Created</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreatePterodactylUser(user.id)}
                          disabled={creatingUser === user.id}
                        >
                          {creatingUser === user.id ? "Creating..." : "Create"}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form action={handleUpdateUser} className="space-y-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={selectedUser.email} required />
              </div>
              <div>
                <Label htmlFor="edit-name">First Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedUser.name || ""} />
              </div>
              <div>
                <Label htmlFor="edit-surname">Last Name</Label>
                <Input id="edit-surname" name="surname" defaultValue={selectedUser.surname || ""} />
              </div>
              <div>
                <Label htmlFor="edit-balance">Balance</Label>
                <Input id="edit-balance" name="balance" type="number" step="0.01" defaultValue={selectedUser.balance} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-isVerified" name="isVerified" defaultChecked={selectedUser.isVerified} />
                <Label htmlFor="edit-isVerified">Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-isBlocked" name="isBlocked" defaultChecked={selectedUser.isBlocked} />
                <Label htmlFor="edit-isBlocked">Blocked</Label>
              </div>
              <Button type="submit">Update User</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* User Servers Dialog */}
      <Dialog open={isServersDialogOpen} onOpenChange={setIsServersDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              {selectedUserForServers?.name && selectedUserForServers?.surname
                ? `${selectedUserForServers.name} ${selectedUserForServers.surname}`
                : selectedUserForServers?.email} - Servers
            </DialogTitle>
            <DialogDescription>
              View user's servers and their Pterodactyl status
            </DialogDescription>
          </DialogHeader>
          {selectedUserForServers && (
            <UserServersView userId={selectedUserForServers.id} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}