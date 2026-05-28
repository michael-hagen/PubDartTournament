import { beforeEach, describe, expect, test } from 'vitest'
import { getState } from '../AppStore'
import { finishTournament, newTournament, startTournament } from '../TournamentActions'
import {
  DEFAULT_EMPTY_PLAYER,
  DEFAULT_GAME_CHECKOUT,
  DEFAULT_GAME_ELIMINATION,
  DEFAULT_GAME_LEGS,
  DEFAULT_GAME_MODE,
  DEFAULT_GAME_OPENING,
  DEFAULT_GAME_STATE,
  DEFAULT_GAME_VARIANT,
  DEFAULT_TOURNAMENT_PANEL_SCALE,
} from '@/globals/defaults'

describe('TournamentActions.ts exported functions', () => {
  beforeEach(() => {
    newTournament()
  })

  test('Defaults after newTournament', () => {
    const state = getState()
    expect(state.gameState).toBe(DEFAULT_GAME_STATE)
    expect(state.gameVariant).toBe(DEFAULT_GAME_VARIANT)
    expect(state.gameMode).toBe(DEFAULT_GAME_MODE)
    expect(state.gameOpening).toBe(DEFAULT_GAME_OPENING)
    expect(state.gameCheckout).toBe(DEFAULT_GAME_CHECKOUT)
    expect(state.gameLegs).toBe(DEFAULT_GAME_LEGS)
    expect(state.gameElimination).toBe(DEFAULT_GAME_ELIMINATION)
    expect(state.gameVariant).toBe(DEFAULT_GAME_VARIANT)
    expect(state.gameMatchForThirdPlace).toBe(false)
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
      errorMessages: DEFAULT_EMPTY_PLAYER.errorMessage,
    })
    expect(state.tournamentPanelScale).toBe(DEFAULT_TOURNAMENT_PANEL_SCALE)
    expect(state.selectedTab).toBe('PREPARATION')
    expect(state.showConfetti).toBe(false)
    expect(state.preparationErrorMessages).toHaveLength(1)
    expect(state.preparationErrorMessages).toEqual(['ERROR_MESSAGE.MIN_MAX_PLAYER'])
  })

  test('startTournament throws error after newTournament is called', () => {
    expect(startTournament).toThrow('Try to startTournament while having preparation errors')
  })

  test('finishTournament throws error after newTournament is called', () => {
    expect(finishTournament).toThrow('Try to finishTournament while having preparation errors')
  })
})
