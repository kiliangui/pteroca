"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Server, ExternalLink, Play, Calendar } from "lucide-react"
import Link from "next/link"
import axios from "axios"

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

export function ServerCards() {
  const [servers, setServers] = useState<ServerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServers() {
      try {
        const response = await fetch("/api/user/servers")
        if (response.ok) {
          const data = await response.json()
          setServers(data.servers || [])
        }
      } catch (error) {
        console.error("Échec de la récupération des serveurs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  if (servers.length === 0) {
    return (
      <div className="col-span-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Vos Serveurs
            </CardTitle>
            <CardDescription>Gérez et surveillez vos serveurs de jeu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Aucun serveur trouvé. Créez votre premier serveur pour commencer !
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/create">
                <Button>Créer un Serveur</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {servers.map((server) => (
        <Card key={server.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold truncate">
                {server.name || `Serveur ${server.id}`}
              </CardTitle>
              <Badge variant={server.isSuspended ? "destructive" : "default"}>
                {server.isSuspended ? "Suspendu" : "Actif"}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Créé: {formatDate(server.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Statut: {!server.installed ? "Non Installé" : "Prêt à Utiliser"}
              </div>
              
              <div className="flex gap-2">
                {!server.installed ? (
                  <Button
                    onClick={async () => {
                      try {
                        await axios.post("/api/servers/install", {
                          serverId: server.id,
                          game: server.name?.split("-")[0] || "unknown",
                          productId: server.productId?.toString() || ""
                        })
                        // Refresh the page to show updated status
                        window.location.reload()
                      } catch (error) {
                        console.error("Échec de l'installation du serveur:", error)
                      }
                    }}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Installer
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      window.location.href = `/sso/redirect?redirectPath=/server/${server.pterodactylServerIdentifier}`
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Gérer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}