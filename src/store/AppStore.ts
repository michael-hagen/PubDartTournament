import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'

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
  DEFAULT_SCALE,
  DEFAULT_EMPTY_TOURNAMENT,
  DEFAULT_EMPTY_PLAYER,
} from '@/globals/defaults'
import {
  type GameCheckoutType,
  type GameModeType,
  type GameOpeningType,
  type GameLegsType,
  type GameStateType,
  type GameEliminationType,
  type GameVariantType,
  type PlayerType,
  type ThemeType,
} from '@/globals/types'
import { generateUUID } from '@/lib/utils'
import { newTournament } from './TournamentActions'

export const useAppStore = create(
  persist(
    combine(
      {
        language: DEFAULT_LANGUAGE,
        theme: DEFAULT_THEME,

        gameState: DEFAULT_GAME_STATE,
        gameVariant: DEFAULT_GAME_VARIANT,
        gameMode: DEFAULT_GAME_MODE,
        gameOpening: DEFAULT_GAME_OPENING,
        gameCheckout: DEFAULT_GAME_CHECKOUT,
        gameLegs: DEFAULT_GAME_LEGS,
        gameElimination: DEFAULT_GAME_ELIMINATION,
        players: [{ ...DEFAULT_EMPTY_PLAYER, id: generateUUID() }] as PlayerType[],
        tournament: { ...DEFAULT_EMPTY_TOURNAMENT },

        selectedTab: DEFAULT_GAME_STATE,
        tournamentPanelScale: DEFAULT_SCALE,
        // TODO: Better store an array of error messages
        preparationError: false,
        showConfetti: false,
      },

      (set, get) => {
        return {
          actions: {
            setLanguage: (newLanguage: string) => {
              if (get().language === newLanguage) return
              set({ language: newLanguage })
            },

            setTheme: (newTheme: ThemeType) => {
              localStorage.setItem('theme', newTheme)
              const root = document.documentElement
              root.classList.remove('light', 'dark')
              root.classList.add(newTheme)

              if (get().theme === newTheme) return
              set({ theme: newTheme })
            },

            setGameVariant: (newVariant: GameVariantType) => {
              if (get().gameVariant === newVariant) return
              set({ gameVariant: newVariant })
            },

            setGameMode: (newMode: GameModeType) => {
              if (get().gameMode === newMode) return
              set({ gameMode: newMode })
            },

            setGameOpening: (newOpening: GameOpeningType) => {
              if (get().gameOpening === newOpening) return
              set({ gameOpening: newOpening })
            },

            setGameCheckout: (newCheckout: GameCheckoutType) => {
              if (get().gameCheckout === newCheckout) return
              set({ gameCheckout: newCheckout })
            },

            setGameLegs: (newLegs: GameLegsType) => {
              if (get().gameLegs === newLegs) return
              set({ gameLegs: newLegs })
            },

            setGameElimination: (newElimination: GameEliminationType) => {
              if (get().gameElimination === newElimination) return
              set({ gameElimination: newElimination })
            },

            setSelectedTab: (newTab: GameStateType) => {
              if (get().selectedTab === newTab) return
              set({ selectedTab: newTab })
            },

            setTournamentPanelScale: (newScale: number) => {
              if (get().tournamentPanelScale === newScale) return
              set({ tournamentPanelScale: newScale })
            },

            setShowConfetti: (newShowConfetti: boolean) => {
              set({ showConfetti: newShowConfetti })
            },
          },
        }
      },
    ),
    {
      name: 'pub-dart-tournament',
      partialize: (state) => ({
        gameState: state.gameState,
        gameVariant: state.gameVariant,
        gameMode: state.gameMode,
        gameOpening: state.gameOpening,
        gameCheckout: state.gameCheckout,
        gameLegs: state.gameLegs,
        gameElimination: state.gameElimination,
        players: state.players,
        tournament: state.tournament,
        selectedTab: state.selectedTab,
        tournamentPanelScale: state.tournamentPanelScale,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onRehydrateStorage: (_state) => {
        return (_state, error) => {
          if (error) {
            console.error('Error loading store: ', error)
            localStorage.removeItem('pub-dart-tournament')
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
const { setState, getState } = useAppStore
export { setState, getState }

// For convenience access to the actions
export const useAppActions = () => useAppStore((state) => state.actions)
