import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsoleTab } from "@/components/server/ConsoleTab"
import { BackupsTab } from "@/components/server/BackupsTab"
import { DatabasesTab } from "@/components/server/DatabasesTab"
import { NetworkTab } from "@/components/server/NetworkTab"
import { SettingsTab } from "@/components/server/SettingsTab"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default async function ServerPage({ params }: ServerPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const paramsA = await params;
  const id = parseInt(paramsA.id)
  const server = await prisma.server.findFirst({
    where: {
      id: id,
      userId: session.user.id
    },
    include: {
      product: true
    }
  })

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      pterodactylUserApiKey: true
    }
  })

  // Fetch Pterodactyl URL from settings
  const pterodactylUrlSetting = await prisma.setting.findUnique({
    where: {
      name: 'pterodactyl_panel_url'
    }
  })

  const pterodactylUrl = pterodactylUrlSetting?.value || 'https://panel.example.com'

  if (!server) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Server Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your server: {server.name || `Server ${id}`}
          </p>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Server Access Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">
                  Your API Key
                </label>
                <div className="mt-1 p-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded text-sm font-mono break-all">
                  {user?.pterodactylUserApiKey || 'Not available'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 dark:text-blue-200">
                  Server Identifier
                </label>
                <div className="mt-1 p-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded text-sm font-mono">
                  {server.pterodactylServerIdentifier}
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
              Use this information to connect to the Pterodactyl API for server management.
            </p>
          </div>
        </header>

        <Tabs defaultValue="console" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="databases">Databases</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="console">
            <ConsoleTab serverId={id} serverIdentifier={server.pterodactylServerIdentifier} userApiKey={user?.pterodactylUserApiKey || ''} pterodactylUrl={pterodactylUrl} />
          </TabsContent>

          <TabsContent value="backups">
            <BackupsTab serverId={id} />
          </TabsContent>

          <TabsContent value="databases">
            <DatabasesTab serverId={id} />
          </TabsContent>

          <TabsContent value="network">
            <NetworkTab serverId={id} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab serverId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}