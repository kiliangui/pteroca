"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Save, RefreshCw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ServerSettings {
  name: string
  autoRenewal: boolean
  egg: string
  startupCommand: string
  environment: Record<string, string>
}

interface ConsoleTabProps {
  serverId: number
  serverIdentifier: string | null
  userApiKey: string
  pterodactylUrl: string
}


export function SettingsTab({ serverId, serverIdentifier, userApiKey, pterodactylUrl }: ConsoleTabProps) {
  const [settings, setSettings] = useState<ServerSettings>({
    name: "",
    autoRenewal: false,
    egg: "",
    startupCommand: "",
    environment: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [serverId])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/servers/${serverId}/settings`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/servers/${serverId}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Settings saved successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReinstall = async () => {
    if (!confirm("Are you sure you want to reinstall this server? This will delete all data.")) {
      return
    }

    try {
      const response = await fetch(`/api/servers/${serverId}/reinstall`, {
        method: "POST"
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Server reinstallation started successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to reinstall server",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Failed to reinstall server:", error)
      toast({
        title: "Error",
        description: "Failed to reinstall server",
        variant: "destructive"
      })
    }
  }

  const updateSetting = (key: keyof ServerSettings, value: string | boolean | Record<string, string>) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateEnvironment = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      environment: { ...prev.environment, [key]: value }
    }))
  }

  const removeEnvironmentVariable = (key: string) => {
    setSettings(prev => {
      const newEnv = { ...prev.environment }
      delete newEnv[key]
      return { ...prev, environment: newEnv }
    })
  }

  const addEnvironmentVariable = () => {
    const newKey = `VAR_${Object.keys(settings.environment).length + 1}`
    updateEnvironment(newKey, "")
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
          <CardDescription>Configure server settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading settings...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Server Settings
          </CardTitle>
          <CardDescription>Configure your server settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="server-name">Server Name</Label>
              <Input
                id="server-name"
                value={settings.name}
                onChange={(e) => updateSetting("name", e.target.value)}
                placeholder="Enter server name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="egg">Egg</Label>
              <Select value={settings.egg} onValueChange={(value) => updateSetting("egg", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select egg" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minecraft">Minecraft</SelectItem>
                  <SelectItem value="source">Source Engine</SelectItem>
                  <SelectItem value="nodejs">Node.js</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startup-command">Startup Command</Label>
            <Input
              id="startup-command"
              value={settings.startupCommand}
              onChange={(e) => updateSetting("startupCommand", e.target.value)}
              placeholder="Enter startup command"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-renewal"
              checked={settings.autoRenewal}
              onCheckedChange={(checked) => updateSetting("autoRenewal", checked)}
            />
            <Label htmlFor="auto-renewal">Auto Renewal</Label>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Environment Variables</h4>
            {Object.entries(settings.environment).map(([key, value]) => (
              <div key={key} className="flex gap-4 items-center">
                <Input
                  placeholder="Variable name"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value
                    const newEnv = { ...settings.environment }
                    delete newEnv[key]
                    newEnv[newKey] = value
                    updateSetting("environment", newEnv)
                  }}
                  className="flex-1"
                />
                <Input
                  placeholder="Variable value"
                  value={value}
                  onChange={(e) => updateEnvironment(key, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeEnvironmentVariable(key)}
                  className="px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addEnvironmentVariable}
            >
              Add Environment Variable
            </Button>
          </div>

          <Separator />

          <div className="flex gap-4">
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            <Button variant="destructive" onClick={handleReinstall}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reinstall Server
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}