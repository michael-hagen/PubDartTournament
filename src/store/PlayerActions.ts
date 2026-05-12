import { generateUUID } from '@/lib/utils'
import { setState, getState } from './AppStore'
import { MAX_PLAYERS, MIN_PLAYERS } from '@/globals/globals'
import { DEFAULT_EMPTY_PLAYER } from '@/globals/defaults'
import type { PlayerType } from '@/globals/types'

// export function addDummyPlayers() {
//   const newPlayers: PlayerType[] = [
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Micky',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Euli',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Franz',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Bambi',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Christian',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Janik',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Harald',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Phil Taylor',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Jackpot',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Marco',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Pete',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Snakebite',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: 'Van Gerwen',
//     },
//     {
//       ...DEFAULT_EMPTY_PLAYER,
//       id: generateUUID(),
//       name: '',
//     },
//   ]
//   validatePlayers(newPlayers)
//   setState({ players: newPlayers })
// }

export function addPlayer() {
  const state = getState()

  if (state.players.length >= MAX_PLAYERS) return

  const newPlayers = state.players.slice()
  const newPlayer = { ...DEFAULT_EMPTY_PLAYER, id: generateUUID() }
  newPlayers.push(newPlayer)
  validatePlayers(newPlayers)
  setState({ players: newPlayers })
}

export function removePlayer(playerIndex: number) {
  const state = getState()

  if (playerIndex < 0 || playerIndex > state.players.length - 1) return

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

  if (playerIndex < 0 || playerIndex > state.players.length - 1) return

  const newPlayers = state.players.slice()
  newPlayers[playerIndex] = { ...newPlayers[playerIndex], name: playerName }
  validatePlayers(newPlayers)
  setState({ players: newPlayers })
}

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------

function validatePlayers(newPlayers: PlayerType[]) {
  // Reset the preparation error
  setState({ preparationError: false })

  newPlayers.map((player, playerIndex) => {
    // Reset the error messages. We will validate the list of players and add new error messages if needed (brute force but simple)
    newPlayers[playerIndex].errorMessage = undefined

    // Check if there are players with an empty name
    // Don't check the last player because this player is for input new players and will be empty by default
    if (playerIndex < newPlayers.length - 1) {
      if (player.name.trim().length === 0) {
        newPlayers[playerIndex].errorMessage = 'ERROR_MESSAGE.EMPTY_PLAYER_NAME'
        setState({ preparationError: true })
      }
    }

    // Check if there are players with the same name
    const otherPlayers = newPlayers.filter((_, index) => index !== playerIndex)
    const exists = otherPlayers.some((p) => p.name === player.name)

    if (exists) {
      newPlayers[playerIndex].errorMessage = 'ERROR_MESSAGE.DUPLICATE_PLAYER_NAME'
      setState({ preparationError: true })
    }
  })

  // Check min/max player count
  if (newPlayers.length < MIN_PLAYERS) {
    setState({ preparationError: true })
  }
  if (newPlayers.length > MAX_PLAYERS) {
    setState({ preparationError: true })
  }
}
