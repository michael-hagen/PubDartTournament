import {
  calculateDoubleEliminationRounds,
  calculateEliminationRounds,
  generateUUID,
  nextPowerOfTwo,
  shuffleArray,
} from '@/lib/utils'
import { setState, getState } from './AppStore'
import type { MatchRowType, MatchType, PlayerType, RoundType, TournamentType } from '@/globals/types'
import {
  DEFAULT_EMPTY_PLAYER,
  DEFAULT_EMPTY_TOURNAMENT,
  DEFAULT_GAME_CHECKOUT,
  DEFAULT_GAME_ELIMINATION,
  DEFAULT_GAME_LEGS,
  DEFAULT_GAME_MODE,
  DEFAULT_GAME_OPENING,
  DEFAULT_GAME_STATE,
  DEFAULT_GAME_VARIANT,
  DEFAULT_GET_A_BYE_PLAYER,
  DEFAULT_LEG_VALUE,
  DEFAULT_TOURNAMENT_PANEL_SCALE,
} from '@/globals/defaults'
import { prepareGetAByeMatch } from './MatchActions'

export function newTournament() {
  const state = getState()
  if (state.connectionMode === 'CLIENT') return

  const newTournament = {
    gameState: DEFAULT_GAME_STATE,
    gameVariant: DEFAULT_GAME_VARIANT,
    gameMode: DEFAULT_GAME_MODE,
    gameOpening: DEFAULT_GAME_OPENING,
    gameCheckout: DEFAULT_GAME_CHECKOUT,
    gameLegs: DEFAULT_GAME_LEGS,
    gameElimination: DEFAULT_GAME_ELIMINATION,
    gameMatchForThirdPlace: false,
    players: [{ ...DEFAULT_EMPTY_PLAYER, id: generateUUID() }] as PlayerType[],
    tournament: structuredClone(DEFAULT_EMPTY_TOURNAMENT),
    tournamentPanelScale: DEFAULT_TOURNAMENT_PANEL_SCALE,
    selectedTab: DEFAULT_GAME_STATE,
    showConfetti: false,
    // A new tournament has an empty list of players so we have an error by default
    // This prevents the user to start the tournament without a valid list of players
    preparationErrorMessages: ['ERROR_MESSAGE.MIN_MAX_PLAYER'],
  }
  setState(newTournament)
}

export function startTournament() {
  const state = getState()
  if (state.connectionMode === 'CLIENT') return

  if (state.preparationErrorMessages && state.preparationErrorMessages.length > 0)
    throw Error('Try to startTournament while having preparation errors')

  if (state.gameElimination === 'KO') {
    prepareKOTournament()
  } else if (state.gameElimination === 'DOUBLE_KO') {
    prepareDoubleKOTournament()
  }
  setState({ gameState: 'TOURNAMENT' })
  setState({ selectedTab: 'TOURNAMENT' })
}

