import axios from 'axios'
import { prisma } from './prisma'

export interface PterodactylBackup {
  uuid: string
  name: string
  ignored_files: string[]
  checksum: string | null
  bytes: number
  created_at: string
  completed_at: string | null
  is_locked: boolean
  is_successful: boolean
}

export interface PterodactylBackupResponse {
  object: string
  data: Array<{
    object: string
    attributes: PterodactylBackup
  }>
}

export interface PterodactylDatabase {
  id: number
  server: number
  host: number
  database: string
  username: string
  remote: string
  max_connections: number | null
  created_at: string
  updated_at: string
}

export interface PterodactylDatabaseResponse {
  object: string
  data: Array<{
    object: string
    attributes: PterodactylDatabase
  }>
}

export interface PterodactylUser {
  id: number
  external_id: string | null
  uuid: string
  username: string
  email: string
  first_name: string
  last_name: string
  language: string
  root_admin: boolean
  '2fa': boolean
  created_at: string
  updated_at: string
}

export interface PterodactylUserResponse {
  object: string
  attributes: PterodactylUser
}

export interface PterodactylServer {
  id: number
  external_id: string | null
  uuid: string
  identifier: string
  name: string
  description: string
  suspended: boolean
  limits: {
    memory: number
    swap: number
    disk: number
    io: number
    cpu: number
  }
  feature_limits: {
    databases: number
    allocations: number
    backups: number
  }
  user: number
  node: number
  allocation: number
  nest: number
  egg: number
  pack: number | null
  container: {
    startup_command: string
    image: string
    installed: boolean
    environment: Record<string, string>
  }
  updated_at: string
  created_at: string
}

export interface PterodactylEggVariable {
  id: number
  egg_id: number
  name: string
  description: string
  env_variable: string
  default_value: string
  required: boolean
  user_viewable: boolean
  user_editable: boolean
  rules: string
  created_at: string
  updated_at: string
}

export interface PterodactylEggVariablesResponse {
  object: string
  data: Array<{
    object: string
    attributes: PterodactylEggVariable
  }>
}

export interface PterodactylServerResponse {
  object: string
  attributes: PterodactylServer
}

abstract class PterodactylService {
  protected async getSettings() {
    const panelUrlSetting = await prisma.setting.findUnique({
      where: { name: 'pterodactyl_panel_url' }
    })
    const apiKeySetting = await prisma.setting.findUnique({
      where: { name: 'pterodactyl_api_key' }
    })

    const baseUrl = panelUrlSetting?.value || ''
    const apiKey = apiKeySetting?.value || ''

    if (!baseUrl || !apiKey) {
      throw new Error('Pterodactyl API configuration missing')
    }

    return { baseUrl, apiKey }
  }

