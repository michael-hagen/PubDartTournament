import { generateUUID } from '@/lib/utils'
import { setState, getState } from './AppStore'
import { MAX_PLAYER_NAME_LENGTH, MAX_PLAYERS, MIN_PLAYERS } from '@/globals/globals'
import { DEFAULT_EMPTY_PLAYER } from '@/globals/defaults'
import type { PlayerType } from '@/globals/types'

export function addPlayer(playerName?: string) {
  const state = getState()

  if (state.players.length >= MAX_PLAYERS) return

  let name = ''
  if (playerName) {
    const maxLen = Math.min(playerName.trim().length, MAX_PLAYER_NAME_LENGTH)
    name = playerName.trim().substring(0, maxLen)
  }

  const newPlayers = state.players.slice()
  const newPlayer = { ...DEFAULT_EMPTY_PLAYER, id: generateUUID(), name: name }
  newPlayers.push(newPlayer)
  validatePlayers(newPlayers)
  setState({ players: newPlayers })
}

export function removePlayer(playerIndex: number) {
  const state = getState()

  if (playerIndex < 0 || playerIndex > state.players.length - 1)
    throw Error(`Index out of bounds for playerIndex: ${playerIndex} players.length: ${state.players.length}`)

  // We don't delete the last player instead we set him to an empty string
  if (playerIndex === state.players.length - 1) {
    const newPlayers = state.players.slice()
    newPlayers[playerIndex] = { ...newPlayers[playerIndex], name: '' }
    validatePlayers(newPlayers)
    setState({ players: newPlayers })
    return
  }

  const newPlayers = state.players.filter((_, index) => index !== playerIndex)
  validatePlayers(newPlayers)
  setState({ players: newPlayers })
}

export function updatePlayer(playerIndex: number, playerName: string) {
  const state = getState()

  if (playerIndex < 0 || playerIndex > state.players.length - 1)
    throw Error(`Index out of bounds for playerIndex: ${playerIndex} players.length: ${state.players.length}`)

  if (playerName === null || playerName === undefined) throw Error('Player name must not be null or undefined')

  const maxLen = Math.min(playerName.trim().length, MAX_PLAYER_NAME_LENGTH)
  const name = playerName.trim().substring(0, maxLen)

  const newPlayers = state.players.slice()
  newPlayers[playerIndex] = { ...newPlayers[playerIndex], name: name }
  validatePlayers(newPlayers)
  setState({ players: newPlayers })
}

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------

function validatePlayers(newPlayers: PlayerType[]) {
  const errorMessages: string[] = []

  newPlayers.map((player, playerIndex) => {
    // Reset the error messages. We will validate the list of players and add new error messages if needed (brute force but simple)
    newPlayers[playerIndex].errorMessage = undefined

    // Check if there are players with an empty name
    // Don't check the last player because this player is for input new players and will be empty by default
    if (playerIndex < newPlayers.length - 1) {
      if (player.name.trim().length === 0) {
        newPlayers[playerIndex].errorMessage = 'ERROR_MESSAGE.EMPTY_PLAYER_NAME'
        errorMessages.push('ERROR_MESSAGE.EMPTY_PLAYER_NAME')
      }
    }

    // Check if there are players with the same name
    const otherPlayers = newPlayers.filter((_, index) => index !== playerIndex)
    const exists = otherPlayers.some((p) => p.name === player.name)

    if (exists) {
      newPlayers[playerIndex].errorMessage = 'ERROR_MESSAGE.DUPLICATE_PLAYER_NAME'
      errorMessages.push('ERROR_MESSAGE.DUPLICATE_PLAYER_NAME')
    }
  })

  // Check min/max player count ( <= because the last player is just a placeholder for adding new players)
  if (newPlayers.length <= MIN_PLAYERS || newPlayers.length > MAX_PLAYERS) {
    errorMessages.push('ERROR_MESSAGE.MIN_MAX_PLAYER')
  }

  setState({ preparationErrorMessages: errorMessages })
}