export function finishTournament() {
  const state = getState()
  if (state.connectionMode === 'CLIENT') return

  if (state.preparationErrorMessages && state.preparationErrorMessages.length > 0)
    throw Error('Try to finishTournament while having preparation errors')

  const rounds = state.tournament.rounds

  rounds.forEach((round) => {
    if (!round.finished) throw Error('Not all rounds are finished')
  })

  const newPlayers = state.players.slice(0, state.players.length - 1)
  // Visit all matches and aggregate the values for each player
  rounds.map((round, roundIndex) => {
    const aggregateMatchValues = (match: MatchType, roundIndex: number) => {
      const player1 = newPlayers.find((player) => match.playerOneRow.player.id === player.id)
      const player2 = newPlayers.find((player) => match.playerTwoRow.player.id === player.id)
      if (player1) {
        player1.roundReached = roundIndex
        if (match.playerOneRow.isWinner) {
          player1.wonMatches++
        } else {
          player1.lostMatches++
        }
        match.playerOneRow.legs.map((leg) => {
          player1.remainingPoints += leg.remainingPoints
          if (leg.remainingPoints === 0) {
            player1.wonLegs++
          } else {
            player1.lostLegs++
          }
        })
      }
      if (player2) {
        player2.roundReached = roundIndex
        if (match.playerTwoRow.isWinner) {
          player2.wonMatches++
        } else {
          player2.lostMatches++
        }
        match.playerTwoRow.legs.map((leg) => {
          player2.remainingPoints += leg.remainingPoints
          if (leg.remainingPoints === 0) {
            player2.wonLegs++
          } else {
            player2.lostLegs++
          }
        })
      }
    }

    round.winnerMatches.map((match) => {
      aggregateMatchValues(match, roundIndex)
    })
    round.loserMatches?.map((match) => {
      aggregateMatchValues(match, roundIndex)
    })
  })

  // Regardless the other match values we want to have the winner of the final to be rank 1
  // and the loser to be rank 2. If there is a match for third place we want the winner
  // of that match to be rank 3 and the looser to be rank 4
  // Because the default rank is 0 we use -4,-3, -2, -1 for the rank
  // to make sorting more easy
  const finalRound = rounds[rounds.length - 1]
  const finalMatch = finalRound.winnerMatches[0]
  const player1 = newPlayers.find((player) => finalMatch.playerOneRow.player.id === player.id)
  const player2 = newPlayers.find((player) => finalMatch.playerTwoRow.player.id === player.id)
  if (player1 && player2) {
    if (finalMatch.playerOneRow.isWinner) {
      player1.rank = -4
      player2.rank = -3
    }
    if (finalMatch.playerTwoRow.isWinner) {
      player1.rank = -3
      player2.rank = -4
    }
  }
  if (state.gameMatchForThirdPlace && finalRound.loserMatches && finalRound.loserMatches.length > 0) {
    const matchForThirdPlace = finalRound.loserMatches[0]
    const player1 = newPlayers.find((player) => matchForThirdPlace.playerOneRow.player.id === player.id)
    const player2 = newPlayers.find((player) => matchForThirdPlace.playerTwoRow.player.id === player.id)
    if (player1 && player2) {
      if (matchForThirdPlace.playerOneRow.isWinner) {
        player1.rank = -2
        player2.rank = -1
      }
      if (matchForThirdPlace.playerTwoRow.isWinner) {
        player1.rank = -1
        player2.rank = -2
      }
    }
  }

  newPlayers.sort((a: PlayerType, b: PlayerType): number => {
    return (
      a.rank - b.rank ||
      b.roundReached - a.roundReached ||
      b.wonMatches - a.wonMatches ||
      b.wonLegs - a.wonLegs ||
      a.remainingPoints - b.remainingPoints
    )
  })

  // After sorting is done we have the final ranking of all players
  newPlayers.map((player, index) => {
    player.rank = index + 1
  })

  setState({ players: newPlayers })
  setState({ gameState: 'REPORT' })
  setState({ selectedTab: 'REPORT' })
}

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------

function prepareFirstRound(newTournament: TournamentType, players: PlayerType[]) {
  let playerOneIndex = 0
  let playerTwoIndex = players.length / 2
  // In the first round there are only winner ;-)
  newTournament.rounds[0].winnerMatches.map((match) => {
    // Pair the players for each match
    match.playerOneRow.player = players[playerOneIndex]
    match.playerTwoRow.player = players[playerTwoIndex]
    // Check if the match contains a 'get a bye' player and init the values for this case
    const isPlayerOneGetABye = players[playerOneIndex].name === 'GET_A_BYE'
    const isPlayerTwoGetABye = players[playerTwoIndex].name === 'GET_A_BYE'
    prepareGetAByeMatch(match, isPlayerOneGetABye, isPlayerTwoGetABye)
    playerOneIndex++
    playerTwoIndex++
  })
}

function createEmptyMatchRow(): MatchRowType {
  return {
    id: generateUUID(),
    player: { ...DEFAULT_EMPTY_PLAYER },
    legs: [{ ...DEFAULT_LEG_VALUE }],
    throws: [],
  }
}

