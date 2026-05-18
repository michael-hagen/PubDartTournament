import { expect, test, vi } from 'vitest'
import {
  calculateDoubleEliminationRounds,
  calculateEliminationRounds,
  isPowerOfTwo,
  nextPowerOfTwo,
  shuffleArray,
} from '../utils'

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

const eliminationCases: Array<[number, Array<{ round: number; matchCount: number }>]> = [
  [
    4,
    [
      { round: 1, matchCount: 2 },
      { round: 2, matchCount: 1 },
    ],
  ],
  [
    8,
    [
      { round: 1, matchCount: 4 },
      { round: 2, matchCount: 2 },
      { round: 3, matchCount: 1 },
    ],
  ],
  [
    16,
    [
      { round: 1, matchCount: 8 },
      { round: 2, matchCount: 4 },
      { round: 3, matchCount: 2 },
      { round: 4, matchCount: 1 },
    ],
  ],
  [
    32,
    [
      { round: 1, matchCount: 16 },
      { round: 2, matchCount: 8 },
      { round: 3, matchCount: 4 },
      { round: 4, matchCount: 2 },
      { round: 5, matchCount: 1 },
    ],
  ],
  [
    64,
    [
      { round: 1, matchCount: 32 },
      { round: 2, matchCount: 16 },
      { round: 3, matchCount: 8 },
      { round: 4, matchCount: 4 },
      { round: 5, matchCount: 2 },
      { round: 6, matchCount: 1 },
    ],
  ],
  [
    128,
    [
      { round: 1, matchCount: 64 },
      { round: 2, matchCount: 32 },
      { round: 3, matchCount: 16 },
      { round: 4, matchCount: 8 },
      { round: 5, matchCount: 4 },
      { round: 6, matchCount: 2 },
      { round: 7, matchCount: 1 },
    ],
  ],
]

test.each(eliminationCases)('calculateEliminationRounds(%i) returns expected rounds', (playerCount, expected) => {
  expect(calculateEliminationRounds(playerCount)).toStrictEqual(expected)
})

test.each([-1, 2, 3, 7])('calculateEliminationRounds(%i) throws for invalid player count', (playerCount) => {
  expect(() => calculateEliminationRounds(playerCount)).toThrow()
})

const doubleEliminationCases: Array<
  [number, Array<{ round: number; winnerMatchCount: number; loserMatchCount: number }>]
> = [
  [
    4,
    [
      { round: 1, winnerMatchCount: 2, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 4, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    8,
    [
      { round: 1, winnerMatchCount: 4, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 4, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 6, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    16,
    [
      { round: 1, winnerMatchCount: 8, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 4, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 6, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 8, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    32,
    [
      { round: 1, winnerMatchCount: 16, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 8, loserMatchCount: 8 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 8 },
      { round: 4, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 6, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 8, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 9, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 10, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    64,
    [
      { round: 1, winnerMatchCount: 32, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 16, loserMatchCount: 16 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 16 },
      { round: 4, winnerMatchCount: 8, loserMatchCount: 8 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 8 },
      { round: 6, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 8, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 9, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 10, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 11, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 12, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    128,
    [
      { round: 1, winnerMatchCount: 64, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 32, loserMatchCount: 32 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 32 },
      { round: 4, winnerMatchCount: 16, loserMatchCount: 16 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 16 },
      { round: 6, winnerMatchCount: 8, loserMatchCount: 8 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 8 },
      { round: 8, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 9, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 10, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 11, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 12, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 13, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 14, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
]

test.each(doubleEliminationCases)(
  'calculateDoubleEliminationRounds(%i) returns expected rounds',
  (playerCount, expected) => {
    expect(calculateDoubleEliminationRounds(playerCount)).toStrictEqual(expected)
  },
)

test.each([-1, 2, 3, 7])('calculateDoubleEliminationRounds(%i) throws for invalid player count', (playerCount) => {
  expect(() => calculateDoubleEliminationRounds(playerCount)).toThrow()
})

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