  protected async getHeaders() {
    const { apiKey } = await this.getSettings()
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  async getServerBackups(serverIdentifier: string): Promise<PterodactylBackup[]> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups`,
        { headers: await this.getHeaders() }
      )

      const data = response.data as PterodactylBackupResponse
      return data.data.map(item => item.attributes)
    } catch (error) {
      console.error('Error fetching server backups:', error)
      throw new Error('Failed to fetch server backups')
    }
  }

  async createServerBackup(
    serverIdentifier: string,
    name: string,
    ignoredFiles?: string,
    isLocked: boolean = false
  ): Promise<PterodactylBackup> {
    try {
      const response = await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups`,
        {
          name,
          ignored_files: ignoredFiles || '',
          is_locked: isLocked
        },
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error creating server backup:', error)
      throw new Error('Failed to create server backup')
    }
  }

  async deleteServerBackup(serverIdentifier: string, backupUuid: string): Promise<void> {
    try {
      await axios.delete(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups/${backupUuid}`,
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error deleting server backup:', error)
      throw new Error('Failed to delete server backup')
    }
  }

  async getBackupDownloadUrl(serverIdentifier: string, backupUuid: string): Promise<string> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups/${backupUuid}/download`,
        { headers: await this.getHeaders() }
      )

      return response.data.url
    } catch (error) {
      console.error('Error getting backup download URL:', error)
      throw new Error('Failed to get backup download URL')
    }
  }

  async restoreServerBackup(
    serverIdentifier: string,
    backupUuid: string,
    truncate: boolean = false
  ): Promise<void> {
    try {
      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups/${backupUuid}/restore`,
        { truncate },
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error restoring server backup:', error)
      throw new Error('Failed to restore server backup')
    }
  }

  async getServerDatabases(serverIdentifier: string): Promise<PterodactylDatabase[]> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases`,
        { headers: await this.getHeaders() }
      )

      const data = response.data as PterodactylDatabaseResponse
      return data.data.map(item => item.attributes)
    } catch (error) {
      console.error('Error fetching server databases:', error)
      throw new Error('Failed to fetch server databases')
    }
  }

  async createServerDatabase(
    serverIdentifier: string,
    database: string,
    remote: string = '%'
  ): Promise<PterodactylDatabase> {
    try {
      const response = await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases`,
        {
          database,
          remote
        },
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error creating server database:', error)
      throw new Error('Failed to create server database')
    }
  }

  async deleteServerDatabase(serverIdentifier: string, databaseId: number): Promise<void> {
    try {
      await axios.delete(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases/${databaseId}`,
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error deleting server database:', error)
      throw new Error('Failed to delete server database')
    }
  }

  async resetServerDatabasePassword(
    serverIdentifier: string,
    databaseId: number,
    password: string
  ): Promise<void> {
    try {
      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases/${databaseId}/reset-password`,
        { password },
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error resetting server database password:', error)
      throw new Error('Failed to reset server database password')
    }
  }

  async getEggVariables(nestId: number, eggId: number): Promise<PterodactylEggVariable[]> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/nests/${nestId}/eggs/${eggId}`,
        { headers: await this.getHeaders() }
      )

      // The egg endpoint returns the egg details, but we need to get variables separately
      const eggResponse = response.data

      // Get variables for this egg
      const variablesResponse = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/nests/${nestId}/eggs/${eggId}/variables`,
        { headers: await this.getHeaders() }
      )

      const variablesData = variablesResponse.data as PterodactylEggVariablesResponse
      return variablesData.data.map(item => item.attributes)
    } catch (error) {
      console.error('Error fetching egg variables:', error)
      throw new Error('Failed to fetch egg variables')
    }
  }

  async startServer(serverIdentifier: string, userApiKey: string): Promise<void> {
    try {
      const headers = {
        'Authorization': `Bearer ${userApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
      console.log("TRYING TO START WITH API KEY USER",headers)


      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/client/servers/${serverIdentifier}/power`,
        { signal: 'start' },
        { headers }
      )
    } catch (error) {
      console.error('Error starting server:', error)
      throw new Error('Failed to start server')
    }
  }

  async stopServer(serverIdentifier: string, userApiKey: string): Promise<void> {
    try {
      const headers = {
        'Authorization': `Bearer ${userApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/client/servers/${serverIdentifier}/power`,
        { signal: 'stop' },
        { headers }
      )
    } catch (error) {
      console.error('Error stopping server:', error)
      throw new Error('Failed to stop server')
    }
  }

  async restartServer(serverIdentifier: string, userApiKey: string): Promise<void> {
    try {
      const headers = {
        'Authorization': `Bearer ${userApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/client/servers/${serverIdentifier}/power`,
        { signal: 'restart' },
        { headers }
      )
    } catch (error) {
      console.error('Error restarting server:', error)
      throw new Error('Failed to restart server')
    }
  }

  async killServer(serverIdentifier: string, userApiKey: string): Promise<void> {
    try {
      const headers = {
        'Authorization': `Bearer ${userApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/client/servers/${serverIdentifier}/power`,
        { signal: 'kill' },
        { headers }
      )
    } catch (error) {
      console.error('Error killing server:', error)
      throw new Error('Failed to kill server')
    }
  }

  async getFreeAllocationOnNode(nodeId: number): Promise<number> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/nodes/${nodeId}/allocations`,
        { headers: await this.getHeaders() }
      )

      const allocations = response.data.data
      // Find the first available allocation (not assigned to any server)
      const freeAllocation = allocations.find((alloc: any) => !alloc.attributes.assigned)

      if (!freeAllocation) {
        throw new Error('No free allocations available on this node')
      }

      return freeAllocation.attributes.id
    } catch (error) {
      console.error('Error fetching free allocation:', error)
      throw new Error('Failed to find free allocation')
    }
  }
}

class PterodactylAccountService extends PterodactylService {
  async createUser(
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password?: string
  ): Promise<PterodactylUser> {
    try {
      const response = await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/users`,
        {
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          password
        },
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  async getUser(userId: number): Promise<PterodactylUser> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/users/${userId}`,
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user')
    }
  }

  async updateUser(
    userId: number,
    updates: Partial<{
      email: string
      username: string
      first_name: string
      last_name: string
      password: string
      root_admin: boolean
      language: string
    }>
  ): Promise<PterodactylUser> {
    try {
      const response = await axios.patch(
        `${(await this.getSettings()).baseUrl}/api/application/users/${userId}`,
        updates,
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await axios.delete(
        `${(await this.getSettings()).baseUrl}/api/application/users/${userId}`,
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Failed to delete user')
    }
  }

  async createUserApiKey(userId: number, description: string = 'API Key'): Promise<string> {
    try {
      console.log("TRYING TO CREATE API KEY FOR", userId)
      const response = await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/users/${userId}/api-keys`,
        {
          description,
          allowed_ips: []
        },
        { headers: await this.getHeaders() }
      )
      console.log("response:",response.data)

      // Return the full token, not just the identifier
      return response.data.attributes.identifier+ response.data.meta.secret_token
    } catch (error) {
      console.error('Error creating user API key:', error)
      throw new Error('Failed to create user API key')
    }
  }

  async ensureUserApiKey(userId: number): Promise<string> {
    try {
      // Check if user already has an API key in our database
      const user = await prisma.user.findFirst({
        where: { pterodactylUserId: userId },
        select: { pterodactylUserApiKey: true, id: true }
      })

      if (user?.pterodactylUserApiKey) {
        return user.pterodactylUserApiKey
      }
      

      // Create new API key
      const apiKey = await this.createUserApiKey(userId, 'User API Key for Server Management')

      // Store it in our database
      await prisma.user.update({
        where: { id: user!.id },
        data: { pterodactylUserApiKey: apiKey }
      })

      return apiKey
    } catch (error) {
      console.error('Error ensuring user API key:', error)
      throw new Error('Failed to ensure user API key')
    }
  }
}

class PterodactylServerService extends PterodactylService {
  async createServer(
    name: string,
    userId: number,
    eggId: number,
    nestId: number,
    limits: {
      memory: number
      swap: number
      disk: number
      io: number
      cpu: number
    },
    featureLimits: {
      databases: number
      allocations: number
      backups: number
    },
    allocationId: number,
    startupCommand?: string,
    environment?: Record<string, string>
  ): Promise<PterodactylServer> {
    try {
      // Get egg details to get default startup command and docker image
      const eggResponse = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/nests/${nestId}/eggs/${eggId}`,
        { headers: await this.getHeaders() }
      )

      const eggData = eggResponse.data.attributes
      const defaultStartupCommand = eggData.startup || ''
      const defaultDockerImage = eggData.docker_image || ''

      const payload: Record<string, any> = {
        name,
        user: userId,
        egg: eggId,
        nest: nestId,
        limits,
        feature_limits: featureLimits,
        allocation: {
          default: allocationId
        },
        startup: startupCommand || defaultStartupCommand,
        docker_image: defaultDockerImage
      }

      // Include environment variables if provided
      if (environment && Object.keys(environment).length > 0) {
        payload.environment = environment
      }

      console.log('Creating server with payload:', JSON.stringify(payload, null, 2))

      const response = await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers`,
        payload,
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error creating server:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data)
        console.error('Response status:', error.response?.status)
      }
      throw new Error('Failed to create server')
    }
  }

  async getServer(serverId: number): Promise<PterodactylServer> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverId}`,
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error fetching server:', error)
      throw new Error('Failed to fetch server')
    }
  }

  async updateServer(
    serverId: number,
    updates: Partial<{
      name: string
      user: number
      limits: Partial<{
        memory: number
        swap: number
        disk: number
        io: number
        cpu: number
      }>
      feature_limits: Partial<{
        databases: number
        allocations: number
        backups: number
      }>
    }>
  ): Promise<PterodactylServer> {
    try {
      const response = await axios.patch(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverId}`,
        updates,
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error updating server:', error)
      throw new Error('Failed to update server')
    }
  }

  async deleteServer(serverId: number, force: boolean = false): Promise<void> {
    try {
      await axios.delete(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverId}${force ? '?force=1' : ''}`,
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error deleting server:', error)
      throw new Error('Failed to delete server')
    }
  }

  async suspendServer(serverId: number): Promise<void> {
    try {
      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverId}/suspend`,
        {},
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error suspending server:', error)
      throw new Error('Failed to suspend server')
    }
  }

  async unsuspendServer(serverId: number): Promise<void> {
    try {
      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverId}/unsuspend`,
        {},
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error unsuspending server:', error)
      throw new Error('Failed to unsuspend server')
    }
  }

  async reinstallServer(serverId: number): Promise<void> {
    try {
      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverId}/reinstall`,
        {},
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error reinstalling server:', error)
      throw new Error('Failed to reinstall server')
    }
  }

  async getServerBackups(serverIdentifier: string): Promise<PterodactylBackup[]> {
    try {
      const { baseUrl } = await this.getSettings()
      const response = await axios.get(
        `${baseUrl}/api/application/servers/${serverIdentifier}/backups`,
        { headers: await await this.getHeaders() }
      )

      const data = response.data as PterodactylBackupResponse
      return data.data.map(item => item.attributes)
    } catch (error) {
      console.error('Error fetching server backups:', error)
      throw new Error('Failed to fetch server backups')
    }
  }

  async createServerBackup(
    serverIdentifier: string,
    name: string,
    ignoredFiles?: string,
    isLocked: boolean = false
  ): Promise<PterodactylBackup> {
    try {
      const response = await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups`,
        {
          name,
          ignored_files: ignoredFiles || '',
          is_locked: isLocked
        },
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error creating server backup:', error)
      throw new Error('Failed to create server backup')
    }
  }

  async deleteServerBackup(serverIdentifier: string, backupUuid: string): Promise<void> {
    try {
      await axios.delete(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups/${backupUuid}`,
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error deleting server backup:', error)
      throw new Error('Failed to delete server backup')
    }
  }

  async getBackupDownloadUrl(serverIdentifier: string, backupUuid: string): Promise<string> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups/${backupUuid}/download`,
        { headers: await this.getHeaders() }
      )

      return response.data.url
    } catch (error) {
      console.error('Error getting backup download URL:', error)
      throw new Error('Failed to get backup download URL')
    }
  }

  async restoreServerBackup(
    serverIdentifier: string,
    backupUuid: string,
    truncate: boolean = false
  ): Promise<void> {
    try {
      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/backups/${backupUuid}/restore`,
        { truncate },
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error restoring server backup:', error)
      throw new Error('Failed to restore server backup')
    }
  }

  async getServerDatabases(serverIdentifier: string): Promise<PterodactylDatabase[]> {
    try {
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases`,
        { headers: await this.getHeaders() }
      )

      const data = response.data as PterodactylDatabaseResponse
      return data.data.map(item => item.attributes)
    } catch (error) {
      console.error('Error fetching server databases:', error)
      throw new Error('Failed to fetch server databases')
    }
  }

  async createServerDatabase(
    serverIdentifier: string,
    database: string,
    remote: string = '%'
  ): Promise<PterodactylDatabase> {
    try {
      const response = await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases`,
        {
          database,
          remote
        },
        { headers: await this.getHeaders() }
      )

      return response.data.attributes
    } catch (error) {
      console.error('Error creating server database:', error)
      throw new Error('Failed to create server database')
    }
  }

  async deleteServerDatabase(serverIdentifier: string, databaseId: number): Promise<void> {
    try {
      await axios.delete(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases/${databaseId}`,
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error deleting server database:', error)
      throw new Error('Failed to delete server database')
    }
  }

  async resetServerDatabasePassword(
    serverIdentifier: string,
    databaseId: number,
    password: string
  ): Promise<void> {
    try {
      await axios.post(
        `${(await this.getSettings()).baseUrl}/api/application/servers/${serverIdentifier}/databases/${databaseId}/reset-password`,
        { password },
        { headers: await this.getHeaders() }
      )
    } catch (error) {
      console.error('Error resetting server database password:', error)
      throw new Error('Failed to reset server database password')
    }
  }
}

