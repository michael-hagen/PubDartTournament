import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import {
  DefaultGameCheckout,
  DefaultGameMode,
  DefaultGameOpening,
  DefaultGameLegs,
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
  DefaultLegValue,
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
  type RoundType,
  type MatchType,
  type MatchRowType,
  type LegValueType,
  type TournamentType,
} from '@/globals/types'
import {
  calculateEliminationRounds,
  calculateDoubleEliminationRounds,
  generateUUID,
  nextPowerOfTwo,
  shuffleArray,
} from '@/lib/utils'

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
      gameLegs: structuredClone(DefaultGameLegs),
      gameElimination: structuredClone(DefaultGameElimination),
      selectedTab: structuredClone(DefaultGameState),
      tournamentPanelScale: structuredClone(DefaultScale),
      preparationError: false,
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
      const getLegsToWin = (): number => {
        switch (get().gameLegs) {
          case 'LEGS_2':
            return 2
          case 'LEGS_3':
            return 3
          case 'LEGS_4':
            return 4
          case 'LEGS_5':
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
            set({ preparationError: true })
          }
        })
      }

      const validatePreparation = (): string | null => {
        // First validate the list of players
        validatePlayers(get().players)
        // Reset the preparationError
        set({ preparationError: false })

        // The last player in the list is a placeholder for entering a new player
        const playerCount = get().players.length - 1
        if (playerCount < 4) {
          set({ preparationError: true })
          return 'ERROR_MESSAGE.MIN_PLAYERS'
        }
        if (playerCount > 128) {
          set({ preparationError: true })
          return 'ERROR_MESSAGE.MAX_PLAYERS'
        }
        if (get().players.some((player, index) => index < playerCount && player.name.trim().length === 0)) {
          set({ preparationError: true })
          return 'ERROR_MESSAGE.EMPTY_PLAYER_NAME'
        }
        if (get().players.some((player) => player.errorMessage !== null && player.errorMessage !== undefined)) {
          set({ preparationError: true })
          return 'ERROR_MESSAGE.DUPLICATE_PLAYER_NAME'
        }
        return null
      }

      const prepareFirstRound = (newTournament: TournamentType, playerList: PlayerType[]) => {
        const firstRound = newTournament.rounds[0]
        const legsToWin = getLegsToWin()
        let playerOneIndex = 0
        let playerTwoIndex = playerList.length / 2
        // In the first round there are only winner ;-)
        for (let i = 0; i < firstRound.winnerMatches.length; i++) {
          // Pair the players for each match
          firstRound.winnerMatches[i].playerOneRow.player = playerList[playerOneIndex]
          firstRound.winnerMatches[i].playerTwoRow.player = playerList[playerTwoIndex]
          // Check if one player is a 'get a bye' and init the values for this case
          const isPlayerOneGetABye = playerList[playerOneIndex].name === 'GET_A_BYE'
          const isPlayerTwoGetABye = playerList[playerTwoIndex].name === 'GET_A_BYE'
          if (isPlayerOneGetABye || isPlayerTwoGetABye) {
            const legValueX01: LegValueType = {
              error: false,
              remainingPoints: getX01(),
            }
            firstRound.winnerMatches[i].playerOneRow.legs = []
            for (let j = 0; j < legsToWin; j++) {
              firstRound.winnerMatches[i].playerOneRow.legs.push(
                isPlayerOneGetABye ? structuredClone(legValueX01) : structuredClone(DefaultLegValue),
              )
            }
            firstRound.winnerMatches[i].playerTwoRow.legs = []
            for (let j = 0; j < legsToWin; j++) {
              firstRound.winnerMatches[i].playerTwoRow.legs.push(
                isPlayerTwoGetABye ? structuredClone(legValueX01) : structuredClone(DefaultLegValue),
              )
            }
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
        // Create the tournament data structure
        const newTournament = structuredClone(DefaultTournament)
        eliminationRounds.map(({ matchCount }, index) => {
          const newRound: RoundType = {
            id: generateUUID(),
            name: index === eliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
            winnerMatches: [],
            finished: false,
          }
          for (let i = 0; i < matchCount; i++) {
            const playerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: [structuredClone(DefaultLegValue)],
              throws: [],
            }
            const playerTwoRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: [structuredClone(DefaultLegValue)],
              throws: [],
            }
            const winnerMatch: MatchType = {
              id: generateUUID(),
              fieldErrorMessages: [],
              matchErrorMessages: [],
              playerOneRow: playerOneRow,
              playerTwoRow: playerTwoRow,
            }
            newRound.winnerMatches.push(winnerMatch)
          }
          newTournament.rounds.push(newRound)
        })

        prepareFirstRound(newTournament, playerList)

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
        // Create the tournament data structure
        const newTournament = structuredClone(DefaultTournament)
        doubleEliminationRounds.map(({ winnerMatchCount, loserMatchCount }, index) => {
          const newRound: RoundType = {
            id: generateUUID(),
            name: index === doubleEliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
            winnerMatches: [],
            loserMatches: [],
            finished: false,
          }
          for (let i = 0; i < winnerMatchCount; i++) {
            const winnerPlayerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: [structuredClone(DefaultLegValue)],
              throws: [],
            }
            const winnerPlayerTwoRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: [structuredClone(DefaultLegValue)],
              throws: [],
            }
            const winnerMatch: MatchType = {
              id: generateUUID(),
              fieldErrorMessages: [],
              matchErrorMessages: [],
              playerOneRow: winnerPlayerOneRow,
              playerTwoRow: winnerPlayerTwoRow,
            }
            newRound.winnerMatches.push(winnerMatch)
          }
          for (let i = 0; i < loserMatchCount; i++) {
            const loserPlayerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: [structuredClone(DefaultLegValue)],
              throws: [],
            }
            const loserPlayerTowRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DefaultEmptyPlayer),
              legs: [structuredClone(DefaultLegValue)],
              throws: [],
            }
            const loserMatch: MatchType = {
              id: generateUUID(),
              fieldErrorMessages: [],
              matchErrorMessages: [],
              playerOneRow: loserPlayerOneRow,
              playerTwoRow: loserPlayerTowRow,
            }
            newRound.loserMatches?.push(loserMatch)
          }
          newTournament.rounds.push(newRound)
        })

        prepareFirstRound(newTournament, playerList)

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

          updatePlayer: (playerIndex: number, player: string) => {
            if (
              playerIndex < 0 ||
              playerIndex > get().players.length - 1 ||
              get().players[playerIndex].name === player.trim()
            )
              return

            const newPlayers = get().players.slice()
            newPlayers[playerIndex] = { id: generateUUID(), name: player.trim() }
            validatePlayers(newPlayers)
            set({ players: newPlayers })
            validatePreparation()
          },

          addPlayer: () => {
            const newPlayers = get().players.slice()
            newPlayers.push({ id: generateUUID(), name: '' })
            validatePlayers(newPlayers)
            set({ players: newPlayers })
            validatePreparation()
          },

          removePlayer: (playerIndex: number) => {
            if (playerIndex < 0 || playerIndex > get().players.length - 1) return

            // We don't delete the last player instead we set him to an empty string
            if (get().players.length === 1) {
              const newPlayers = get().players.slice()
              newPlayers[playerIndex] = { id: generateUUID(), name: '' }
              validatePlayers(newPlayers)
              set({ players: newPlayers })
              validatePreparation()
              return
            }

            const newPlayers = get().players.filter((_, index) => index !== playerIndex)
            validatePlayers(newPlayers)
            set({ players: newPlayers })
            validatePreparation()
          },

          newGame: () => {
            set({
              selectedTab: structuredClone(DefaultGameState),
              gameState: structuredClone(DefaultGameState),
              gameVariant: structuredClone(DefaultGameVariant),
              gameMode: structuredClone(DefaultGameMode),
              gameOpening: structuredClone(DefaultGameOpening),
              gameCheckout: structuredClone(DefaultGameCheckout),
              gameLegs: structuredClone(DefaultGameLegs),
              gameElimination: structuredClone(DefaultGameElimination),
              players: structuredClone(DefaultPlayers),
              tournament: structuredClone(DefaultTournament),
            })
          },

          startTournament: () => {
            validatePreparation()
            if (!get().preparationError) {
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

          setLegValue: (
            roundIndex: number,
            winnerMatchIndex: number | undefined,
            loserMatchIndex: number | undefined,
            isPlayerOne: boolean,
            legIndex: number,
            remainingPoints: number,
          ) => {
            console.log(
              `value changed for round: ${roundIndex} winnerMatchIndex: ${winnerMatchIndex} loserMatchIndex: ${loserMatchIndex} isPlayerOne: ${isPlayerOne} legIndex: ${legIndex} legValue: ${remainingPoints}`,
            )
            const newTournament = structuredClone(get().tournament)
            const round = newTournament.rounds[roundIndex]
            const match: MatchType | null =
              winnerMatchIndex !== undefined
                ? round.winnerMatches[winnerMatchIndex]
                : loserMatchIndex !== undefined && round.loserMatches !== undefined
                  ? round.loserMatches[loserMatchIndex]
                  : null
            if (match) {
              const row: MatchRowType = isPlayerOne ? match.playerOneRow : match.playerTwoRow
              row.legs[legIndex].remainingPoints = remainingPoints

              // Reset the errorMessages
              match.fieldErrorMessages = []
              match.matchErrorMessages = []

              const maxPoints = getX01()
              const legsToWin = getLegsToWin()
              const maxLegs = legsToWin * 2 - 1
              const currentLegs = match.playerOneRow.legs.length
              let winsPlayerOne = 0
              let winsPlayerTwo = 0
              let hasWinner = false

              for (let i = 0; i < match.playerOneRow.legs.length; i++) {
                const leg1 = match.playerOneRow.legs[i]
                const leg2 = match.playerTwoRow.legs[i]
                // Reset error for the legs
                leg1.error = false
                leg2.error = false
                // Check if the remaining points are in the range of the game mode
                if (leg1.remainingPoints > maxPoints) {
                  match.fieldErrorMessages.push('ERROR_MESSAGE.REMAINING_POINTS_RANGE')
                  leg1.error = true
                }
                // Check if there is an empty leg
                if (leg2.remainingPoints > maxPoints) {
                  match.fieldErrorMessages.push('ERROR_MESSAGE.REMAINING_POINTS_RANGE')
                  leg2.error = true
                }
                if (leg1.remainingPoints > 0 && leg2.remainingPoints > 0) {
                  match.fieldErrorMessages.push('ERROR_MESSAGE.INVALID_LEG')
                  leg1.error = true
                  leg2.error = true
                }
                if (leg1.remainingPoints > 0) winsPlayerTwo++
                if (leg2.remainingPoints > 0) winsPlayerOne++
              }

              // find out if there is already a winner
              match.playerOneRow.isWinner = undefined
              match.playerTwoRow.isWinner = undefined
              if (winsPlayerOne === legsToWin) {
                hasWinner = true
                match.playerOneRow.isWinner = true
                match.playerTwoRow.isWinner = false
              } else if (winsPlayerOne > legsToWin) {
                match.matchErrorMessages.push('ERROR_MESSAGE.TO_MANY_WINS')
              }
              if (winsPlayerTwo === legsToWin) {
                hasWinner = true
                match.playerOneRow.isWinner = false
                match.playerTwoRow.isWinner = true
              } else if (winsPlayerTwo > legsToWin) {
                match.matchErrorMessages.push('ERROR_MESSAGE.TO_MANY_WINS')
              }

              if (hasWinner) {
                // If we have a winner we might have to delete the last leg
                const remainingPoints1 = match.playerOneRow.legs[match.playerOneRow.legs.length - 1].remainingPoints
                const remainingPoints2 = match.playerTwoRow.legs[match.playerOneRow.legs.length - 1].remainingPoints
                if (remainingPoints1 === 0 && remainingPoints2 === 0) {
                  match.playerOneRow.legs.pop()
                  match.playerTwoRow.legs.pop()
                }
              } else {
                // If there is no winner we might have to add a new leg
                if (currentLegs <= winsPlayerOne + winsPlayerTwo && currentLegs < maxLegs) {
                  match.playerOneRow.legs.push(structuredClone(DefaultLegValue))
                  match.playerTwoRow.legs.push(structuredClone(DefaultLegValue))
                }
              }
              // If previous legs are edited there might be an unnecessary leg at the end
              if (currentLegs - 1 > winsPlayerOne + winsPlayerTwo) {
                const remainingPoints1 = match.playerOneRow.legs[match.playerOneRow.legs.length - 1].remainingPoints
                const remainingPoints2 = match.playerTwoRow.legs[match.playerOneRow.legs.length - 1].remainingPoints
                // Only remove the leg if not already edited
                if (remainingPoints1 === 0 && remainingPoints2 === 0) {
                  match.playerOneRow.legs.pop()
                  match.playerTwoRow.legs.pop()
                }
              }
              // Check if there are legs with 0:0 in the middle of the match
              for (let i = 0; i < match.playerOneRow.legs.length - 1; i++) {
                const remainingPoints1 = match.playerOneRow.legs[i].remainingPoints
                const remainingPoints2 = match.playerTwoRow.legs[i].remainingPoints
                if (remainingPoints1 === 0 && remainingPoints2 === 0) {
                  match.matchErrorMessages.push('ERROR_MESSAGE.EMPTY_LEG')
                }
              }

              // Set the new tournament data
              set({ tournament: newTournament })
            } else {
              throw Error(
                `Can't find match for winnerMatchIndex: ${winnerMatchIndex} loserMatchIndex: ${loserMatchIndex}`,
              )
            }
          },
        },
      }
    },
  ),
)

// For convenience access to the actions
export const useAppActions = () => useAppStore((state) => state.actions)
