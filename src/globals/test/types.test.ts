import { describe, expect, test } from 'vitest'
import {
  isThemeType,
  isGameStateType,
  isGameVariantType,
  isGameModeType,
  isGameOpeningType,
  isGameCheckoutType,
  isGameLegsType,
  isGameEliminationType,
} from '../types'

describe('types.ts type guards', () => {
  test('validates theme values correctly', () => {
    expect(isThemeType('light')).toBe(true)
    expect(isThemeType('dark')).toBe(true)
    expect(isThemeType('custom')).toBe(true)
    expect(isThemeType('LIGHT' as string)).toBe(false)
    expect(isThemeType('')).toBe(false)
  })

  test('validates game state values correctly', () => {
    expect(isGameStateType('PREPARATION')).toBe(true)
    expect(isGameStateType('TOURNAMENT')).toBe(true)
    expect(isGameStateType('REPORT')).toBe(true)
    expect(isGameStateType('SETUP' as string)).toBe(false)
    expect(isGameStateType('preparation' as string)).toBe(false)
  })

  test('validates game variant values correctly', () => {
    expect(isGameVariantType('ELECTRONIC_DART')).toBe(true)
    expect(isGameVariantType('STEEL_DART')).toBe(true)
    expect(isGameVariantType('ELECTRONIC' as string)).toBe(false)
    expect(isGameVariantType('steel_dart' as string)).toBe(false)
  })

  test('validates game mode values correctly', () => {
    expect(isGameModeType('301')).toBe(true)
    expect(isGameModeType('501')).toBe(true)
    expect(isGameModeType('701')).toBe(true)
    expect(isGameModeType('1001')).toBe(true)
    expect(isGameModeType('999' as string)).toBe(false)
    expect(isGameModeType('501.0' as string)).toBe(false)
  })

  test('validates game opening values correctly', () => {
    expect(isGameOpeningType('SINGLE_IN')).toBe(true)
    expect(isGameOpeningType('DOUBLE_IN')).toBe(true)
    expect(isGameOpeningType('MASTER_IN')).toBe(true)
    expect(isGameOpeningType('SINGLE' as string)).toBe(false)
    expect(isGameOpeningType('single_in' as string)).toBe(false)
  })

  test('validates game checkout values correctly', () => {
    expect(isGameCheckoutType('SINGLE_OUT')).toBe(true)
    expect(isGameCheckoutType('DOUBLE_OUT')).toBe(true)
    expect(isGameCheckoutType('MASTER_OUT')).toBe(true)
    expect(isGameCheckoutType('OUT' as string)).toBe(false)
    expect(isGameCheckoutType('single_out' as string)).toBe(false)
  })

  test('validates game legs values correctly', () => {
    expect(isGameLegsType('2')).toBe(true)
    expect(isGameLegsType('3')).toBe(true)
    expect(isGameLegsType('4')).toBe(true)
    expect(isGameLegsType('5')).toBe(true)
    expect(isGameLegsType('6' as string)).toBe(false)
    expect(isGameLegsType('02' as string)).toBe(false)
  })

  test('validates game elimination values correctly', () => {
    expect(isGameEliminationType('KO')).toBe(true)
    expect(isGameEliminationType('DOUBLE_KO')).toBe(true)
    expect(isGameEliminationType('K.O.' as string)).toBe(false)
    expect(isGameEliminationType('DOUBLE' as string)).toBe(false)
  })
})
