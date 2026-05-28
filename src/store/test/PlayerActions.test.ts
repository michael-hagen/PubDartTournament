import { describe, expect, test } from 'vitest'
import { getState } from '../AppStore'
import { newTournament } from '../TournamentActions'
import { DEFAULT_EMPTY_PLAYER } from '@/globals/defaults'
import { addPlayer, removePlayer, updatePlayer } from '../PlayerActions'

describe('TournamentActions.ts exported functions', () => {
  test('One empty player in the list of players', () => {
    const state = getState()
    newTournament()
    expect(state.players).toHaveLength(1)
    expect(state.players[0]).toEqual({
      id: expect.any(String),
      name: DEFAULT_EMPTY_PLAYER.name,
      rank: DEFAULT_EMPTY_PLAYER.rank,
      roundReached: DEFAULT_EMPTY_PLAYER.roundReached,
      wonMatches: DEFAULT_EMPTY_PLAYER.wonMatches,
      lostMatches: DEFAULT_EMPTY_PLAYER.lostMatches,
      wonLegs: DEFAULT_EMPTY_PLAYER.wonLegs,
      lostLegs: DEFAULT_EMPTY_PLAYER.lostLegs,
      remainingPoints: DEFAULT_EMPTY_PLAYER.remainingPoints,
      errorMessage: DEFAULT_EMPTY_PLAYER.errorMessage,
    })
  })

  test('Update player throw error for illegal index', () => {
    const playerName = 'The Power'
    const playerIndex = 1
    newTournament()

    const state = getState()
    expect(() => updatePlayer(playerIndex, playerName)).toThrow(
      `Index out of bounds for playerIndex: ${playerIndex} players.length: ${state.players.length}`,
    )
  })

  test('Update player throw error for player name of null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerNameNull: any = null
    newTournament()

    expect(() => updatePlayer(0, playerNameNull)).toThrow('Player name must not be null or undefined')
  })

  test('Update player', () => {
    const playerName = 'The Power'
    newTournament()
    updatePlayer(0, playerName)

    const state = getState()
    expect(state.players).toHaveLength(1)
    expect(state.players[0]).toEqual({
      id: expect.any(String),
      name: playerName,
      rank: DEFAULT_EMPTY_PLAYER.rank,
      roundReached: DEFAULT_EMPTY_PLAYER.roundReached,
      wonMatches: DEFAULT_EMPTY_PLAYER.wonMatches,
      lostMatches: DEFAULT_EMPTY_PLAYER.lostMatches,
      wonLegs: DEFAULT_EMPTY_PLAYER.wonLegs,
      lostLegs: DEFAULT_EMPTY_PLAYER.lostLegs,
      remainingPoints: DEFAULT_EMPTY_PLAYER.remainingPoints,
      errorMessage: DEFAULT_EMPTY_PLAYER.errorMessage,
    })
  })

  test('Add player with no argument', () => {
    const playerNames = ['The Power', '']
    newTournament()
    updatePlayer(0, playerNames[0])
    addPlayer()

    const state = getState()
    expect(state.players).toHaveLength(2)

    state.players.forEach((player, index) => {
      expect(player).toEqual({
        id: expect.any(String),
        name: playerNames[index],
        rank: DEFAULT_EMPTY_PLAYER.rank,
        roundReached: DEFAULT_EMPTY_PLAYER.roundReached,
        wonMatches: DEFAULT_EMPTY_PLAYER.wonMatches,
        lostMatches: DEFAULT_EMPTY_PLAYER.lostMatches,
        wonLegs: DEFAULT_EMPTY_PLAYER.wonLegs,
        lostLegs: DEFAULT_EMPTY_PLAYER.lostLegs,
        remainingPoints: DEFAULT_EMPTY_PLAYER.remainingPoints,
        errorMessage: DEFAULT_EMPTY_PLAYER.errorMessage,
      })
    })
  })

  test('Add 3 players with names', () => {
    const playerNames = ['The Power', 'Snakebite', 'The Green Machine', 'Jackpot']
    newTournament()
    updatePlayer(0, playerNames[0])
    addPlayer(playerNames[1])
    addPlayer(playerNames[2])
    addPlayer(playerNames[3])

    const state = getState()
    expect(state.players).toHaveLength(4)

    state.players.forEach((player, index) => {
      expect(player).toEqual({
        id: expect.any(String),
        name: playerNames[index],
        rank: DEFAULT_EMPTY_PLAYER.rank,
        roundReached: DEFAULT_EMPTY_PLAYER.roundReached,
        wonMatches: DEFAULT_EMPTY_PLAYER.wonMatches,
        lostMatches: DEFAULT_EMPTY_PLAYER.lostMatches,
        wonLegs: DEFAULT_EMPTY_PLAYER.wonLegs,
        lostLegs: DEFAULT_EMPTY_PLAYER.lostLegs,
        remainingPoints: DEFAULT_EMPTY_PLAYER.remainingPoints,
        errorMessages: DEFAULT_EMPTY_PLAYER.errorMessage,
      })
    })
  })

  test('Add player with duplicate names', () => {
    const playerNames = ['The Power', 'Snakebite', 'The Green Machine', 'Jackpot', 'Snakebite']
    newTournament()
    updatePlayer(0, playerNames[0])
    addPlayer(playerNames[1])
    addPlayer(playerNames[2])
    addPlayer(playerNames[3])
    addPlayer(playerNames[4])

    const state = getState()
    expect(state.players).toHaveLength(5)

    state.players.forEach((player, index) => {
      expect(player).toEqual({
        id: expect.any(String),
        name: playerNames[index],
        rank: DEFAULT_EMPTY_PLAYER.rank,
        roundReached: DEFAULT_EMPTY_PLAYER.roundReached,
        wonMatches: DEFAULT_EMPTY_PLAYER.wonMatches,
        lostMatches: DEFAULT_EMPTY_PLAYER.lostMatches,
        wonLegs: DEFAULT_EMPTY_PLAYER.wonLegs,
        lostLegs: DEFAULT_EMPTY_PLAYER.lostLegs,
        remainingPoints: DEFAULT_EMPTY_PLAYER.remainingPoints,
        errorMessage:
          index === 1 || index === 4 ? 'ERROR_MESSAGE.DUPLICATE_PLAYER_NAME' : DEFAULT_EMPTY_PLAYER.errorMessage,
      })
    })
  })

  test('Remove player throw error for illegal index', () => {
    const playerIndex = 1
    newTournament()

    const state = getState()
    expect(() => removePlayer(playerIndex)).toThrow(
      `Index out of bounds for playerIndex: ${playerIndex} players.length: ${state.players.length}`,
    )
  })

  test('Remove player 2', () => {
    const playerNames = ['The Power', 'Snakebite', 'The Green Machine', 'Jackpot']
    const expectedPlayerNames = ['The Power', 'Snakebite', 'Jackpot']
    newTournament()
    updatePlayer(0, playerNames[0])
    addPlayer(playerNames[1])
    addPlayer(playerNames[2])
    addPlayer(playerNames[3])

    removePlayer(2)

    const state = getState()
    expect(state.players).toHaveLength(3)

    state.players.forEach((player, index) => {
      expect(player).toEqual({
        id: expect.any(String),
        name: expectedPlayerNames[index],
        rank: DEFAULT_EMPTY_PLAYER.rank,
        roundReached: DEFAULT_EMPTY_PLAYER.roundReached,
        wonMatches: DEFAULT_EMPTY_PLAYER.wonMatches,
        lostMatches: DEFAULT_EMPTY_PLAYER.lostMatches,
        wonLegs: DEFAULT_EMPTY_PLAYER.wonLegs,
        lostLegs: DEFAULT_EMPTY_PLAYER.lostLegs,
        remainingPoints: DEFAULT_EMPTY_PLAYER.remainingPoints,
        errorMessage: DEFAULT_EMPTY_PLAYER.errorMessage,
      })
    })
  })
})
