"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

interface ActivityData {
  id: number
  actionId: string
  details: string | null
  createdAt: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch("/api/user/activity")
        if (response.ok) {
          const data = await response.json()
          setActivities(data.activities || [])
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getActionBadge = (actionId: string) => {
    const actionMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      "user.login": { label: "Login", variant: "default" },
      "user.register": { label: "Registration", variant: "secondary" },
      "server.create": { label: "Server Created", variant: "default" },
      "server.delete": { label: "Server Deleted", variant: "destructive" },
      "payment.create": { label: "Payment", variant: "outline" },
    }

    return actionMap[actionId] || { label: actionId, variant: "outline" }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading activity...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your account activity</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity) => {
              const badge = getActionBadge(activity.actionId)
              return (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    {activity.details && (
                      <span className="text-sm text-muted-foreground">
                        {activity.details}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}