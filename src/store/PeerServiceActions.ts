import type { ConnectionModeType, SerializableTournamentType } from '@/globals/types'
import { getState, setState } from './AppStore'

export function setIsConnectionPending(value: boolean) {
  setState({
    isConnectionPending: value,
  })
}

export function getConnectionString(): string {
  return getState().connectionString
}

export function setConnectionString(value: string) {
  setState({
    connectionString: value,
  })
}

export function getConnectionMode(): ConnectionModeType {
  return getState().connectionMode
}

export function setConnectionMode(value: ConnectionModeType) {
  setState({
    connectionMode: value,
  })
}

export function getSerializableState(): SerializableTournamentType {
  const state = getState()
  return {
    gameState: state.gameState,
    gameVariant: state.gameVariant,
    gameMode: state.gameMode,
    gameOpening: state.gameOpening,
    gameCheckout: state.gameCheckout,
    gameLegs: state.gameLegs,
    gameElimination: state.gameElimination,
    gameMatchForThirdPlace: state.gameMatchForThirdPlace,
    players: structuredClone(state.players),
    tournament: structuredClone(state.tournament),
    showConfetti: state.showConfetti,
  }
}

export function setSerializableState(state: SerializableTournamentType) {
  setState({
    gameState: state.gameState,
    gameVariant: state.gameVariant,
    gameMode: state.gameMode,
    gameOpening: state.gameOpening,
    gameCheckout: state.gameCheckout,
    gameLegs: state.gameLegs,
    gameElimination: state.gameElimination,
    gameMatchForThirdPlace: state.gameMatchForThirdPlace,
    players: structuredClone(state.players),
    tournament: structuredClone(state.tournament),
    showConfetti: state.showConfetti,
  })
}
