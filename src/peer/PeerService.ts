import Peer from 'peerjs'
import type { DataConnection } from 'peerjs'
import {
  getConnectionString,
  getSerializableState,
  setConnectionMode,
  setIsConnectionPending,
  setConnectionString,
  setSerializableState,
  getConnectionMode,
  setSelectedTab,
} from '@/store/PeerServiceActions'
import type { SerializableTournamentType } from '@/globals/types'
import { generateRandomConnectionString, debounce } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'
import { t } from 'i18next'

export type PeerMessageCommand = 'SYNC_STATE'
export type PeerMessageType = {
  command: PeerMessageCommand
  payload: SerializableTournamentType
}

export default class PeerService {
  private static instance: PeerService | null = null
  private peer: Peer | null = null
  private clientConnections: Map<string, DataConnection> = new Map()
  private serverConnection: DataConnection | null = null
  private prevStateJSON: string = ''
  private errorMessages: string[] = []

  // Singleton with lazy initialization
  private constructor() {}

  public static getInstance(): PeerService {
    if (!PeerService.instance) {
      PeerService.instance = new PeerService()
      useAppStore.subscribe(debounce(PeerService.instance.appStoreChangeListener, 500))
    }
    return PeerService.instance
  }

  // Share as server
  public async share() {
    setIsConnectionPending(true)
    this.errorMessages = []
    this.peer = new Peer(getConnectionString())
    this.setupPeerErrorListener()

    // Listen to peer been opened
    this.peer.on('open', (id: string) => {
      setConnectionString(id)
      setConnectionMode('SERVER')
      setIsConnectionPending(false)
    })

    // Listen to incoming connections
    this.peer.on('connection', (conn) => {
      this.setupServerConnectionListeners(conn)
    })
  }

  // Connect as client
  public async connect() {
    setIsConnectionPending(true)
    this.errorMessages = []
    this.peer = new Peer()
    this.setupPeerErrorListener()

    this.peer.on('open', () => {
      try {
        const conn = this.peer!.connect(getConnectionString())
        const connectionTimeout = setTimeout(() => {
          if (!conn.open) {
            this.peer?.destroy()
            this.peer = null
            this.errorMessages.push(t('app:ERROR_MESSAGE.CONNECTION_TIMEOUT'))
            setConnectionMode('NONE')
            setIsConnectionPending(false)
          }
        }, 10000)

        conn.on('open', () => {
          // If connection could be opened we can clear the timeout
          clearTimeout(connectionTimeout)
          this.setupClientConnectionListeners(conn)
          setSelectedTab('PREPARATION')
          setConnectionMode('CLIENT')
          setIsConnectionPending(false)
        })
      } catch (error) {
        this.errorMessages.push(t('app:ERROR_MESSAGE.CONNECTION_ERROR', { errorMessage: error }))
        this.peer?.destroy()
        this.peer = null
        setConnectionMode('NONE')
        setIsConnectionPending(false)
      }
    })
  }

  // Close connection
  public async disconnect() {
    setIsConnectionPending(true)
    this.errorMessages = []
    try {
      if (this.serverConnection) {
        // Disconnect a client
        this.serverConnection.close()
        this.serverConnection = null
      } else {
        // Disconnect a server
        this.clientConnections.forEach((conn) => {
          if (conn.open) conn.close()
        })
        this.clientConnections.clear()
      }
      this.peer?.destroy()
      this.peer = null
      setConnectionString(generateRandomConnectionString())
      setConnectionMode('NONE')
    } finally {
      setIsConnectionPending(false)
    }
  }

  public hasErrors(): boolean {
    return this.errorMessages.length > 0
  }

  public getErrorMessages(): string[] {
    return this.errorMessages.slice()
  }

  private setupPeerErrorListener() {
    // Check for connection errors to the signaling server
    this.peer?.on('error', (err) => {
      this.peer?.destroy()
      this.peer = null
      switch (err.type) {
        case 'browser-incompatible':
          this.errorMessages.push(t('app:ERROR_MESSAGE.CONNECTION_BROWSER_INCOMPATIBLE'))
          break
        case 'peer-unavailable':
          this.errorMessages.push(t('app:ERROR_MESSAGE.CONNECTION_PEER_UNAVAILABLE'))
          break
        case 'network':
          this.errorMessages.push(t('app:ERROR_MESSAGE.CONNECTION_PEER_NETWORK'))
          break
        default:
          this.errorMessages.push(t('app:ERROR_MESSAGE.CONNECTION_ERROR', { errorMessage: err.message }))
      }
      setConnectionMode('NONE')
      setIsConnectionPending(false)
    })
  }

  private setupServerConnectionListeners(conn: DataConnection) {
    conn.on('open', () => {
      try {
        this.clientConnections.set(conn.peer, conn)
        if (conn.open) {
          const currentState = getSerializableState()
          const message: PeerMessageType = { command: 'SYNC_STATE', payload: currentState }
          conn.send(message)
        }
      } catch (error) {
        console.error('Exception try to send data to clients. Error: ', error)
      }
    })

    conn.on('close', () => {
      this.clientConnections.delete(conn.peer)
    })
  }

  private setupClientConnectionListeners(conn: DataConnection) {
    this.serverConnection = conn

    conn.on('data', (data) => {
      try {
        const message = data as PeerMessageType

        switch (message.command) {
          case 'SYNC_STATE':
            setSerializableState(message.payload)
            break
        }
      } catch (error) {
        console.error('Exception receiving data from server. Error: ', error)
      }
    })
  }

  private appStoreChangeListener() {
    // The context of this method is not the PeerService class, it runs in the context of AppStore.subscribe see above, but we can use PeerService.instance instead of this
    if (getConnectionMode() !== 'SERVER') return
    if (!PeerService.instance || PeerService.instance.clientConnections.size === 0) return

    const currentState = getSerializableState()
    const currentStateJSON = JSON.stringify(currentState)

    if (currentStateJSON === PeerService.instance.prevStateJSON) return

    PeerService.instance.prevStateJSON = currentStateJSON

    const message: PeerMessageType = { command: 'SYNC_STATE', payload: currentState }
    PeerService.instance.clientConnections.forEach((conn) => {
      try {
        if (conn.open) conn.send(message)
      } catch (error) {
        console.error('Exception broadcast data from server. Error: ', error)
      }
    })
  }
}
