"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save } from "lucide-react"
import { toast } from "sonner"

interface Setting {
  name: string
  value: string
  type: string
  context: string | null
  hierarchy: number
  options: Array<{
    optionKey: string
    optionValue: string
    sortOrder: number
  }>
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || [])
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async (formData: FormData) => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        toast.success("Settings saved successfully")
        fetchSettings()
      } else {
        toast.error("Failed to save settings")
      }
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const renderSettingInput = (setting: Setting) => {
    const value = setting.value

    switch (setting.type) {
      case "boolean":
        return (
          <Switch
            name={setting.name}
            defaultChecked={value === "true"}
          />
        )
      case "number":
        return (
          <Input
            name={setting.name}
            type="number"
            defaultValue={value}
          />
        )
      case "textarea":
        return (
          <Textarea
            name={setting.name}
            defaultValue={value}
          />
        )
      case "select":
        return (
          <Select name={setting.name} defaultValue={value}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options.map((option) => (
                <SelectItem key={option.optionKey} value={option.optionKey}>
                  {option.optionValue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        // Special handling for sensitive fields like API keys
        if (setting.name.includes('key') || setting.name.includes('secret')) {
          return (
            <Input
              name={setting.name}
              type="password"
              defaultValue={value}
              placeholder="Enter value..."
            />
          )
        }
        return (
          <Input
            name={setting.name}
            defaultValue={value}
          />
        )
    }
  }

  const groupSettingsByContext = () => {
    const groups: { [key: string]: Setting[] } = {}
    settings.forEach(setting => {
      const context = setting.context || "General"
      if (!groups[context]) {
        groups[context] = []
      }
      groups[context].push(setting)
    })
    return groups
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>Configure system preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading settings...</div>
        </CardContent>
      </Card>
    )
  }

  const settingGroups = groupSettingsByContext()

  return (
    <div className="space-y-6">
      <form action={handleSaveSettings}>
        {Object.entries(settingGroups).map(([context, groupSettings]) => (
          <Card key={context}>
            <CardHeader>
              <CardTitle>{context}</CardTitle>
              <CardDescription>Configure {context.toLowerCase()} settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupSettings.map((setting) => (
                <div key={setting.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-1">
                    <Label htmlFor={setting.name} className="text-sm font-medium">
                      {setting.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    {renderSettingInput(setting)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}