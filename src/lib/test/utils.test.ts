import { describe, expect, test, vi } from 'vitest'
import {
  calculateDoubleEliminationRounds,
  calculateEliminationRounds,
  cn,
  generateRandomConnectionString,
  isPowerOfTwo,
  nextPowerOfTwo,
  shuffleArray,
  sleep,
} from '../utils'
import { doubleEliminationCases, eliminationCases } from './utils.data'

describe('utils.ts exports', () => {
  test('cn merges simple class strings', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  test('cn handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn('', '', '')).toBe('')
  })

  test('cn handles conditional classes with objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
    expect(cn('base', { active: false, disabled: true })).toBe('base disabled')
  })

  test('cn handles arrays of classes', () => {
    expect(cn(['px-2', 'py-4'], 'rounded')).toBe('px-2 py-4 rounded')
  })

  test('cn merges conflicting tailwind classes (twMerge)', () => {
    // px-2 should override px-4
    expect(cn('px-4', 'px-2')).toBe('px-2')
    // py-4 should override py-2
    expect(cn('py-2', 'py-4')).toBe('py-4')
    // text-red-500 should override text-blue-500
    expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500')
  })

  test('cn handles mixed input types', () => {
    expect(cn('px-2', { 'py-4': true }, ['rounded', 'shadow'])).toContain('px-2')
    expect(cn('px-2', { 'py-4': true }, ['rounded', 'shadow'])).toContain('py-4')
    expect(cn('px-2', { 'py-4': true }, ['rounded', 'shadow'])).toContain('rounded')
    expect(cn('px-2', { 'py-4': true }, ['rounded', 'shadow'])).toContain('shadow')
  })

  test('cn removes falsy values (undefined, null, false)', () => {
    expect(cn('px-2', undefined, 'py-4', null, false, 'rounded')).toBe('px-2 py-4 rounded')
  })

  test('cn handles complex tailwind conflicts', () => {
    // Last conflicting class wins
    expect(cn('bg-white', 'bg-black')).toBe('bg-black')
    expect(cn('w-full', 'w-1/2', 'w-1/3')).toBe('w-1/3')
  })

  test('sleep waits for 100 milliseconds', async () => {
    const duration = 100
    const startTime = performance.now()
    await sleep(duration)
    const elapsed = performance.now() - startTime
    // sleep uses timeout which isn't exactly timed but we only need a value very close to duration
    expect(elapsed).toBeGreaterThanOrEqual(duration - 2)
  })

  test.each([
    [-1, 1],
    [0, 1],
    [1, 2],
    [1.5, 2],
    [2, 4],
    [3, 4],
    [4, 8],
    [5, 8],
    [127, 128],
    [127.999, 128],
    [867, 1024],
  ])('nextPowerOfTwo(%f) === %f', (input, expected) => {
    expect(nextPowerOfTwo(input)).toBe(expected)
  })

  test.each([
    [-4, false],
    [-1, false],
    [0, false],
    [1, false],
    [1.5, false],
    [2, true],
    [4, true],
    [8, true],
    [128, true],
    [127.999, false],
  ])('isPowerOfTwo(%f) === %s', (input, expected) => {
    expect(isPowerOfTwo(input)).toBe(expected)
  })

  test.each(eliminationCases)('calculateEliminationRounds(%i) returns expected rounds', (playerCount, expected) => {
    expect(calculateEliminationRounds(playerCount)).toStrictEqual(expected)
  })

  test.each([2, 145])('calculateEliminationRounds(%i) throws error for out-of-range player count', (playerCount) => {
    expect(() => calculateEliminationRounds(playerCount)).toThrow(
      `playerCount:${playerCount} must be between 4 and 128`,
    )
  })

  test.each([5, 6, 7, 9, 15])('calculateEliminationRounds(%i) throws error for non-power-of-two', (playerCount) => {
    expect(() => calculateEliminationRounds(playerCount)).toThrow(`playerCount:${playerCount} must be a power of two.`)
  })

  test.each(doubleEliminationCases)(
    'calculateDoubleEliminationRounds(%i) returns expected rounds',
    (playerCount, expected) => {
      expect(calculateDoubleEliminationRounds(playerCount)).toStrictEqual(expected)
    },
  )

  test.each([2, 135])(
    'calculateDoubleEliminationRounds(%i) throws error for out-of-range player count',
    (playerCount) => {
      expect(() => calculateDoubleEliminationRounds(playerCount)).toThrow(
        `playerCount:${playerCount} must be between 4 and 128`,
      )
    },
  )

  test.each([5, 6, 7, 9, 15])(
    'calculateDoubleEliminationRounds(%i) throws error for non-power-of-two',
    (playerCount) => {
      expect(() => calculateDoubleEliminationRounds(playerCount)).toThrow(
        `playerCount:${playerCount} must be a power of two.`,
      )
    },
  )

  test('shuffleArray returns a new array and does not mutate the original', () => {
    const original = [1, 2, 3, 4, 5]
    const result = shuffleArray(original)

    expect(result).toHaveLength(original.length)
    expect(result).toEqual(expect.arrayContaining(original))
    expect(original).toEqual([1, 2, 3, 4, 5])
    expect(result).not.toBe(original)
  })

  test('shuffleArray follows the Fisher-Yates algorithm with deterministic Math.random', () => {
    const randomValues = [0.9, 0.5, 0.2, 0.1]
    const randomMock = vi.spyOn(Math, 'random')
    randomMock.mockImplementation(() => randomValues.shift() ?? 0)

    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)

    expect(result).toEqual([2, 4, 1, 3, 5])
    expect(randomMock).toHaveBeenCalled()

    randomMock.mockRestore()
  })

  test('shuffleArray handles edge cases correctly', () => {
    expect(shuffleArray([])).toEqual([])
    expect(shuffleArray([1])).toEqual([1])
    expect(shuffleArray([1, 2])).toHaveLength(2)
  })

  test('should return a string with the correct prefix and 4 random characters', () => {
    const result = generateRandomConnectionString()

    // 1. Check if it returns a string
    expect(result).toBeTypeOf('string')

    // 2. Check if it contains lowercase letters at the end
    // This regex checks that the string ENDS with exactly 4 lowercase letters.
    // Adjust if your CONNECTION_STRING_PREFIX contains special regex characters.
    const lowercaseSuffixRegex = /[a-z]{4}$/
    expect(result).toMatch(lowercaseSuffixRegex)
  })

  test('should generate different strings on consecutive calls', () => {
    const call1 = generateRandomConnectionString()
    const call2 = generateRandomConnectionString()
    const call3 = generateRandomConnectionString()

    // Since it's random, consecutive calls should mathematically almost never match
    expect(call1).not.toBe(call2)
    expect(call1).not.toBe(call3)
    expect(call2).not.toBe(call3)
  })

  test('should only use characters from the defined alphabet', () => {
    // Run the function 100 times to ensure statistical coverage of the random string
    for (let i = 0; i < 100; i++) {
      const result = generateRandomConnectionString()

      // Extract the random 4-character part at the end
      const randomPart = result.slice(-4)

      // Ensure no numbers, uppercase letters, or special characters are present
      expect(randomPart).toMatch(/^[a-z]+$/)
    }
  })
})
