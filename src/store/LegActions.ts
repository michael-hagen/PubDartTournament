import type { MatchRowType, MatchType } from '@/globals/types'
import { getState, setState } from './AppStore'
import { DEFAULT_LEG_VALUE } from '@/globals/defaults'
import { computeRoundFinishable } from './RoundActions'

export function setLegValue(
  roundIndex: number,
  winnerMatchIndex: number | undefined,
  loserMatchIndex: number | undefined,
  isPlayerOne: boolean,
  legIndex: number,
  remainingPoints: number,
) {
  const state = getState()

  if (roundIndex < 0 || roundIndex > state.tournament.rounds.length - 1)
    throw Error(`Invalid roundIndex: ${roundIndex}`)

  const winnerMatches = state.tournament.rounds[roundIndex]?.winnerMatches
  const loserMatches = state.tournament.rounds[roundIndex]?.loserMatches
  if (winnerMatchIndex && winnerMatches) {
    if (winnerMatchIndex < 0 || winnerMatchIndex >= winnerMatches.length)
      throw Error(`Invalid winnerMatchIndex: ${winnerMatchIndex}`)
  }
  if (loserMatchIndex && loserMatches) {
    if (loserMatchIndex < 0 || loserMatchIndex >= loserMatches.length)
      throw Error(`Invalid loserMatchIndex: ${loserMatchIndex}`)
  }

  const newTournament = structuredClone(state.tournament)
  const round = newTournament.rounds[roundIndex]
  const match: MatchType | null =
    winnerMatchIndex !== undefined
      ? round.winnerMatches[winnerMatchIndex]
      : loserMatchIndex !== undefined && round.loserMatches !== undefined
        ? round.loserMatches[loserMatchIndex]
        : null

  if (match) {
    const row: MatchRowType = isPlayerOne ? match.playerOneRow : match.playerTwoRow

    if (legIndex < 0 || legIndex >= row.legs.length) throw Error(`Invalid legIndex: ${legIndex}`)

    row.legs[legIndex].remainingPoints = remainingPoints

    // Reset error messages
    match.fieldErrorMessages = []
    match.matchErrorMessages = []

    const { winsPlayerOne, winsPlayerTwo, hasWinner } = computeWinner(match)
    conditionalAddLeg(match, hasWinner, winsPlayerOne, winsPlayerTwo)
    conditionalRemoveLeg(match, hasWinner, winsPlayerOne, winsPlayerTwo)
    checkForEmptyLegs(match)
    computeRoundFinishable(round)

    setState({ tournament: newTournament })
  } else {
    throw Error(`Can't find match for winnerMatchIndex: ${winnerMatchIndex} loserMatchIndex: ${loserMatchIndex}`)
  }
}

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------

function computeWinner(match: MatchType): { winsPlayerOne: number; winsPlayerTwo: number, hasWinner: boolean } {
  const state = getState()
  const legsToWin = parseInt(state.gameLegs)
  const maxPoints = parseInt(state.gameMode)
  let winsPlayerOne = 0
  let winsPlayerTwo = 0
  let hasWinner = false

  for (let i = 0; i < match.playerOneRow.legs.length; i++) {
    const leg1 = match.playerOneRow.legs[i]
    const leg2 = match.playerTwoRow.legs[i]
    // Reset error for the legs
    leg1.error = false
    leg2.error = false
    // Check if the remaining points are in the range of the game mode
    if (leg1.remainingPoints > maxPoints) {
      match.fieldErrorMessages.push('ERROR_MESSAGE.REMAINING_POINTS_RANGE')
      leg1.error = true
    }
    // Check if there is an empty leg
    if (leg2.remainingPoints > maxPoints) {
      match.fieldErrorMessages.push('ERROR_MESSAGE.REMAINING_POINTS_RANGE')
      leg2.error = true
    }
    if (leg1.remainingPoints > 0 && leg2.remainingPoints > 0) {
      match.fieldErrorMessages.push('ERROR_MESSAGE.INVALID_LEG')
      leg1.error = true
      leg2.error = true
    }
    if (leg1.remainingPoints > 0) winsPlayerTwo++
    if (leg2.remainingPoints > 0) winsPlayerOne++
  }

  match.playerOneRow.isWinner = undefined
  match.playerTwoRow.isWinner = undefined
  if (winsPlayerOne === legsToWin) {
    match.playerOneRow.isWinner = true
    match.playerTwoRow.isWinner = false
    hasWinner = true
  } else if (winsPlayerOne > legsToWin) {
    match.matchErrorMessages.push('ERROR_MESSAGE.TO_MANY_WINS')
  }
  if (winsPlayerTwo === legsToWin) {
    match.playerOneRow.isWinner = false
    match.playerTwoRow.isWinner = true
    hasWinner = true
  } else if (winsPlayerTwo > legsToWin) {
    match.matchErrorMessages.push('ERROR_MESSAGE.TO_MANY_WINS')
  }

  return { winsPlayerOne, winsPlayerTwo, hasWinner }
}

function conditionalAddLeg(match: MatchType, hasWinner: boolean, winsPlayerOne: number, winsPlayerTwo: number) {
  // Check if we have to add a new leg
  if (hasWinner) return

  const state = getState()
  const currentLegs = match.playerOneRow.legs.length
  const maxLegs = parseInt(state.gameLegs) * 2 - 1
  if (currentLegs <= winsPlayerOne + winsPlayerTwo && currentLegs < maxLegs) {
    match.playerOneRow.legs.push(structuredClone(DEFAULT_LEG_VALUE))
    match.playerTwoRow.legs.push(structuredClone(DEFAULT_LEG_VALUE))
  }
}

function conditionalRemoveLeg(match: MatchType, hasWinner: boolean, winsPlayerOne: number, winsPlayerTwo: number) {
  // Check if there is an unnecessary leg at the end of the match
  const lastLegIndex = match.playerOneRow.legs.length - 1
  if (hasWinner || lastLegIndex > winsPlayerOne + winsPlayerTwo) {
    const remainingPoints1 = match.playerOneRow.legs[lastLegIndex].remainingPoints
    const remainingPoints2 = match.playerTwoRow.legs[lastLegIndex].remainingPoints
    // Only remove the leg if not already edited
    if (remainingPoints1 === 0 && remainingPoints2 === 0) {
      match.playerOneRow.legs.pop()
      match.playerTwoRow.legs.pop()
    }
  }
}

function checkForEmptyLegs(match: MatchType) {
  // Check if there are legs with 0:0 in the middle of the match
  for (let i = 0; i < match.playerOneRow.legs.length - 1; i++) {
    const remainingPoints1 = match.playerOneRow.legs[i].remainingPoints
    const remainingPoints2 = match.playerTwoRow.legs[i].remainingPoints
    if (remainingPoints1 === 0 && remainingPoints2 === 0) {
      match.matchErrorMessages.push('ERROR_MESSAGE.EMPTY_LEG')
    }
  }
}

