import { describe, expect, test } from 'vitest'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  DEFAULT_GAME_STATE,
  DEFAULT_GAME_VARIANT,
  DEFAULT_GAME_MODE,
  DEFAULT_GAME_OPENING,
  DEFAULT_GAME_CHECKOUT,
  DEFAULT_GAME_LEGS,
  DEFAULT_GAME_ELIMINATION,
  DEFAULT_TOURNAMENT_PANEL_SCALE,
  DEFAULT_GET_A_BYE_PLAYER,
  DEFAULT_EMPTY_PLAYER,
  DEFAULT_LEG_VALUE,
  DEFAULT_EMPTY_TOURNAMENT,
} from '../defaults'

describe('defaults.ts exports', () => {
  test('exports the expected default primitive values', () => {
    expect(DEFAULT_LANGUAGE).toBe('en')
    expect(DEFAULT_THEME).toBe('dark')
    expect(DEFAULT_GAME_STATE).toBe('PREPARATION')
    expect(DEFAULT_GAME_VARIANT).toBe('ELECTRONIC_DART')
    expect(DEFAULT_GAME_MODE).toBe('501')
    expect(DEFAULT_GAME_OPENING).toBe('SINGLE_IN')
    expect(DEFAULT_GAME_CHECKOUT).toBe('SINGLE_OUT')
    expect(DEFAULT_GAME_LEGS).toBe('2')
    expect(DEFAULT_GAME_ELIMINATION).toBe('DOUBLE_KO')
    expect(DEFAULT_TOURNAMENT_PANEL_SCALE).toBe(100)
  })

  test('exports a get-a-bye player with valid properties', () => {
    expect(DEFAULT_GET_A_BYE_PLAYER).toMatchObject({
      name: 'GET_A_BYE',
      rank: 0,
      roundReached: 0,
      wonMatches: 0,
      lostMatches: 0,
      wonLegs: 0,
      lostLegs: 0,
      remainingPoints: 0,
    })
    expect(typeof DEFAULT_GET_A_BYE_PLAYER.id).toBe('string')
    expect(DEFAULT_GET_A_BYE_PLAYER.id.length).toBeGreaterThan(0)
  })

  test('exports an empty player with valid default values', () => {
    expect(DEFAULT_EMPTY_PLAYER).toMatchObject({
      name: '',
      rank: 0,
      roundReached: 0,
      wonMatches: 0,
      lostMatches: 0,
      wonLegs: 0,
      lostLegs: 0,
      remainingPoints: 0,
    })
    expect(typeof DEFAULT_EMPTY_PLAYER.id).toBe('string')
    expect(DEFAULT_EMPTY_PLAYER.id.length).toBeGreaterThan(0)
  })

  test('exports a leg value default with zero points and no error', () => {
    expect(DEFAULT_LEG_VALUE).toEqual({ remainingPoints: 0, error: false })
  })

  test('exports an empty tournament with a valid id and name', () => {
    expect(typeof DEFAULT_EMPTY_TOURNAMENT.id).toBe('string')
    expect(DEFAULT_EMPTY_TOURNAMENT.id.length).toBeGreaterThan(0)
    expect(DEFAULT_EMPTY_TOURNAMENT.name).toMatch(/^PubDartTournament_\d{8}$/)
    expect(Array.isArray(DEFAULT_EMPTY_TOURNAMENT.rounds)).toBe(true)
    expect(DEFAULT_EMPTY_TOURNAMENT.rounds).toHaveLength(0)
  })

  test('generates unique ids for different defaults on module load', () => {
    expect(DEFAULT_GET_A_BYE_PLAYER.id).not.toBe(DEFAULT_EMPTY_PLAYER.id)
    expect(DEFAULT_GET_A_BYE_PLAYER.id).not.toBe(DEFAULT_EMPTY_TOURNAMENT.id)
    expect(DEFAULT_EMPTY_PLAYER.id).not.toBe(DEFAULT_EMPTY_TOURNAMENT.id)
  })
})
