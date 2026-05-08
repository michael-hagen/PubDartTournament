// Global type definitions
export type ThemeType = 'light' | 'dark'
export type GameStateType = 'PREPARATION' | 'TOURNAMENT' | 'REPORT'
export type GameVariantType = 'ELECTRONIC_DART' | 'STEEL_DART'
export type GameModeType = 'MODE_301' | 'MODE_501' | 'MODE_701' | 'MODE_1001'
export type GameOpeningType = 'SINGLE_IN' | 'DOUBLE_IN' | 'MASTER_IN'
export type GameCheckoutType = 'SINGLE_OUT' | 'DOUBLE_OUT' | 'MASTER_OUT'
export type GameLegsType = 'LEGS_2' | 'LEGS_3' | 'LEGS_4' | 'LEGS_5'
export type GameEliminationType = 'KO' | 'DOUBLE_KO'

export type PlayerType = {
  id: string
  name: string
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
export function isThemeType(val: string): val is ThemeType {
  return val === 'light' || val === 'dark'
}

export function isGameStateType(val: string): val is GameStateType {
  return val === 'PREPARATION' || val === 'TOURNAMENT' || val === 'REPORT'
}

export function isGameVariantType(val: string): val is GameVariantType {
  return val === 'ELECTRONIC_DART' || val === 'STEEL_DART'
}

export function isGameModeType(val: string): val is GameModeType {
  return val === 'MODE_301' || val === 'MODE_501' || val === 'MODE_701' || val === 'MODE_1001'
}

export function isGameOpeningType(val: string): val is GameOpeningType {
  return val === 'SINGLE_IN' || val === 'DOUBLE_IN' || val === 'MASTER_IN'
}

export function isGameCheckoutType(val: string): val is GameCheckoutType {
  return val === 'SINGLE_OUT' || val === 'DOUBLE_OUT' || val === 'MASTER_OUT'
}

export function isGameLegsType(val: string): val is GameLegsType {
  return val === 'LEGS_2' || val === 'LEGS_3' || val === 'LEGS_4' || val === 'LEGS_5'
}

export function isGameEliminationType(val: string): val is GameEliminationType {
  return val === 'KO' || val === 'DOUBLE_KO'
}
