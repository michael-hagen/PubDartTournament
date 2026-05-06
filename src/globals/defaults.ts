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
export const DefaultLanguage: string = 'en'
export const DefaultTheme: ThemeType = 'dark'
export const DefaultGameState: GameStateType = 'PREPARATION'
export const DefaultGameVariant: GameVariantType = 'ELECTRONIC_DART'
export const DefaultGameMode: GameModeType = 'MODE_501'
export const DefaultGameOpening: GameOpeningType = 'SINGLE_IN'
export const DefaultGameCheckout: GameCheckoutType = 'SINGLE_OUT'
export const DefaultGameLegs: GameLegsType = 'LEGS_2'
export const DefaultGameElimination: GameEliminationType = 'DOUBLE_KO'
export const DefaultScale: number = 100
export const DefaultPlayers: PlayerType[] = [{ id: generateUUID(), name: '' }]
export const DefaultEmptyPlayer: PlayerType = { id: generateUUID(), name: '' }
export const DefaultGetAByePlayer: PlayerType = { id: generateUUID(), name: 'GET_A_BYE' }
export const DefaultLegValue: LegValueType = { remainingPoints: 0, error: false }
export const DefaultTournament: TournamentType = {
  id: generateUUID(),
  name: 'PubDartTournament_' + new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  rounds: [],
}
