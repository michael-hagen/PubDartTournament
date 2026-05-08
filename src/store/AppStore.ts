// TODO: Refactor this code it's much to big. Learn more about zustand

import { create } from 'zustand'
import { combine } from 'zustand/middleware'

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
  DEFAULT_PLAYERS,
  DEFAULT_GET_A_BYE_PLAYER,
  DEFAULT_EMPTY_PLAYER,
  DEFAULT_LEG_VALUE,
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
      language: structuredClone(DEFAULT_LANGUAGE),
      theme: structuredClone(DEFAULT_THEME),

      gameState: structuredClone(DEFAULT_GAME_STATE),
      gameVariant: structuredClone(DEFAULT_GAME_VARIANT),
      gameMode: structuredClone(DEFAULT_GAME_MODE),
      gameOpening: structuredClone(DEFAULT_GAME_OPENING),
      gameCheckout: structuredClone(DEFAULT_GAME_CHECKOUT),
      gameLegs: structuredClone(DEFAULT_GAME_LEGS),
      gameElimination: structuredClone(DEFAULT_GAME_ELIMINATION),
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
      tournament: structuredClone(DEFAULT_EMPTY_TOURNAMENT),

      selectedTab: structuredClone(DEFAULT_GAME_STATE),
      tournamentPanelScale: structuredClone(DEFAULT_SCALE),
      preparationError: false,
      showConfetti: false,
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

      const prepareGetAByeMatch = (match: MatchType, isPlayerOneGetABye: boolean, isPlayerTwoGetABye: boolean) => {
        if (isPlayerOneGetABye || isPlayerTwoGetABye) {
          const legsToWin = getLegsToWin()
          const legValueX01: LegValueType = {
            error: false,
            remainingPoints: getX01(),
          }
          match.playerOneRow.legs = []
          match.playerTwoRow.legs = []
          if (isPlayerTwoGetABye) {
            for (let j = 0; j < legsToWin; j++) {
              match.playerOneRow.legs.push(structuredClone(DEFAULT_LEG_VALUE))
            }
            for (let j = 0; j < legsToWin; j++) {
              match.playerTwoRow.legs.push(structuredClone(legValueX01))
            }
            match.playerOneRow.isWinner = true
            match.playerTwoRow.isWinner = false
          } else {
            for (let j = 0; j < legsToWin; j++) {
              match.playerOneRow.legs.push(structuredClone(legValueX01))
            }
            for (let j = 0; j < legsToWin; j++) {
              match.playerTwoRow.legs.push(structuredClone(DEFAULT_LEG_VALUE))
            }
            match.playerOneRow.isWinner = false
            match.playerTwoRow.isWinner = true
          }
        }
      }

      const prepareFirstRound = (newTournament: TournamentType, playerList: PlayerType[]) => {
        const firstRound = newTournament.rounds[0]
        let playerOneIndex = 0
        let playerTwoIndex = playerList.length / 2
        // In the first round there are only winner ;-)
        for (let i = 0; i < firstRound.winnerMatches.length; i++) {
          // Pair the players for each match
          firstRound.winnerMatches[i].playerOneRow.player = playerList[playerOneIndex]
          firstRound.winnerMatches[i].playerTwoRow.player = playerList[playerTwoIndex]
          // Check if the match contains a 'get a bye' player and init the values for this case
          const isPlayerOneGetABye = playerList[playerOneIndex].name === 'GET_A_BYE'
          const isPlayerTwoGetABye = playerList[playerTwoIndex].name === 'GET_A_BYE'
          prepareGetAByeMatch(firstRound.winnerMatches[i], isPlayerOneGetABye, isPlayerTwoGetABye)
          playerOneIndex++
          playerTwoIndex++
        }
      }

      const prepareKOTournament = () => {
        // The count of players must be a power of 2 (2, 4, 8, 16, 32, ...)
        // -2 because the last player is only a placeholder (that's -1) and if we have a power of two player count we don't want the nexPowerOfTwo (thats another -1)
        const playerCount = nextPowerOfTwo(get().players.length - 2)
        // We want to have a random order of players
        const playerList = shuffleArray<PlayerType>(get().players.slice(0, get().players.length - 1))
        // Fill the remaining spots with a (get a bye) player
        while (playerList.length < playerCount) {
          playerList.push(structuredClone(DEFAULT_GET_A_BYE_PLAYER))
        }
        // Calculate the amount of rounds needed
        const eliminationRounds = calculateEliminationRounds(playerCount)
        // Create the tournament data structure
        const newTournament = structuredClone(DEFAULT_EMPTY_TOURNAMENT)
        eliminationRounds.map(({ matchCount }, index) => {
          const newRound: RoundType = {
            id: generateUUID(),
            name: index === eliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
            winnerMatches: [],
            finishable: false,
            finished: false,
          }
          for (let i = 0; i < matchCount; i++) {
            const playerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DEFAULT_EMPTY_PLAYER),
              legs: [structuredClone(DEFAULT_LEG_VALUE)],
              throws: [],
            }
            const playerTwoRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DEFAULT_EMPTY_PLAYER),
              legs: [structuredClone(DEFAULT_LEG_VALUE)],
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
        // -2 because the last player is only a placeholder (that's -1) and if we have a power of two player count we don't want the nexPowerOfTwo (thats another -1)
        const playerCount = nextPowerOfTwo(get().players.length - 2)
        // We want to have a random order of players
        const playerList = shuffleArray<PlayerType>(get().players.slice(0, get().players.length - 1))
        // Fill the remaining spots with a (get a bye) player
        while (playerList.length < playerCount) {
          playerList.push(structuredClone(DEFAULT_GET_A_BYE_PLAYER))
        }
        const doubleEliminationRounds = calculateDoubleEliminationRounds(playerCount)
        // Create the tournament data structure
        const newTournament = structuredClone(DEFAULT_EMPTY_TOURNAMENT)
        doubleEliminationRounds.map(({ winnerMatchCount, loserMatchCount }, index) => {
          const newRound: RoundType = {
            id: generateUUID(),
            name: index === doubleEliminationRounds.length - 1 ? 'FINAL' : 'ROUND',
            winnerMatches: [],
            loserMatches: [],
            finishable: false,
            finished: false,
          }
          for (let i = 0; i < winnerMatchCount; i++) {
            const winnerPlayerOneRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DEFAULT_EMPTY_PLAYER),
              legs: [structuredClone(DEFAULT_LEG_VALUE)],
              throws: [],
            }
            const winnerPlayerTwoRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DEFAULT_EMPTY_PLAYER),
              legs: [structuredClone(DEFAULT_LEG_VALUE)],
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
              player: structuredClone(DEFAULT_EMPTY_PLAYER),
              legs: [structuredClone(DEFAULT_LEG_VALUE)],
              throws: [],
            }
            const loserPlayerTowRow: MatchRowType = {
              id: generateUUID(),
              player: structuredClone(DEFAULT_EMPTY_PLAYER),
              legs: [structuredClone(DEFAULT_LEG_VALUE)],
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

      const resetErrorMessages = (match: MatchType) => {
        match.fieldErrorMessages = []
        match.matchErrorMessages = []
      }

      const countWins = (match: MatchType): { winsPlayerOne: number; winsPlayerTwo: number } => {
        const maxPoints = getX01()
        let winsPlayerOne = 0
        let winsPlayerTwo = 0

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
        return { winsPlayerOne, winsPlayerTwo }
      }

      const checkForWinner = (match: MatchType, winsPlayerOne: number, winsPlayerTwo: number): boolean => {
        const legsToWin = getLegsToWin()
        // find out if there is already a winner
        match.playerOneRow.isWinner = undefined
        match.playerTwoRow.isWinner = undefined
        if (winsPlayerOne === legsToWin) {
          match.playerOneRow.isWinner = true
          match.playerTwoRow.isWinner = false
          return true
        } else if (winsPlayerOne > legsToWin) {
          match.matchErrorMessages.push('ERROR_MESSAGE.TO_MANY_WINS')
        }
        if (winsPlayerTwo === legsToWin) {
          match.playerOneRow.isWinner = false
          match.playerTwoRow.isWinner = true
          return true
        } else if (winsPlayerTwo > legsToWin) {
          match.matchErrorMessages.push('ERROR_MESSAGE.TO_MANY_WINS')
        }
        return false
      }

      const checkForAddLeg = (match: MatchType, hasWinner: boolean, winsPlayerOne: number, winsPlayerTwo: number) => {
        if (hasWinner) return
        const currentLegs = match.playerOneRow.legs.length
        const maxLegs = getLegsToWin() * 2 - 1
        if (currentLegs <= winsPlayerOne + winsPlayerTwo && currentLegs < maxLegs) {
          match.playerOneRow.legs.push(structuredClone(DEFAULT_LEG_VALUE))
          match.playerTwoRow.legs.push(structuredClone(DEFAULT_LEG_VALUE))
        }
      }

      const checkForLastLegIsEmpty = (
        match: MatchType,
        hasWinner: boolean,
        winsPlayerOne: number,
        winsPlayerTwo: number,
      ) => {
        const lastLegIndex = match.playerOneRow.legs.length - 1
        // Check if there is an unnecessary leg at the end of the match
        if (hasWinner || lastLegIndex > winsPlayerOne + winsPlayerTwo) {
          const remainingPoints1 = match.playerOneRow.legs[lastLegIndex].remainingPoints
          const remainingPoints2 = match.playerTwoRow.legs[lastLegIndex].remainingPoints
          // Only remove the leg if not already edited
          if (remainingPoints1 === 0 && remainingPoints2 === 0) {
            match.playerOneRow.legs.pop()
            match.playerTwoRow.legs.pop()
          }
        }
      }

      const checkForEmptyLegs = (match: MatchType) => {
        // Check if there are legs with 0:0 in the middle of the match
        for (let i = 0; i < match.playerOneRow.legs.length - 1; i++) {
          const remainingPoints1 = match.playerOneRow.legs[i].remainingPoints
          const remainingPoints2 = match.playerTwoRow.legs[i].remainingPoints
          if (remainingPoints1 === 0 && remainingPoints2 === 0) {
            match.matchErrorMessages.push('ERROR_MESSAGE.EMPTY_LEG')
          }
        }
      }

      const checkForRoundIsFinishable = (round: RoundType) => {
        let finishable = true
        // You can finish a round if all matches are finished and there are no error messages
        round.winnerMatches.map((match) => {
          if (match.fieldErrorMessages.length > 0 || match.matchErrorMessages.length > 0) {
            finishable = false
            return false
          }
          const hasWinner = match.playerOneRow.isWinner === true || match.playerTwoRow.isWinner === true
          if (!hasWinner) {
            finishable = false
            return false
          }
        })
        round.loserMatches?.map((match) => {
          if (match.fieldErrorMessages.length > 0 || match.matchErrorMessages.length > 0) {
            finishable = false
            return false
          }
          const hasWinner = match.playerOneRow.isWinner === true || match.playerTwoRow.isWinner === true
          if (!hasWinner) {
            finishable = false
            return false
          }
        })
        round.finishable = finishable
      }

      const prepareNewMatch = (round: RoundType, matchIndex: number, nextMatch: MatchType, winner: boolean) => {
        const match1 = round.winnerMatches[matchIndex]
        const match2 = round.winnerMatches[matchIndex + 1]
        let player1: PlayerType | null = null
        let player2: PlayerType | null = null
        if (winner) {
          player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
          player2 = match2.playerOneRow.isWinner ? match2.playerOneRow.player : match2.playerTwoRow.player
        } else {
          player1 = match1.playerOneRow.isWinner ? match1.playerTwoRow.player : match1.playerOneRow.player
          player2 = match2.playerOneRow.isWinner ? match2.playerTwoRow.player : match2.playerOneRow.player
        }
        if (player1 && player2) {
          nextMatch.playerOneRow.player = structuredClone(player1)
          nextMatch.playerTwoRow.player = structuredClone(player2)
          const isPlayerOneGetABye = nextMatch.playerOneRow.player.name === 'GET_A_BYE'
          const isPlayerTwoGetABye = nextMatch.playerTwoRow.player.name === 'GET_A_BYE'
          prepareGetAByeMatch(nextMatch, isPlayerOneGetABye, isPlayerTwoGetABye)
        }
      }

      const finishKORound = (newTournament: TournamentType, roundIndex: number) => {
        // In a elimination tournament we only have to put the winners of the current round in the new round
        if (roundIndex > newTournament.rounds.length - 1) return

        const round = newTournament.rounds[roundIndex]

        if (!round.finishable) return

        if (roundIndex === newTournament.rounds.length - 1) {
          round.finished = true
          return
        }

        const nextRound = newTournament.rounds[roundIndex + 1]
        let matchIndex = 0
        nextRound.winnerMatches.map((nextMatch) => {
          prepareNewMatch(round, matchIndex, nextMatch, true)
          matchIndex += 2
        })
        round.finished = true
      }

      const finishFirstRound = (newTournament: TournamentType) => {
        // in the first round of a double elimination we have to put the winners of the first round
        // in the next winner round and the loser in the next loser round
        const round = newTournament.rounds[0]

        if (!round.finishable) return

        const nextRound = newTournament.rounds[1]
        let matchIndex = 0
        nextRound.winnerMatches.map((nextMatch) => {
          prepareNewMatch(round, matchIndex, nextMatch, true)
          matchIndex += 2
        })
        matchIndex = 0
        nextRound.loserMatches?.map((nextMatch) => {
          prepareNewMatch(round, matchIndex, nextMatch, false)
          matchIndex += 2
        })
        round.finished = true
      }

      const finishOddRound = (newTournament: TournamentType, roundIndex: number) => {
        // in an odd round we have to put the loser of the winner round and pair them with
        // the winner of the loser round
        // we also have to put the winner of the winner round into the over next winner round
        if (roundIndex >= newTournament.rounds.length - 1) return

        const round = newTournament.rounds[roundIndex]

        if (!round.finishable) return

        const nextRound = newTournament.rounds[roundIndex + 1]

        let matchIndex = 0
        nextRound.loserMatches?.map((nextMatch) => {
          if (round.loserMatches !== undefined) {
            const match1 = round.winnerMatches[matchIndex]
            const match2 = round.loserMatches[matchIndex]
            const player1 = match1.playerOneRow.isWinner ? match1.playerTwoRow.player : match1.playerOneRow.player
            const player2 = match2.playerOneRow.isWinner ? match2.playerOneRow.player : match2.playerTwoRow.player
            nextMatch.playerOneRow.player = structuredClone(player1)
            nextMatch.playerTwoRow.player = structuredClone(player2)
            const isPlayerOneGetABye = nextMatch.playerOneRow.player.name === 'GET_A_BYE'
            const isPlayerTwoGetABye = nextMatch.playerTwoRow.player.name === 'GET_A_BYE'
            prepareGetAByeMatch(nextMatch, isPlayerOneGetABye, isPlayerTwoGetABye)
            matchIndex++
          }
        })

        if (roundIndex < newTournament.rounds.length - 2) {
          const nextNextRound = newTournament.rounds[roundIndex + 2]
          // The winner of the last winner round will be the first finalist
          if (round.winnerMatches.length === 1) {
            const match1 = round.winnerMatches[0]
            const player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
            nextNextRound.winnerMatches[0].playerOneRow.player = structuredClone(player1)
          } else {
            matchIndex = 0
            nextNextRound.winnerMatches.map((nextMatch) => {
              prepareNewMatch(round, matchIndex, nextMatch, true)
              matchIndex += 2
            })
          }
        }

        round.finished = true
      }

      const finishEvenRound = (newTournament: TournamentType, roundIndex: number) => {
        // in an even round we only have a loser round so in the next round we have to pair the winner of the loser
        // round with the loser of the last winner round
        const round = newTournament.rounds[roundIndex]

        if (!round.finishable) return

        const nextRound = newTournament.rounds[roundIndex + 1]
        // The winner of the last loser round will be the second finalist
        if (round.loserMatches && round.loserMatches.length === 1) {
          const match1 = round.loserMatches[0]
          const player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
          nextRound.winnerMatches[0].playerTwoRow.player = structuredClone(player1)
        } else {
          let matchIndex = 0
          nextRound.loserMatches?.map((nextMatch) => {
            if (round.loserMatches) {
              const match1 = round.loserMatches[matchIndex++]
              const match2 = round.loserMatches[matchIndex++]
              const player1 = match1.playerOneRow.isWinner ? match1.playerOneRow.player : match1.playerTwoRow.player
              const player2 = match2.playerOneRow.isWinner ? match2.playerOneRow.player : match2.playerTwoRow.player
              nextMatch.playerOneRow.player = structuredClone(player1)
              nextMatch.playerTwoRow.player = structuredClone(player2)
              const isPlayerOneGetABye = nextMatch.playerOneRow.player.name === 'GET_A_BYE'
              const isPlayerTwoGetABye = nextMatch.playerTwoRow.player.name === 'GET_A_BYE'
              prepareGetAByeMatch(nextMatch, isPlayerOneGetABye, isPlayerTwoGetABye)
            }
          })
        }

        round.finished = true
      }

      const finishLastRound = (newTournament: TournamentType) => {
        const round = newTournament.rounds[0]

        if (!round.finishable) return

        round.finished = true
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
              selectedTab: structuredClone(DEFAULT_GAME_STATE),
              gameState: structuredClone(DEFAULT_GAME_STATE),
              gameVariant: structuredClone(DEFAULT_GAME_VARIANT),
              gameMode: structuredClone(DEFAULT_GAME_MODE),
              gameOpening: structuredClone(DEFAULT_GAME_OPENING),
              gameCheckout: structuredClone(DEFAULT_GAME_CHECKOUT),
              gameLegs: structuredClone(DEFAULT_GAME_LEGS),
              gameElimination: structuredClone(DEFAULT_GAME_ELIMINATION),
              players: structuredClone(DEFAULT_PLAYERS),
              tournament: structuredClone(DEFAULT_EMPTY_TOURNAMENT),
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

          finishTournament: () => {
            set({ gameState: 'REPORT' })
            set({ selectedTab: 'REPORT' })
          },

          setLegValue: (
            roundIndex: number,
            winnerMatchIndex: number | undefined,
            loserMatchIndex: number | undefined,
            isPlayerOne: boolean,
            legIndex: number,
            remainingPoints: number,
          ) => {
            if (roundIndex < 0 || roundIndex > get().tournament.rounds.length - 1)
              throw Error(`Invalid roundIndex: ${roundIndex}`)
            const winnerMatches = get().tournament.rounds[roundIndex]?.winnerMatches
            const loserMatches = get().tournament.rounds[roundIndex]?.loserMatches
            if (winnerMatchIndex && winnerMatches) {
              if (winnerMatchIndex < 0 || winnerMatchIndex >= winnerMatches.length)
                throw Error(`Invalid winnerMatchIndex: ${winnerMatchIndex}`)
            }
            if (loserMatchIndex && loserMatches) {
              if (loserMatchIndex < 0 || loserMatchIndex >= loserMatches.length)
                throw Error(`Invalid loserMatchIndex: ${loserMatchIndex}`)
            }

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

              if (legIndex < 0 || legIndex >= row.legs.length) throw Error(`Invalid legIndex: ${legIndex}`)

              row.legs[legIndex].remainingPoints = remainingPoints

              resetErrorMessages(match)
              const { winsPlayerOne, winsPlayerTwo } = countWins(match)
              const hasWinner = checkForWinner(match, winsPlayerOne, winsPlayerTwo)
              checkForAddLeg(match, hasWinner, winsPlayerOne, winsPlayerTwo)
              checkForLastLegIsEmpty(match, hasWinner, winsPlayerOne, winsPlayerTwo)
              checkForEmptyLegs(match)
              checkForRoundIsFinishable(round)

              set({ tournament: newTournament })
            } else {
              throw Error(
                `Can't find match for winnerMatchIndex: ${winnerMatchIndex} loserMatchIndex: ${loserMatchIndex}`,
              )
            }
          },

          finishRound: (roundIndex: number) => {
            if (roundIndex < 0 || roundIndex > get().tournament.rounds.length - 1)
              throw Error(`Invalid roundIndex: ${roundIndex}`)

            const newTournament = structuredClone(get().tournament)

            if (get().gameElimination === 'KO') {
              finishKORound(newTournament, roundIndex)
            } else {
              if (roundIndex === 0) {
                finishFirstRound(newTournament)
              } else if (roundIndex === newTournament.rounds.length - 1) {
                finishLastRound(newTournament)
              } else {
                if (roundIndex % 2 === 0) {
                  finishEvenRound(newTournament, roundIndex)
                } else {
                  finishOddRound(newTournament, roundIndex)
                }
              }
            }

            set({ tournament: newTournament })
          },

          setShowConfetti: (newShowConfetti: boolean) => {
            set({ showConfetti: newShowConfetti })
          },
        },
      }
    },
  ),
)

// For convenience access to the actions
export const useAppActions = () => useAppStore((state) => state.actions)