class PterodactylSyncService extends PterodactylService {
  async syncUsers(): Promise<void> {
    try {
      // Get all local users without pterodactylUserId
      const usersWithoutPteroId = await prisma.user.findMany({
        where: {
          pterodactylUserId: null,
          deletedAt: null
        }
      })

      for (const user of usersWithoutPteroId) {
        try {
          // Create Pterodactyl user
          const pteroUser = await pterodactylAccountService.createUser(
            user.email,
            user.email.split('@')[0], // username from email
            user.name || '',
            user.surname || '',
            user.password
          )

          // Update local user with pterodactylUserId
          await prisma.user.update({
            where: { id: user.id },
            data: {
              pterodactylUserId: pteroUser.id
            }
          })

          console.log(`Synced user ${user.email} with Pterodactyl ID ${pteroUser.id}`)
        } catch (error) {
          console.error(`Failed to sync user ${user.email}:`, error)
        }
      }
    } catch (error) {
      console.error('Error syncing users:', error)
      throw new Error('Failed to sync users')
    }
  }

  async syncServers(): Promise<void> {
    try {
      // Get all servers from Pterodactyl
      const response = await axios.get(
        `${(await this.getSettings()).baseUrl}/api/application/servers`,
        { headers: await this.getHeaders() }
      )

      const pteroServers = response.data.data.map((item: { attributes: PterodactylServer }) => item.attributes)

      for (const pteroServer of pteroServers) {
        try {
          // Check if server exists locally
          const existingServer = await prisma.server.findUnique({
            where: { pterodactylServerId: pteroServer.id }
          })

          if (!existingServer) {
            // Find user by pterodactylUserId
            const user = await prisma.user.findFirst({
              where: { pterodactylUserId: pteroServer.user }
            })

            if (user) {
              // Create local server
              await prisma.server.create({
                data: {
                  pterodactylServerId: pteroServer.id,
                  pterodactylServerIdentifier: pteroServer.identifier,
                  name: pteroServer.name,
                  createdAt: new Date(pteroServer.created_at),
                  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
                  isSuspended: pteroServer.suspended,
                  userId: user.id
                }
              })

              console.log(`Created local server for Pterodactyl server ${pteroServer.name}`)
            }
          } else {
            // Update existing server
            await prisma.server.update({
              where: { id: existingServer.id },
              data: {
                name: pteroServer.name,
                isSuspended: pteroServer.suspended
              }
            })

            console.log(`Updated local server ${existingServer.id}`)
          }
        } catch (error) {
          console.error(`Failed to sync server ${pteroServer.name}:`, error)
        }
      }
    } catch (error) {
      console.error('Error syncing servers:', error)
      throw new Error('Failed to sync servers')
    }
  }

  async syncServerStatus(serverId: number): Promise<void> {
    try {
      const server = await prisma.server.findUnique({
        where: { id: serverId }
      })

      if (!server) {
        throw new Error('Server not found')
      }

      const pteroServer = await pterodactylServerService.getServer(server.pterodactylServerId)

      // Update local server status
      await prisma.server.update({
        where: { id: serverId },
        data: {
          isSuspended: pteroServer.suspended
        }
      })

      console.log(`Synced status for server ${serverId}`)
    } catch (error) {
      console.error('Error syncing server status:', error)
      throw new Error('Failed to sync server status')
    }
  }

  async syncAll(): Promise<void> {
    await this.syncUsers()
    await this.syncServers()
  }
}

export const pterodactylAccountService = new PterodactylAccountService()
export const pterodactylServerService = new PterodactylServerService()
export const pterodactylSyncService = new PterodactylSyncService()