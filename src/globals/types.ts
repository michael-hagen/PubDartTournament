// Global type definitions
export type ThemeType = 'light' | 'dark'
export type GameStateType = 'PREPARATION' | 'TOURNAMENT' | 'REPORT'
export type GameVariantType = 'ELECTRONIC_DART' | 'STEEL_DART'
export type GameModeType = '301' | '501' | '701' | '1001'
export type GameOpeningType = 'SINGLE_IN' | 'DOUBLE_IN' | 'MASTER_IN'
export type GameCheckoutType = 'SINGLE_OUT' | 'DOUBLE_OUT' | 'MASTER_OUT'
export type GameLegsType = '2' | '3' | '4' | '5'
export type GameEliminationType = 'KO' | 'DOUBLE_KO'

export type PlayerType = {
  id: string
  name: string
  rank: number
  roundReached: number
  wonMatches: number
  lostMatches: number
  wonLegs: number
  lostLegs: number
  remainingPoints: number
  errorMessage?: string
}

export type LegValueType = {
  remainingPoints: number
  error: boolean
}

export type MatchRowType = {
  id: string
  player: PlayerType
  legs: LegValueType[]
  throws: number[]
  isWinner?: boolean
}

export type MatchType = {
  id: string
  playerOneRow: MatchRowType
  playerTwoRow: MatchRowType
  fieldErrorMessages: string[]
  matchErrorMessages: string[]
}

export type RoundType = {
  id: string
  name: string
  winnerMatches: MatchType[]
  loserMatches?: MatchType[]
  finishable: boolean
  finished: boolean
}

export type TournamentType = {
  id: string
  name: string
  rounds: RoundType[]
}

// Type guards for global types
export function isThemeType(val: unknown): val is ThemeType {
  return val === 'light' || val === 'dark'
}

export function isGameStateType(val: unknown): val is GameStateType {
  return val === 'PREPARATION' || val === 'TOURNAMENT' || val === 'REPORT'
}

export function isGameVariantType(val: unknown): val is GameVariantType {
  return val === 'ELECTRONIC_DART' || val === 'STEEL_DART'
}

export function isGameModeType(val: unknown): val is GameModeType {
  return val === '301' || val === '501' || val === '701' || val === '1001'
}

export function isGameOpeningType(val: unknown): val is GameOpeningType {
  return val === 'SINGLE_IN' || val === 'DOUBLE_IN' || val === 'MASTER_IN'
}

export function isGameCheckoutType(val: unknown): val is GameCheckoutType {
  return val === 'SINGLE_OUT' || val === 'DOUBLE_OUT' || val === 'MASTER_OUT'
}

export function isGameLegsType(val: unknown): val is GameLegsType {
  return val === '2' || val === '3' || val === '4' || val === '5'
}

export function isGameEliminationType(val: unknown): val is GameEliminationType {
  return val === 'KO' || val === 'DOUBLE_KO'
}
