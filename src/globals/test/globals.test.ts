import { describe, expect, test } from 'vitest'
import { MIN_PLAYERS, MAX_PLAYERS, ACTUAL_FILE_VERSION } from '../globals'

describe('globals.ts constants', () => {
  test('exports MIN_PLAYERS as 4', () => {
    expect(MIN_PLAYERS).toBe(4)
  })

  test('exports MAX_PLAYERS as 128', () => {
    expect(MAX_PLAYERS).toBe(128)
  })

  test('exports ACTUAL_FILE_VERSION as a valid semantic version string', () => {
    expect(typeof ACTUAL_FILE_VERSION).toBe('string')
    expect(ACTUAL_FILE_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })

  test('ensures MIN_PLAYERS is less than MAX_PLAYERS', () => {
    expect(MIN_PLAYERS).toBeLessThan(MAX_PLAYERS)
  })

  test('ensures MIN_PLAYERS and MAX_PLAYERS are positive numbers', () => {
    expect(MIN_PLAYERS).toBeGreaterThan(0)
    expect(MAX_PLAYERS).toBeGreaterThan(0)
  })

  test('ensures MIN_PLAYERS is a power of two (for tournament structure)', () => {
    const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0
    expect(isPowerOfTwo(MIN_PLAYERS)).toBe(true)
  })

  test('ensures MAX_PLAYERS is a power of two (for tournament structure)', () => {
    const isPowerOfTwo = (n: number) => n > 0 && (n & (n - 1)) === 0
    expect(isPowerOfTwo(MAX_PLAYERS)).toBe(true)
  })
})
