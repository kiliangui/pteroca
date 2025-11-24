"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Square, RotateCcw, Terminal } from "lucide-react"
import { Terminal as XTerm } from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"

interface ServerInfo {
  id: string
  name: string
  status: string
  relationships?: {
    allocations?: {
      data?: Array<{
        attributes: {
          ip: string
          port: number
        }
      }>
    }
  }
}

interface ConsoleTabProps {
  serverId: number
  serverIdentifier: string | null
  userApiKey: string
  pterodactylUrl: string
}

export function ConsoleTab({ serverId, serverIdentifier, userApiKey, pterodactylUrl }: ConsoleTabProps) {
  const [command, setCommand] = useState("")
  const [isRunning, setIsRunning] = useState("Offline")
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [showEulaDialog, setShowEulaDialog] = useState(false)
  const [eulaContent, setEulaContent] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  console.log("XTERM",xtermRef.current,terminalRef.current)

  useEffect(() => {
    fetchServerInfo()

    return () => {
      if (socket) {
        socket.close()
      }
      if (xtermRef.current) {
        xtermRef.current.dispose()
      }
    }
  }, [serverId, serverIdentifier, userApiKey])

  // Initialize terminal after component mounts and DOM is ready
  useEffect(() => {
    if (!loading && terminalRef.current && !xtermRef.current) {
      initializeTerminal()
    }
  }, [loading])

  // Connect WebSocket after server info is loaded
  useEffect(() => {
    if (!loading && serverInfo && !socket) {
      connectWebSocket()
    }
  }, [loading, serverInfo, socket])

  const fetchServerInfo = async () => {
    try {
      // Get server details directly from Pterodactyl API
      const response = await fetch(`${pterodactylUrl}/api/client/servers/${serverIdentifier}`, {
        headers: {
          'Authorization': `Bearer ${userApiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setServerInfo(data.attributes)
        setIsRunning(data.attributes.status)
      }
    } catch (error) {
      console.error("Failed to fetch server info:", error)
    } finally {
      setLoading(false)
    }
  }

  const initializeTerminal = () => {
    console.log("INITIALIZING TERM")
    if (!terminalRef.current) return

    const term = new XTerm({
      theme: {
        background: '#000000',
        foreground: '#00ff00',
        cursor: '#00ff00'
      },
      fontSize: 14,
      fontFamily: 'monospace'
    })

    term.open(terminalRef.current)
    term.write('Welcome to server console\r\n')
    xtermRef.current = term
  }

  const connectWebSocket = async () => {
    try {
      // Get WebSocket credentials directly from Pterodactyl API
      const response = await fetch(`${pterodactylUrl}/api/client/servers/${serverIdentifier}/websocket`, {
        headers: {
          'Authorization': `Bearer ${userApiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json'
        }
      })

      if (!response.ok) throw new Error('Failed to get WebSocket credentials')

      const { data } = await response.json()
      const { token, socket: socketUrl } = data

      const newSocket = new WebSocket(socketUrl);

      newSocket.onopen = () => {
        console.log('Connected to Pterodactyl WebSocket')
        // Authenticate with the WebSocket
        newSocket.send(JSON.stringify({
          event: 'auth',
          args: [token]
        }))

        // Request console logs/history after authentication
        setTimeout(() => {
          newSocket.send(JSON.stringify({
            event: 'send logs',
            args: [null]
          }))
        }, 100)
      }

      newSocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log("WEBSOCKET MESSAGE : ", message)

        switch (message.event) {
          case 'console output':
              console.log(message.args[0],"console")
              console.log("XTerm",xtermRef.current)
            if (xtermRef.current) {
              xtermRef.current.write(message.args[0]+"\r\n")
              if (message.args[0].includes("eula.txt")) {
                setEulaContent(message.args[0])
                setShowEulaDialog(true)
              }
            }
            break
          case 'status':
            setIsRunning(message.args[0])
            break
          case 'stats':
            // Handle stats if needed
            break
          case 'token expiring':
          case 'token expired':
            console.log('Token expiring/expired, attempting to reconnect...')
            // Close current socket and attempt to reconnect with new token
            if (socket) {
              socket.close()
              setSocket(null)
            }
            setTimeout(() => connectWebSocket(), 1000)
            break
        }
      }

      newSocket.onclose = () => {
        console.log('Disconnected from Pterodactyl WebSocket')
      }

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      setSocket(newSocket)
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
    }
  }

  const handleStartServer = async () => {
   await socket?.send(JSON.stringify({
      event: 'set state',
      args: ['start']
    }))
  }

  const handleStopServer = async () => {
    await socket?.send(JSON.stringify({
      event: 'set state',
      args: ['stop']
    }))
  }

  const handleRestartServer = async () => {
    await socket?.send(JSON.stringify({
      event: 'set state',
      args: ['restart']
    }))
  }

  const handleSendCommand = async () => {
    if (!command.trim()) return
    await socket?.send(JSON.stringify({
      event: 'send command',
      args: [command]
    }))
  }

  const handleAcceptEula = async () => {
    try {
      // Write eula.txt file directly using Pterodactyl API
      const formData = new FormData()
      formData.append('file', 'eula.txt')
      formData.append('contents', 'eula=true')

      const response = await fetch(`${pterodactylUrl}/api/client/servers/${serverIdentifier}/files/write`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${userApiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json'
        },
        body: formData
      })
      if (response.ok) {
        setShowEulaDialog(false)
        setEulaContent("")
        if (xtermRef.current) {
          xtermRef.current.write('\r\n[INFO] EULA accepted. Server can now start.\r\n')
        }
      }
    } catch (error) {
      console.error("Failed to accept EULA:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Console
          </CardTitle>
          <CardDescription>Server console and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading console...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Console
          </CardTitle>
          <CardDescription>Server console and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant={isRunning=="running" ? "default" : "secondary"}>
              {isRunning }
            </Badge>
            {serverInfo && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span>IP: {serverInfo.relationships?.allocations?.data?.[0]?.attributes?.ip || 'N/A'}</span>
                <span className="ml-4">Port: {serverInfo.relationships?.allocations?.data?.[0]?.attributes?.port || 'N/A'}</span>
              </div>
            )}
            <div className="flex gap-2">
              {isRunning=="offline" ? (
                <Button onClick={handleStartServer} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              ) : (
                <>
                  <Button onClick={handleStopServer} variant="destructive" size="sm">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  <Button onClick={handleRestartServer} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                </>
              )}
            </div>
          </div>

          <div ref={terminalRef} className="bg-black rounded-md min-h-64 mb-4" />

          <div className="flex gap-2">
            <Input
              placeholder="Enter command..."
              value={command}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommand(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSendCommand()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSendCommand} disabled={!command.trim()}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEulaDialog} onOpenChange={setShowEulaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Minecraft End User License Agreement</DialogTitle>
            <DialogDescription>
              The server requires you to accept the Minecraft EULA to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              By accepting this agreement, you agree to the Minecraft End User License Agreement.
              This will create an eula.txt file with {'"'}eula=true{'"'} to allow the server to start.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowEulaDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAcceptEula}>
                Accept EULA
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}