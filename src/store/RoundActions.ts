import type { RoundType, TournamentType } from '@/globals/types'
import { getState, setState } from './AppStore'
import { prepareGetAByeMatch, prepareNewMatch } from './MatchActions'

export function finishRound(roundIndex: number) {
  const state = getState()
  if (roundIndex < 0 || roundIndex > state.tournament.rounds.length - 1)
    throw Error(`Invalid roundIndex: ${roundIndex}`)

  const newTournament = structuredClone(state.tournament)

  if (state.gameElimination === 'KO') {
    finishKORound(newTournament, roundIndex)
  } else {
    if (roundIndex === 0) {
      finishFirstRound(newTournament)
    } else if (roundIndex === newTournament.rounds.length - 1) {
      finishLastRound(newTournament)
    } else {
      if (roundIndex % 2 === 0) {
        finishEvenRound(newTournament, roundIndex)
      } else {
        finishOddRound(newTournament, roundIndex)
      }
    }
  }

  setState({ tournament: newTournament })
}

export function computeRoundFinishable(round: RoundType) {
  round.finishable = true
  // You can finish a round if all matches are finished and there are no error messages
  round.winnerMatches.map((match) => {
    if (match.fieldErrorMessages.length > 0 || match.matchErrorMessages.length > 0) {
      round.finishable = false
    }
    if (!(match.playerOneRow.isWinner || match.playerTwoRow.isWinner)) {
      round.finishable = false
    }
  })
  round.loserMatches?.map((match) => {
    if (match.fieldErrorMessages.length > 0 || match.matchErrorMessages.length > 0) {
      round.finishable = false
    }
    if (!(match.playerOneRow.isWinner || match.playerTwoRow.isWinner)) {
      round.finishable = false
    }
  })
}

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------

function finishKORound(newTournament: TournamentType, roundIndex: number) {
  // In a elimination tournament we only have to put the winners of the current round in the new round
  if (roundIndex > newTournament.rounds.length - 1) return

  const round = newTournament.rounds[roundIndex]

  if (!round.finishable) return

  if (roundIndex === newTournament.rounds.length - 1) {
    round.finished = true
    return
  }

  const nextRound = newTournament.rounds[roundIndex + 1]
  let matchIndex = 0
  nextRound.winnerMatches.map((nextMatch) => {
    prepareNewMatch(round, matchIndex, nextMatch, true)
    matchIndex += 2
  })
  round.finished = true
}

function finishFirstRound(newTournament: TournamentType) {
  // in the first round of a double elimination we have to put the winners of the first round
  // in the next winner round and the loser in the next loser round
  const round = newTournament.rounds[0]

  if (!round.finishable) return

  const nextRound = newTournament.rounds[1]
  let matchIndex = 0
  nextRound.winnerMatches.map((nextMatch) => {
    prepareNewMatch(round, matchIndex, nextMatch, true)
    matchIndex += 2
  })
  matchIndex = 0
  nextRound.loserMatches?.map((nextMatch) => {
    prepareNewMatch(round, matchIndex, nextMatch, false)
    matchIndex += 2
  })
  round.finished = true
}

function finishOddRound(newTournament: TournamentType, roundIndex: number) {
  // in an odd round we have to put the loser of the winner round and pair them with
  // the winner of the loser round
  // we also have to put the winner of the winner round into the over next winner round
  if (roundIndex >= newTournament.rounds.length - 1) return

  const round = newTournament.rounds[roundIndex]

  if (!round.finishable) return

  const nextRound = newTournament.rounds[roundIndex + 1]

  let matchIndex = 0
  nextRound.loserMatches?.map((nextMatch) => {
    if (round.loserMatches !== undefined) {
      const match1 = round.winnerMatches[matchIndex]
      const match2 = round.loserMatches[matchIndex]
      const player1 = match1.playerOneRow.isWinner ? match1.playerTwoRow.player : match1.playerOneRow.player
      const player2 = match2.playerOneRow.isWinner ? match2.playerOneRow.player : match2.playerTwoRow.player
      nextMatch.playerOneRow.player = structuredClone(player1)
      nextMatch.playerTwoRow.player = structuredClone(player2)
      const isPlayerOneGetABye = nextMatch.playerOneRow.player.name === 'GET_A_BYE'
      const isPlayerTwoGetABye = nextMatch.playerTwoRow.player.name === 'GET_A_BYE'
      prepareGetAByeMatch(nextMatch, isPlayerOneGetABye, isPlayerTwoGetABye)
      matchIndex++
    }
  })

  if (roundIndex < newTournament.rounds.length - 2) {
    const nextNextRound = newTournament.rounds[roundIndex + 2]
    // The winner of the last winner round will be the first finalist
    if (round.winnerMatches.length === 1) {
      const match1 = round.winnerMatches[0]
      const player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
      nextNextRound.winnerMatches[0].playerOneRow.player = structuredClone(player1)
    } else {
      matchIndex = 0
      nextNextRound.winnerMatches.map((nextMatch) => {
        prepareNewMatch(round, matchIndex, nextMatch, true)
        matchIndex += 2
      })
    }
  }

  round.finished = true
}

function finishEvenRound(newTournament: TournamentType, roundIndex: number) {
  // in an even round we only have a loser round so in the next round we have to pair the winner of the loser
  // round with the loser of the last winner round
  const round = newTournament.rounds[roundIndex]

  if (!round.finishable) return

  const nextRound = newTournament.rounds[roundIndex + 1]
  // The winner of the last loser round will be the second finalist
  if (round.loserMatches && round.loserMatches.length === 1) {
    const match1 = round.loserMatches[0]
    const player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
    nextRound.winnerMatches[0].playerTwoRow.player = structuredClone(player1)
  } else {
    let matchIndex = 0
    nextRound.loserMatches?.map((nextMatch) => {
      if (round.loserMatches) {
        const match1 = round.loserMatches[matchIndex++]
        const match2 = round.loserMatches[matchIndex++]
        const player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
        const player2 = match2.playerOneRow.isWinner ? match2.playerOneRow.player : match2.playerTwoRow.player
        nextMatch.playerOneRow.player = structuredClone(player1)
        nextMatch.playerTwoRow.player = structuredClone(player2)
        const isPlayerOneGetABye = nextMatch.playerOneRow.player.name === 'GET_A_BYE'
        const isPlayerTwoGetABye = nextMatch.playerTwoRow.player.name === 'GET_A_BYE'
        prepareGetAByeMatch(nextMatch, isPlayerOneGetABye, isPlayerTwoGetABye)
      }
    })
  }

  round.finished = true
}

function finishLastRound(newTournament: TournamentType) {
  const round = newTournament.rounds[0]

  if (!round.finishable) return

  round.finished = true
}
