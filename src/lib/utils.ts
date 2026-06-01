import { CONNECTION_STRING_PREFIX, MAX_PLAYERS, MIN_PLAYERS } from '@/globals/globals'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
export function generateUUID(): string {
  return globalThis.crypto.randomUUID()
}

export function nextPowerOfTwo(n: number): number {
  if (n < 1) return 1
  return Math.pow(2, Math.ceil(Math.log2(Math.floor(n) + 1)))
}

export function isPowerOfTwo(n: number): boolean {
  return n >= 2 && (n & (n - 1)) === 0
}

export function calculateEliminationRounds(playerCount: number) {
  if (playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS)
    throw new Error(`playerCount:${playerCount} must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`)
  if (!isPowerOfTwo(playerCount)) throw new Error(`playerCount:${playerCount} must be a power of two.`)

  const rounds = []

  let currentMatchCount = playerCount / 2
  let i = 1
  while (currentMatchCount >= 1) {
    rounds.push({
      round: i++,
      matchCount: currentMatchCount,
    })
    currentMatchCount /= 2
  }
  return rounds
}

export function calculateDoubleEliminationRounds(playerCount: number) {
  if (playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS)
    throw new Error(`playerCount:${playerCount} must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`)
  if (!isPowerOfTwo(playerCount)) throw new Error(`playerCount:${playerCount} must be a power of two.`)

  const rounds = []
  const totalRounds = 2 * Math.log2(playerCount)

  // First round only winners
  rounds.push({
    round: 1,
    winnerMatchCount: playerCount / 2,
    loserMatchCount: 0,
  })

  // Calculate the winner and loser matches
  let currentWinnerMatchCount = playerCount / 4
  let currentLoserMatchCount = playerCount / 4

  for (let i = 1; i < totalRounds - 1; i++) {
    let winnerMatchCount = 0
    let loserMatchCount = 0

    // Only every second round we have a winner bracket
    if (i % 2 === 1 && currentWinnerMatchCount >= 1) {
      winnerMatchCount = currentWinnerMatchCount
      currentWinnerMatchCount /= 2
    }

    // Every round there are loser brackets but only every second round we have to
    // divide the match count because we got players from the winners round
    loserMatchCount = Math.max(1, currentLoserMatchCount)
    if (i % 2 === 0) {
      currentLoserMatchCount /= 2
    }

    rounds.push({
      round: i + 1,
      winnerMatchCount: winnerMatchCount,
      loserMatchCount: loserMatchCount,
    })
  }

  // The final bracket
  rounds.push({
    round: totalRounds,
    winnerMatchCount: 1,
    loserMatchCount: 0,
  })

  return rounds
}

export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

export function generateRandomConnectionString() {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }
  return CONNECTION_STRING_PREFIX + result
}
