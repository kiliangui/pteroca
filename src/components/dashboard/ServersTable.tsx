"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Server, ExternalLink, HardDrive, Clock3 } from "lucide-react"
import axios from "axios"
import Link from "next/link"

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
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")

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

  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchesSearch = server.name?.toLowerCase().includes(search.toLowerCase()) ?? false
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? !server.isSuspended
          : server.isSuspended
      return matchesSearch && matchesStatus
    })
  }, [servers, search, statusFilter])

  const emptyState = (
    <Card className="border-dashed text-center py-10">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-gray-900 dark:text-white">
          <Server className="h-5 w-5" />
          No servers yet
        </CardTitle>
        <CardDescription>Launch your first instance in seconds.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild>
          <Link href="/create">Create a server</Link>
        </Button>
      </CardContent>
    </Card>
  )

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

  if (servers.length === 0) {
    return emptyState
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your instances</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Search, filter, or jump back into any server.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full sm:w-64"
          />
          <div className="inline-flex rounded-full border border-gray-200 dark:border-gray-700 p-1">
            {(["all", "active", "suspended"] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setStatusFilter(filterKey)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-full transition-colors",
                  statusFilter === filterKey
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-500"
                )}
              >
                {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredServers.length === 0 ? (
        <Card className="border-dashed text-center py-10">
          <CardContent>No servers match your filters.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredServers.map((server) => (
            <Card
              key={server.id}
              className={cn(
                "border shadow-sm transition-all",
                server.isSuspended
                  ? "border-red-200 dark:border-red-900"
                  : "border-gray-200 dark:border-gray-800"
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    {server.name || `Server ${server.id}`}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                    Created {formatDate(server.createdAt)}
                  </CardDescription>
                </div>
                <Badge variant={server.isSuspended ? "destructive" : "default"}>
                  {server.isSuspended ? "Suspended" : server.installed ? "Running" : "Pending"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <span>
                    Expires {server.expiresAt ? formatDate(server.expiresAt) : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-gray-400" />
                  <span>Status updated {formatDate(server.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {!server.installed ? (
                    <Button
                      size="sm"
                      onClick={async () => {
                        await axios.post("/api/servers/install", {
                          serverId: server.id,
                          game: server.name?.split("-")[0] || "unknown",
                          productId: server.productId?.toString() || "",
                        })
                        window.location.reload()
                      }}
                    >
                      Install
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          (window.location.href = `/sso/redirect?redirectPath=/server/${server.pterodactylServerIdentifier}`)
                        }
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Manage
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-500">
                        Logs
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
