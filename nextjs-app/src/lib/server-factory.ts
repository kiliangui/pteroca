import { pterodactylServerService } from './pterodactyl'

// Base server configuration interface
export interface ServerConfig {
  name: string
  userId: number
  limits: {
    memory: number
    swap: number
    disk: number
    io: number
    cpu: number
  }
  featureLimits: {
    databases: number
    allocations: number
    backups: number
  }
  allocationId: number
}

// Abstract base class for server creation
export abstract class ServerFactory {
  protected config: ServerConfig

  constructor(config: ServerConfig) {
    this.config = config
  }

  // Abstract method for egg-specific settings
  protected abstract getEggId(): number
  protected abstract getNestId(): number
  protected abstract getEnvironmentVariables(): Record<string, string>
  protected abstract getStartupCommand(): string | undefined

  // Generate the complete payload for Pterodactyl API
  async generatePayload(): Promise<Record<string, unknown>> {
    const eggId = this.getEggId()
    const nestId = this.getNestId()

    // Get egg details from Pterodactyl API using the service method
    const eggVariables = await pterodactylServerService.getEggVariables(nestId, eggId)

    // Get egg details to get startup and docker image
    // We'll use a simple approach - get the egg variables which include the egg info
    const eggData = eggVariables.length > 0 ? eggVariables[0] : null
    const defaultStartupCommand = '' // We'll let Pterodactyl use defaults
    const defaultDockerImage = 'ghcr.io/pterodactyl/yolks:java_17' // Common default

    const payload: Record<string, unknown> = {
      name: this.config.name,
      user: this.config.userId,
      egg: eggId,
      nest: nestId,
      limits: this.config.limits,
      feature_limits: this.config.featureLimits,
      allocation: {
        default: this.config.allocationId
      },
      startup: this.getStartupCommand() || defaultStartupCommand,
      docker_image: defaultDockerImage
    }

    // Include environment variables
    const envVars = this.getEnvironmentVariables()
    if (Object.keys(envVars).length > 0) {
      payload.environment = envVars
    }

    return payload
  }

  // Create the server using the generated payload
  async createServer(): Promise<import('./pterodactyl').PterodactylServer> {
    const payload = await this.generatePayload()
    console.log('Creating server with payload:', JSON.stringify(payload, null, 2))

    return await pterodactylServerService.createServer(
      this.config.name,
      this.config.userId,
      this.getEggId(),
      this.getNestId(),
      this.config.limits,
      this.config.featureLimits,
      this.config.allocationId,
      this.getStartupCommand(),
      this.getEnvironmentVariables()
    )
  }
}

// Paper/Minecraft server implementation
export class MinecraftPaperServer extends ServerFactory {
  private minecraftVersion: string
  private buildNumber: string
  private serverJarFile: string

  constructor(config: ServerConfig, options: {
    minecraftVersion?: string
    buildNumber?: string
    serverJarFile?: string
  } = {}) {
    super(config)
    this.minecraftVersion = options.minecraftVersion || 'latest'
    this.buildNumber = options.buildNumber || 'latest'
    this.serverJarFile = options.serverJarFile || 'server.jar'
  }

  protected getEggId(): number {
    return 2 // Paper egg ID
  }

  protected getNestId(): number {
    return 1 // Minecraft nest ID
  }

  protected getEnvironmentVariables(): Record<string, string> {
    return {
      MINECRAFT_VERSION: this.minecraftVersion,
      BUILD_NUMBER: this.buildNumber,
      SERVER_JARFILE: this.serverJarFile
    }
  }

  protected getStartupCommand(): string | undefined {
    return undefined // Use egg default
  }
}

// Generic server implementation for other eggs
export class GenericServer extends ServerFactory {
  private eggId: number
  private nestId: number
  private environmentVariables: Record<string, string>
  private startupCommand?: string

  constructor(config: ServerConfig, options: {
    eggId: number
    nestId: number
    environmentVariables?: Record<string, string>
    startupCommand?: string
  }) {
    super(config)
    this.eggId = options.eggId
    this.nestId = options.nestId
    this.environmentVariables = options.environmentVariables || {}
    this.startupCommand = options.startupCommand
  }

  protected getEggId(): number {
    return this.eggId
  }

  protected getNestId(): number {
    return this.nestId
  }

  protected getEnvironmentVariables(): Record<string, string> {
    return this.environmentVariables
  }

  protected getStartupCommand(): string | undefined {
    return this.startupCommand
  }
}

// Satisfactory server implementation
export class SatisfactoryServer extends ServerFactory {
  private maxPlayers: number
  private autoSaveInterval: number

  constructor(config: ServerConfig, options: {
    maxPlayers?: number
    autoSaveInterval?: number
  } = {}) {
    super(config)
    this.maxPlayers = options.maxPlayers || 4
    this.autoSaveInterval = options.autoSaveInterval || 300
  }

  protected getEggId(): number {
    return 3 // Satisfactory egg ID (example)
  }

  protected getNestId(): number {
    return 2 // Satisfactory nest ID (example)
  }

  protected getEnvironmentVariables(): Record<string, string> {
    return {
      MAXPLAYERS: this.maxPlayers.toString(),
      AUTOSAVEINTERVAL: this.autoSaveInterval.toString()
    }
  }

  protected getStartupCommand(): string | undefined {
    return undefined // Use egg default
  }
}

// Factory function to create server instances
export function createServerFactory(
  serverType: 'paper' | 'satisfactory' | 'generic',
  config: ServerConfig,
  options: Record<string, unknown> = {}
): ServerFactory {
  switch (serverType) {
    case 'paper':
      return new MinecraftPaperServer(config, options as {
        minecraftVersion?: string
        buildNumber?: string
        serverJarFile?: string
      })
    case 'satisfactory':
      return new SatisfactoryServer(config, options as {
        maxPlayers?: number
        autoSaveInterval?: number
      })
    case 'generic':
      return new GenericServer(config, options as {
        eggId: number
        nestId: number
        environmentVariables?: Record<string, string>
        startupCommand?: string
      })
    default:
      throw new Error(`Unknown server type: ${serverType}`)
  }
}