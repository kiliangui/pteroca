"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"

interface SystemStats {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkUsage: number
  activeServers: number
  totalServers: number
  databaseConnections: number
  uptime: string
  lastBackup: string
}

interface LogEntry {
  id: number
  timestamp: string
  level: "info" | "warning" | "error"
  message: string
  source: string
}

export function SystemOverview() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystemStats()
    fetchSystemLogs()
  }, [])

  const fetchSystemStats = async () => {
    try {
      const response = await fetch("/api/admin/system/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch system stats:", error)
    }
  }

  const fetchSystemLogs = async () => {
    try {
      const response = await fetch("/api/admin/system/logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error("Failed to fetch system logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>Monitor system performance and health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading system information...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cpuUsage || 0}%</div>
            <Progress value={stats?.cpuUsage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.memoryUsage || 0}%</div>
            <Progress value={stats?.memoryUsage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.diskUsage || 0}%</div>
            <Progress value={stats?.diskUsage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.networkUsage || 0}%</div>
            <Progress value={stats?.networkUsage || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeServers || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {stats?.totalServers || 0} total servers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.databaseConnections || 0}</div>
            <p className="text-xs text-muted-foreground">
              active connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uptime || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              Last backup: {stats?.lastBackup || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Recent system events and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No logs available
                </div>
              ) : (
                logs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    {getLogIcon(log.level)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getLogBadgeVariant(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                        <span className="text-sm text-muted-foreground">{log.source}</span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="errors" className="space-y-4">
              {logs.filter(log => log.level === "error").slice(0, 20).map((log) => (
                <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  {getLogIcon(log.level)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getLogBadgeVariant(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                      <span className="text-sm text-muted-foreground">{log.source}</span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="warnings" className="space-y-4">
              {logs.filter(log => log.level === "warning").slice(0, 20).map((log) => (
                <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  {getLogIcon(log.level)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getLogBadgeVariant(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                      <span className="text-sm text-muted-foreground">{log.source}</span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}