import type { LegValueType, MatchType, PlayerType, RoundType } from '@/globals/types'
import { getState } from './AppStore'
import { DEFAULT_LEG_VALUE } from '@/globals/defaults'

export function prepareGetAByeMatch(match: MatchType, isPlayerOneGetABye: boolean, isPlayerTwoGetABye: boolean) {
  if (isPlayerOneGetABye || isPlayerTwoGetABye) {
    const state = getState()
    const legsToWin = parseInt(state.gameLegs)
    const legValueX01: LegValueType = {
      error: false,
      remainingPoints: parseInt(state.gameMode),
    }
    match.playerOneRow.legs = []
    match.playerTwoRow.legs = []
    if (isPlayerOneGetABye) {
      for (let i = 0; i < legsToWin; i++) {
        match.playerOneRow.legs.push({ ...legValueX01 })
      }
      for (let i = 0; i < legsToWin; i++) {
        match.playerTwoRow.legs.push({ ...DEFAULT_LEG_VALUE })
      }
      match.playerOneRow.isWinner = false
      match.playerTwoRow.isWinner = true
    } else {
      for (let i = 0; i < legsToWin; i++) {
        match.playerOneRow.legs.push({ ...DEFAULT_LEG_VALUE })
      }
      for (let i = 0; i < legsToWin; i++) {
        match.playerTwoRow.legs.push({ ...legValueX01 })
      }
      match.playerOneRow.isWinner = true
      match.playerTwoRow.isWinner = false
    }
  }
}

export function prepareNewMatch(round: RoundType, matchIndex: number, nextMatch: MatchType, winner: boolean) {
  const match1 = round.winnerMatches[matchIndex]
  const match2 = round.winnerMatches[matchIndex + 1]
  let player1: PlayerType | null = null
  let player2: PlayerType | null = null
  if (winner) {
    player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
    player2 = match2.playerOneRow.isWinner ? match2.playerOneRow.player : match2.playerTwoRow.player
  } else {
    player1 = match1.playerOneRow.isWinner ? match1.playerTwoRow.player : match1.playerOneRow.player
    player2 = match2.playerOneRow.isWinner ? match2.playerTwoRow.player : match2.playerOneRow.player
  }
  if (player1 && player2) {
    nextMatch.playerOneRow.player = structuredClone(player1)
    nextMatch.playerTwoRow.player = structuredClone(player2)
    const isPlayerOneGetABye = nextMatch.playerOneRow.player.name === 'GET_A_BYE'
    const isPlayerTwoGetABye = nextMatch.playerTwoRow.player.name === 'GET_A_BYE'
    prepareGetAByeMatch(nextMatch, isPlayerOneGetABye, isPlayerTwoGetABye)
  }
}
