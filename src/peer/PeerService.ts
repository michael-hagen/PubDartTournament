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
} from '@/store/PeerServiceActions'
import type { SerializableTournamentType } from '@/globals/types'
import { generateRandomConnectionString, debounce } from '@/lib/utils'
import { useAppStore } from '@/store/AppStore'

export type PeerMessageCommand = 'SYNC_STATE'
export type PeerMessageType = {
  command: PeerMessageCommand
  payload: SerializableTournamentType
}

// TODO: Replace alert messages with toast messages 
export default class PeerService {
  private static instance: PeerService | null = null
  private peer: Peer | null = null
  private clientConnections: Map<string, DataConnection> = new Map()
  private serverConnection: DataConnection | null = null
  private prevStateJSON: string = ''

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
    this.peer = new Peer(getConnectionString())

    // Check for connection errors to the signaling server
    this.peer.on('error', (err) => {
      setIsConnectionPending(false)
      setConnectionMode('NONE')
      this.peer?.destroy()
      this.peer = null
      switch (err.type) {
        case 'browser-incompatible':
          console.error('Your browser does not support WebRTC')
          alert('Your browser does not support WebRTC')
          break
        case 'peer-unavailable':
          console.error('No server with the connection code was found')
          alert('No server with the connection code was found')
          break
        case 'network':
          console.error('Network error. Please check your internet connection')
          alert('Network error. Please check your internet connection')
          break
        default:
          console.error(`Connection Error: ${err.message}`)
          alert(`Connection Error: ${err.message}`)
      }
    })

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
    this.peer = new Peer()
    // Check for connection errors to the signaling server
    this.peer.on('error', (err) => {
      setIsConnectionPending(false)
      setConnectionMode('NONE')
      this.peer?.destroy()
      this.peer = null

      switch (err.type) {
        case 'browser-incompatible':
          console.error('Your browser does not support WebRTC')
          alert('Your browser does not support WebRTC')
          break
        case 'peer-unavailable':
          console.error('No server with the connection code was found')
          alert('No server with the connection code was found')
          break
        case 'network':
          console.error('Network error. Please check your internet connection')
          alert('Network error. Please check your internet connection')
          break
        default:
          console.error(`Connection Error: ${err.message}`)
          alert(`Connection Error: ${err.message}`)
      }
    })

    this.peer.on('open', () => {
      try {
        const conn = this.peer!.connect(getConnectionString())
        const connectionTimeout = setTimeout(() => {
          if (!conn.open) {
            conn.close()
            this.peer?.destroy()
            this.peer = null
            setConnectionMode('NONE')
            setIsConnectionPending(false)
            console.error('Connection failed. Server is not responding')
            alert('Connection failed. Server is not responding')
          }
        }, 10000)

        conn.on('open', () => {
          // If connection could be opened we can clear the timeout
          clearTimeout(connectionTimeout)
          this.setupClientConnectionListeners(conn)
          setConnectionMode('CLIENT')
          setIsConnectionPending(false)
        })
      } catch (error) {
        console.error('Error try to connect to server: ', error)
        alert('Error while try to connect to server. Exception: ' + error)
      } finally {
        setIsConnectionPending(false)
      }
    })
  }

  // Close connection
  public async disconnect() {
    setIsConnectionPending(true)
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
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
    }
    setConnectionString(generateRandomConnectionString())
    setConnectionMode('NONE')
    setIsConnectionPending(false)
  }

  private setupServerConnectionListeners(conn: DataConnection) {
    conn.on('open', () => {
      this.clientConnections.set(conn.peer, conn)
      if (conn.open) {
        const currentState = getSerializableState()
        const message: PeerMessageType = { command: 'SYNC_STATE', payload: currentState }
        conn.send(message)
      }
    })

    // conn.on('data', (data: any) => {
    //   const message = data as TournamentMessage // Unser definiertes Protokoll
    //   const store = useTournamentStore.getState() // Zustand-State direkt holen

    //   switch (message.type) {
    //     case 'REQUEST_SCORING':
    //       // Push ins Zustand-Store -> Shadcn Popup öffnet sich automatisch
    //       store.addIncomingRequest({
    //         clientId: conn.peer,
    //         matchId: message.payload.matchId,
    //         clientName: message.payload.clientName,
    //       })
    //       break

    //     case 'SUBMIT_THROW':
    //       // Wurf im Master-Store verarbeiten (Score abziehen, etc.)
    //       store.handleIncomingThrow(message.payload.matchId, message.payload.throwData)
    //       // Danach neuen Gesamtstate an ALLE Clients broadcasten
    //       this.broadcastState()
    //       break
    //   }
    // })

    conn.on('close', () => {
      this.clientConnections.delete(conn.peer)
    })
  }

  private setupClientConnectionListeners(conn: DataConnection) {
    this.serverConnection = conn

    conn.on('data', (data) => {
      const message = data as PeerMessageType

      switch (message.command) {
        case 'SYNC_STATE':
          setSerializableState(message.payload)
          break
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
      if (conn.open) conn.send(message)
    })
  }
}
