import { generateUUID } from '@/lib/utils'
import type {
  GameCheckoutType,
  GameModeType,
  GameOpeningType,
  GameLegsType,
  GameStateType,
  GameEliminationType,
  GameVariantType,
  ThemeType,
  TournamentType,
  PlayerType,
  LegValueType,
} from './types'

// Default values for global types
export const DEFAULT_LANGUAGE: string = 'en'
export const DEFAULT_THEME: ThemeType = 'dark'
export const DEFAULT_GAME_STATE: GameStateType = 'PREPARATION'
export const DEFAULT_GAME_VARIANT: GameVariantType = 'ELECTRONIC_DART'
export const DEFAULT_GAME_MODE: GameModeType = 'MODE_501'
export const DEFAULT_GAME_OPENING: GameOpeningType = 'SINGLE_IN'
export const DEFAULT_GAME_CHECKOUT: GameCheckoutType = 'SINGLE_OUT'
export const DEFAULT_GAME_LEGS: GameLegsType = 'LEGS_2'
export const DEFAULT_GAME_ELIMINATION: GameEliminationType = 'DOUBLE_KO'
export const DEFAULT_SCALE: number = 100
export const DEFAULT_PLAYERS: PlayerType[] = [{ id: generateUUID(), name: '' }]
export const DEFAULT_EMPTY_PLAYER: PlayerType = { id: generateUUID(), name: '' }
export const DEFAULT_GET_A_BYE_PLAYER: PlayerType = { id: generateUUID(), name: 'GET_A_BYE' }
export const DEFAULT_LEG_VALUE: LegValueType = { remainingPoints: 0, error: false }
export const DEFAULT_EMPTY_TOURNAMENT: TournamentType = {
  id: generateUUID(),
  name: 'PubDartTournament_' + new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  rounds: [],
}
