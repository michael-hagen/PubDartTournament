import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'

import { type PlayerType } from '@/globals/types'
import { APP_STORE_STORAGE_NAME } from '@/globals/globals'
import {
  DEFAULT_GAME_CHECKOUT,
  DEFAULT_GAME_MODE,
  DEFAULT_GAME_OPENING,
  DEFAULT_GAME_LEGS,
  DEFAULT_GAME_STATE,
  DEFAULT_GAME_ELIMINATION,
  DEFAULT_GAME_VARIANT,
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  DEFAULT_TOURNAMENT_PANEL_SCALE,
  DEFAULT_EMPTY_TOURNAMENT,
  DEFAULT_EMPTY_PLAYER,
  DEFAULT_CONNECTION_MODE,
} from '@/globals/defaults'
import { generateRandomConnectionString, generateUUID } from '@/lib/utils'
import { newTournament } from './TournamentActions'

export const useAppStore = create(
  persist(
    combine(
      {
        language: DEFAULT_LANGUAGE,
        theme: DEFAULT_THEME,
        isConnectionPending: false,
        connectionMode: DEFAULT_CONNECTION_MODE,
        connectionString: generateRandomConnectionString(),

        gameState: DEFAULT_GAME_STATE,
        gameVariant: DEFAULT_GAME_VARIANT,
        gameMode: DEFAULT_GAME_MODE,
        gameOpening: DEFAULT_GAME_OPENING,
        gameCheckout: DEFAULT_GAME_CHECKOUT,
        gameLegs: DEFAULT_GAME_LEGS,
        gameElimination: DEFAULT_GAME_ELIMINATION,
        gameMatchForThirdPlace: false,
        players: [{ ...DEFAULT_EMPTY_PLAYER, id: generateUUID() }] as PlayerType[],
        tournament: { ...DEFAULT_EMPTY_TOURNAMENT },
        tournamentPanelScale: DEFAULT_TOURNAMENT_PANEL_SCALE,
        selectedTab: DEFAULT_GAME_STATE,
        showConfetti: false,
        // A new tournament has an empty list of players so we have an error by default
        // This prevents the user to start the tournament without a valid list of players
        preparationErrorMessages: ['ERROR_MESSAGE.MIN_MAX_PLAYER'] as string[],
      },

      (set, get) => {
        // Helper factory to reduce boilerplate for state setters with equality checks
        const createSetter =
          <K extends keyof ReturnType<typeof get>>(key: K) =>
          (value: ReturnType<typeof get>[K]) => {
            if (get()[key] === value) return
            set({ [key]: value } as Record<K, ReturnType<typeof get>[K]>)
          }

        return {
          actions: {
            setLanguage: createSetter('language'),
            setTheme: createSetter('theme'),
            setIsConnectionPending: createSetter('isConnectionPending'),
            setConnectionMode: createSetter('connectionMode'),
            setConnectionString: createSetter('connectionString'),
            setGameVariant: createSetter('gameVariant'),
            setGameMode: createSetter('gameMode'),
            setGameOpening: createSetter('gameOpening'),
            setGameCheckout: createSetter('gameCheckout'),
            setGameLegs: createSetter('gameLegs'),
            setGameElimination: createSetter('gameElimination'),
            setGameMatchForThirdPlace: createSetter('gameMatchForThirdPlace'),
            setTournamentPanelScale: createSetter('tournamentPanelScale'),
            setSelectedTab: createSetter('selectedTab'),
            setShowConfetti: createSetter('showConfetti'),
          },
        }
      },
    ),
    {
      name: APP_STORE_STORAGE_NAME,
      // TODO: Validate the data via zod
      partialize: (state) => ({
        gameState: state.gameState ? state.gameState : DEFAULT_GAME_STATE,
        gameVariant: state.gameVariant ? state.gameVariant : DEFAULT_GAME_VARIANT,
        gameMode: state.gameMode ? state.gameMode : DEFAULT_GAME_MODE,
        gameOpening: state.gameOpening ? state.gameOpening : DEFAULT_GAME_OPENING,
        gameCheckout: state.gameCheckout ? state.gameCheckout : DEFAULT_GAME_CHECKOUT,
        gameLegs: state.gameLegs ? state.gameLegs : DEFAULT_GAME_LEGS,
        gameElimination: state.gameElimination ? state.gameElimination : DEFAULT_GAME_ELIMINATION,
        gameMatchForThirdPlace: state.gameMatchForThirdPlace ? state.gameMatchForThirdPlace : false,
        players: state.players ? state.players : ([{ ...DEFAULT_EMPTY_PLAYER, id: generateUUID() }] as PlayerType[]),
        tournament: state.tournament ? state.tournament : { ...DEFAULT_EMPTY_TOURNAMENT },
        selectedTab: state.selectedTab ? state.selectedTab : DEFAULT_GAME_STATE,
        tournamentPanelScale: state.tournamentPanelScale ? state.tournamentPanelScale : DEFAULT_TOURNAMENT_PANEL_SCALE,
        preparationErrorMessages: state.preparationErrorMessages ? state.preparationErrorMessages : ([] as string[]),
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onRehydrateStorage: (_state) => {
        return (_state, error) => {
          if (error) {
            console.error('Error loading store: ', error)
            localStorage.removeItem(APP_STORE_STORAGE_NAME)
            newTournament()
          } else {
            // Nothing yet to do
          }
        }
      },
    },
  ),
)

// Export the set and get methods for external actions
export const { setState, getState } = useAppStore

// Extract the getState type
export type AppStateType = ReturnType<typeof useAppStore.getState>

// For convenience access to the actions
export const useAppActions = () => useAppStore((state) => state.actions)
