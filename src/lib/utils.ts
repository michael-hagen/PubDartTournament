import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID(): string {
  return self.crypto.randomUUID()
}

export function nextPowerOfTwo(n: number) {
  if (n < 1) return 1
  return Math.pow(2, Math.ceil(Math.log2(n + 1)))
}

export function calculateEliminationRounds(playerCount: number) {
  if (playerCount < 2 || (playerCount & (playerCount - 1)) !== 0) {
    throw new Error('The number of players must be a power of two.')
  }

  const rounds = []

  let currentGames = playerCount / 2
  let i = 1
  while (currentGames >= 1) {
    rounds.push({
      round: i++,
      games: currentGames,
    })
    currentGames /= 2
  }
  return rounds
}

export function calculateDoubleEliminationRounds(playerCount: number) {
  if (playerCount < 2 || (playerCount & (playerCount - 1)) !== 0) {
    throw new Error('Teilnehmerzahl muss eine Zweierpotenz sein.')
  }

  const rounds = []
  const totalRounds = 2 * Math.log2(playerCount)

  // First round only winners
  rounds.push({
    round: 1,
    winnerGames: playerCount / 2,
    loserGames: 0,
  })

  let currentWinnerGames = playerCount / 4
  let currentLoserGames = playerCount / 4

  for (let i = 1; i < totalRounds - 1; i++) {
    let winnerGames = 0
    let loserGames = 0

    // Winner Bracket Spiele finden alle zwei Runden statt
    // (Synchronisiert mit dem Fortschritt im Loser Bracket)
    if (i % 2 === 1 && currentWinnerGames >= 1) {
      winnerGames = currentWinnerGames
      currentWinnerGames /= 2
    }

    // Loser Bracket Spiele
    // In jeder Runde des Loser Brackets wird gespielt
    loserGames = Math.max(1, currentLoserGames)
    // Die Anzahl der Spiele im Loser-Bracket sinkt nur jede zweite Runde
    if (i % 2 === 0) {
      currentLoserGames /= 2
    }

    rounds.push({
      round: i + 1,
      winnerGames: winnerGames,
      loserGames: loserGames,
    })
  }

  // The final
  rounds.push({
    round: totalRounds,
    winnerGames: 1,
    loserGames: 0,
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
