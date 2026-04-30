import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import {
  DefaultGameCheckout,
  DefaultGameMode,
  DefaultGameOpening,
  DefaultGameSets,
  DefaultGameState,
  DefaultGameElimination,
  DefaultGameVariant,
  DefaultLanguage,
  DefaultTheme,
  DefaultScale,
  DefaultTournament,
  DefaultPlayers,
  DefaultGetAByePlayer,
  DefaultEmptyPlayer,
} from '@/globals/defaults'
import {
  type GameCheckoutType,
  type GameModeType,
  type GameOpeningType,
  type GameSetsType,
  type GameStateType,
  type GameEliminationType,
  type GameVariantType,
  type PlayerType,
  type ThemeType,
  type RoundType,
  type MatchType,
  type MatchRowType,
} from '@/globals/types'
import {
  calculateEliminationRounds,
  calculateDoubleEliminationRounds,
  generateUUID,
  nextPowerOfTwo,
  shuffleArray,
} from '@/lib/utils'
import i18next from 'i18next'

export const useAppStore = create(
  combine(
    {
      language: structuredClone(DefaultLanguage),
      theme: structuredClone(DefaultTheme),
      gameState: structuredClone(DefaultGameState),
      gameVariant: structuredClone(DefaultGameVariant),
      gameMode: structuredClone(DefaultGameMode),
      gameOpening: structuredClone(DefaultGameOpening),
      gameCheckout: structuredClone(DefaultGameCheckout),
      gameSets: structuredClone(DefaultGameSets),
      gameElimination: structuredClone(DefaultGameElimination),
      selectedTab: structuredClone(DefaultGameState),
      tournamentPanelScale: structuredClone(DefaultScale),
      players: [
        { id: generateUUID(), name: 'Micky' },
        { id: generateUUID(), name: 'Anke' },
        { id: generateUUID(), name: 'Euli' },
        { id: generateUUID(), name: 'Franz' },
        { id: generateUUID(), name: 'Bambi' },
        { id: generateUUID(), name: 'Janik' },
        { id: generateUUID(), name: 'Hans' },
        { id: generateUUID(), name: 'Herbert' },
        { id: generateUUID(), name: 'Anika' },
        { id: generateUUID(), name: 'Gerda' },
        { id: generateUUID(), name: 'Klaus' },
        { id: generateUUID(), name: 'Edith' },
        { id: generateUUID(), name: 'Volker' },
        { id: generateUUID(), name: 'Christian' },
        { id: generateUUID(), name: '' },
      ] as PlayerType[],
      tournament: structuredClone(DefaultTournament),
    },
    (set, get) => {
      const getSetCount = (): number => {
        switch (get().gameSets) {
          case 'SETS_2':
            return 2
          case 'SETS_3':
            return 3
          case 'SETS_4':
            return 4
          case 'SETS_5':
            return 5
        }
      }

      const getX01 = (): number => {
        switch (get().gameMode) {
          case 'MODE_301':
            return 301
          case 'MODE_501':
            return 501
          case 'MODE_701':
            return 701
          case 'MODE_1001':
            return 1001
        }
      }

      const validatePlayers = (newPlayers: PlayerType[]) => {
        newPlayers.map((player, playerIndex) => {
          const otherPlayers = newPlayers.filter((_, index) => index !== playerIndex)
          const exists = otherPlayers.some((p) => p.name === player.name)

          newPlayers[playerIndex].errorMessage = undefined

          // Last player is for input a new player so it will be empty at start
          if (playerIndex < newPlayers.length - 1) {
            if (player.name.trim().length === 0) {
              newPlayers[playerIndex].errorMessage = 'ERROR_MESSAGE.EMPTY_PLAYER_NAME'
            }
          }

          if (exists) {
            newPlayers[playerIndex].errorMessage = 'ERROR_MESSAGE.DUPLICATE_PLAYER_NAME'
          }
        })
      }

      const getPreparationErrorMessage = (): string | null => {
        if (get().players.length < 4) return i18next.t('ERROR_MESSAGE.MIN_PLAYERS', { ns: 'app' })
        if (get().players.length > 128) return i18next.t('ERROR_MESSAGE.MAX_PLAYERS', { ns: 'app' })
        if (get().players.some((player) => player.errorMessage !== null && player.errorMessage !== undefined))
          return i18next.t('ERROR_MESSAGE.DUPLICATE_PLAYER', { ns: 'app' })
        return null
      }

      const prepareKOTournament = () => {
        // The count of players must be a power of 2 (2, 4, 8, 16, 32, ...)
        const playerCount = nextPowerOfTwo(get().players.length)
        // We want to have a random order of players
        const playerList = shuffleArray<PlayerType>(get().players.slice(0, get().players.length - 1))
        // Fill the remaining spots with a (get a bye) player
        while (playerList.length < playerCount) {
          playerList.push(structuredClone(DefaultGetAByePlayer))
        }
        // Calculate the amount of rounds needed
        const eliminationRounds = calculateEliminationRounds(playerCount)
        // Get the sets needed to win
        const setCount = getSetCount()

        // Create the tournament data structure
        const newTournament = structuredClone(DefaultTournament)
        eliminationRounds.map(({ games }, index) => {
          const newRound: RoundType = {
            id: generateUUID(),
            name: index === eliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
            winnerMatches: [],
            finished: false,
          }
          for (let i = 0; i < games; i++) {
            const playerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: Array(setCount).fill(0),
              throws: [],
            }
            const playerTowRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: Array(setCount).fill(0),
              throws: [],
            }
            const winnerMatch: MatchType = {
              id: generateUUID(),
              playerOneRow: playerOneRow,
              playerTwoRow: playerTowRow,
            }
            newRound.winnerMatches.push(winnerMatch)
          }
          newTournament.rounds.push(newRound)
        })

        // Prepare the first round with the list of players
        const firstRound = newTournament.rounds[0]
        let playerOneIndex = 0
        let playerTwoIndex = playerCount / 2
        for (let i = 0; i < firstRound.winnerMatches.length; i++) {
          firstRound.winnerMatches[i].playerOneRow.player = playerList[playerOneIndex]
          firstRound.winnerMatches[i].playerTwoRow.player = playerList[playerTwoIndex]
          const isPlayerOneGetABye = playerList[playerOneIndex].name === 'GET_A_BYE'
          const isPlayerTwoGetABye = playerList[playerTwoIndex].name === 'GET_A_BYE'
          if (isPlayerOneGetABye || isPlayerTwoGetABye) {
            firstRound.winnerMatches[i].playerOneRow.legs = Array(setCount).fill(isPlayerOneGetABye ? getX01() : 0)
            firstRound.winnerMatches[i].playerTwoRow.legs = Array(setCount).fill(isPlayerTwoGetABye ? getX01() : 0)
            if (isPlayerOneGetABye) {
              firstRound.winnerMatches[i].playerOneRow.isWinner = false
              firstRound.winnerMatches[i].playerTwoRow.isWinner = true
            } else {
              firstRound.winnerMatches[i].playerOneRow.isWinner = true
              firstRound.winnerMatches[i].playerTwoRow.isWinner = false
            }
          }
          playerOneIndex++
          playerTwoIndex++
        }
        set({ tournament: newTournament })
      }

      const prepareDoubleKOTournament = () => {
        // The count of players must be a power of 2 (2, 4, 8, 16, 32, ...)
        const playerCount = nextPowerOfTwo(get().players.length)
        // We want to have a random order of players
        const playerList = shuffleArray<PlayerType>(get().players.slice(0, get().players.length - 1))
        // Fill the remaining spots with a (get a bye) player
        while (playerList.length < playerCount) {
          playerList.push(structuredClone(DefaultGetAByePlayer))
        }
        const doubleEliminationRounds = calculateDoubleEliminationRounds(playerCount)
        // Get the sets needed to win
        const setCount = getSetCount()
        // Create the tournament data structure
        const newTournament = structuredClone(DefaultTournament)
        doubleEliminationRounds.map(({ winnerGames, loserGames }, index) => {
          console.log('--> round: ', index, ' winnerGames: ', winnerGames, ' loserGames', loserGames)
          const newRound: RoundType = {
            id: generateUUID(),
            name: index === doubleEliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
            winnerMatches: [],
            loserMatches: [],
            finished: false,
          }
          for (let i = 0; i < winnerGames; i++) {
            const winnerPlayerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: Array(setCount).fill(0),
              throws: [],
            }
            const winnerPlayerTowRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: Array(setCount).fill(0),
              throws: [],
            }
            const winnerMatch: MatchType = {
              id: generateUUID(),
              playerOneRow: winnerPlayerOneRow,
              playerTwoRow: winnerPlayerTowRow,
            }
            newRound.winnerMatches.push(winnerMatch)
          }
          for (let i = 0; i < loserGames; i++) {
            const loserPlayerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: Array(setCount).fill(0),
              throws: [],
            }
            const loserPlayerTowRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: Array(setCount).fill(0),
              throws: [],
            }
            const loserMatch: MatchType = {
              id: generateUUID(),
              playerOneRow: loserPlayerOneRow,
              playerTwoRow: loserPlayerTowRow,
            }
            newRound.loserMatches?.push(loserMatch)
          }
          newTournament.rounds.push(newRound)
        })
        // Prepare the first round with the list of players
        const firstRound = newTournament.rounds[0]
        let playerOneIndex = 0
        let playerTwoIndex = playerCount / 2
        for (let i = 0; i < firstRound.winnerMatches.length; i++) {
          firstRound.winnerMatches[i].playerOneRow.player = playerList[playerOneIndex]
          firstRound.winnerMatches[i].playerTwoRow.player = playerList[playerTwoIndex]
          const isPlayerOneGetABye = playerList[playerOneIndex].name === 'GET_A_BYE'
          const isPlayerTwoGetABye = playerList[playerTwoIndex].name === 'GET_A_BYE'
          if (isPlayerOneGetABye || isPlayerTwoGetABye) {
            firstRound.winnerMatches[i].playerOneRow.legs = Array(setCount).fill(isPlayerOneGetABye ? getX01() : 0)
            firstRound.winnerMatches[i].playerTwoRow.legs = Array(setCount).fill(isPlayerTwoGetABye ? getX01() : 0)
            if (isPlayerOneGetABye) {
              firstRound.winnerMatches[i].playerOneRow.isWinner = false
              firstRound.winnerMatches[i].playerTwoRow.isWinner = true
            } else {
              firstRound.winnerMatches[i].playerOneRow.isWinner = true
              firstRound.winnerMatches[i].playerTwoRow.isWinner = false
            }
          }
          playerOneIndex++
          playerTwoIndex++
        }

        set({ tournament: newTournament })
      }

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

          setGameSets: (newSets: GameSetsType) => {
            if (get().gameSets === newSets) return
            set({ gameSets: newSets })
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

          updatePlayer: (playerIndex: number, player: string) => {
            if (playerIndex < 0 || playerIndex > get().players.length - 1 || get().players[playerIndex].name === player)
              return

            const newPlayers = get().players.slice()
            newPlayers[playerIndex] = { id: generateUUID(), name: player }

            validatePlayers(newPlayers)
            set({ players: newPlayers })
          },

          addPlayer: () => {
            const newPlayers = get().players.slice()
            newPlayers.push({ id: generateUUID(), name: '' })
            set({ players: newPlayers })
          },

          removePlayer: (playerIndex: number) => {
            if (playerIndex < 0 || playerIndex > get().players.length - 1) return

            // We don't delete the last player instead we set him to an empty string
            if (get().players.length === 1) {
              const newPlayers = get().players.slice()
              newPlayers[playerIndex] = { id: generateUUID(), name: '' }
              set({ players: newPlayers })
              return
            }

            const newPlayers = get().players.filter((_, index) => index !== playerIndex)
            validatePlayers(newPlayers)
            set({ players: newPlayers })
          },

          newGame: () => {
            console.log('--> execute new game')
            set({
              selectedTab: structuredClone(DefaultGameState),
              gameState: structuredClone(DefaultGameState),
              gameVariant: structuredClone(DefaultGameVariant),
              gameMode: structuredClone(DefaultGameMode),
              gameOpening: structuredClone(DefaultGameOpening),
              gameCheckout: structuredClone(DefaultGameCheckout),
              gameSets: structuredClone(DefaultGameSets),
              gameElimination: structuredClone(DefaultGameElimination),
              players: structuredClone(DefaultPlayers),
              tournament: structuredClone(DefaultTournament),
            })
          },

          startTournament: () => {
            const preparationErrorMessage = getPreparationErrorMessage()
            if (preparationErrorMessage) {
              console.log(preparationErrorMessage)
            } else {
              if (get().gameElimination === 'KO') {
                prepareKOTournament()
              }
              if (get().gameElimination === 'DOUBLE_KO') {
                prepareDoubleKOTournament()
              }
              set({ gameState: 'TOURNAMENT' })
              set({ selectedTab: 'TOURNAMENT' })
            }
          },
        },
      }
    },
  ),
)

// For convenience access to the actions
export const useAppActions = () => useAppStore((state) => state.actions)