function prepareKOTournament() {
  const state = getState()
  // The count of players must be a power of 2 (2, 4, 8, 16, 32, ...)
  // -2 because the last player is only a placeholder (that's -1) and if we have a power of two player count we don't want the nexPowerOfTwo (thats another -1)
  const playerCount = nextPowerOfTwo(state.players.length - 2)
  // We want to have a random order of players
  const playerList = shuffleArray<PlayerType>(state.players.slice(0, state.players.length - 1))
  // Fill the remaining spots with a (get a bye) player
  while (playerList.length < playerCount) {
    playerList.push({ ...DEFAULT_GET_A_BYE_PLAYER })
  }
  // Calculate the amount of rounds needed
  const eliminationRounds = calculateEliminationRounds(playerCount)
  // Create the tournament data structure
  const newTournament = structuredClone(DEFAULT_EMPTY_TOURNAMENT)
  eliminationRounds.map(({ matchCount }, index) => {
    const newRound: RoundType = {
      id: generateUUID(),
      name: index === eliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
      winnerMatches: [],
      loserMatches: state.gameMatchForThirdPlace && index === eliminationRounds.length - 1 ? [] : undefined,
      finishable: false,
      finished: false,
    }
    for (let i = 0; i < matchCount; i++) {
      const winnerMatch: MatchType = {
        id: generateUUID(),
        fieldErrorMessages: [],
        matchErrorMessages: [],
        playerOneRow: createEmptyMatchRow(),
        playerTwoRow: createEmptyMatchRow(),
      }
      newRound.winnerMatches.push(winnerMatch)
    }

    if (state.gameMatchForThirdPlace && index === eliminationRounds.length - 1) {
      const matchForThirdPlace: MatchType = {
        id: generateUUID(),
        fieldErrorMessages: [],
        matchErrorMessages: [],
        playerOneRow: createEmptyMatchRow(),
        playerTwoRow: createEmptyMatchRow(),
      }
      newRound.loserMatches?.push(matchForThirdPlace)
    }

    newTournament.rounds.push(newRound)
  })

  prepareFirstRound(newTournament, playerList)

  setState({ tournament: newTournament })
}

function prepareDoubleKOTournament() {
  const state = getState()
  // The count of players must be a power of 2 (2, 4, 8, 16, 32, ...)
  // -2 because the last player is only a placeholder (that's -1) and if we have a power of two player count we don't want the nexPowerOfTwo (thats another -1)
  const playerCount = nextPowerOfTwo(state.players.length - 2)
  // We want to have a random order of players
  const playerList = shuffleArray<PlayerType>(state.players.slice(0, state.players.length - 1))
  // Fill the remaining spots with a (get a bye) player
  while (playerList.length < playerCount) {
    playerList.push({ ...DEFAULT_GET_A_BYE_PLAYER })
  }
  const doubleEliminationRounds = calculateDoubleEliminationRounds(playerCount)
  // Create the tournament data structure
  const newTournament = structuredClone(DEFAULT_EMPTY_TOURNAMENT)
  doubleEliminationRounds.map(({ winnerMatchCount, loserMatchCount }, index) => {
    const newRound: RoundType = {
      id: generateUUID(),
      name: index === doubleEliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
      winnerMatches: [],
      loserMatches: [],
      finishable: false,
      finished: false,
    }
    for (let i = 0; i < winnerMatchCount; i++) {
      const winnerMatch: MatchType = {
        id: generateUUID(),
        fieldErrorMessages: [],
        matchErrorMessages: [],
        playerOneRow: createEmptyMatchRow(),
        playerTwoRow: createEmptyMatchRow(),
      }
      newRound.winnerMatches.push(winnerMatch)
    }
    for (let i = 0; i < loserMatchCount; i++) {
      const loserMatch: MatchType = {
        id: generateUUID(),
        fieldErrorMessages: [],
        matchErrorMessages: [],
        playerOneRow: createEmptyMatchRow(),
        playerTwoRow: createEmptyMatchRow(),
      }
      newRound.loserMatches?.push(loserMatch)
    }
    if (state.gameMatchForThirdPlace && index === doubleEliminationRounds.length - 1) {
      const matchForThirdPlace: MatchType = {
        id: generateUUID(),
        fieldErrorMessages: [],
        matchErrorMessages: [],
        playerOneRow: createEmptyMatchRow(),
        playerTwoRow: createEmptyMatchRow(),
      }
      newRound.loserMatches?.push(matchForThirdPlace)
    }

    newTournament.rounds.push(newRound)
  })

  prepareFirstRound(newTournament, playerList)

  setState({ tournament: newTournament })
}
