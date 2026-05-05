import { useAppActions, useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'
import LegInput from './LegInput'
import type { ChangeEvent } from 'react'

interface MatchRowItemProps {
  roundIndex: number
  winnerMatchIndex?: number
  loserMatchIndex?: number
  isPlayerOne: boolean
}

export default function MatchRowItem({
  roundIndex,
  winnerMatchIndex,
  loserMatchIndex,
  isPlayerOne,
}: MatchRowItemProps) {
  const { t } = useTranslation(['app'])
  const rounds = useAppStore((state) => state.tournament.rounds)
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const { setLegValue } = useAppActions()
  const winnerMatch = winnerMatchIndex != undefined ? round.winnerMatches[winnerMatchIndex] : null
  const loserMatch = loserMatchIndex != undefined && round.loserMatches ? round.loserMatches[loserMatchIndex] : null
  const match = winnerMatch ? winnerMatch : loserMatch

  if (!match) return

  const playerOneName = match.playerOneRow.player.name
  const playerTwoName = match.playerTwoRow.player.name
  const isWinner = isPlayerOne ? match.playerOneRow.isWinner : match.playerTwoRow.isWinner
  let playerName = isPlayerOne ? playerOneName : playerTwoName
  const isGetABye = playerName === 'GET_A_BYE'
  if (isGetABye) {
    playerName = t(playerName)
  }
  const legs = isPlayerOne ? match.playerOneRow.legs : match.playerTwoRow.legs
  const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
  const disabled =
    round.finished || !prevRoundFinished || playerOneName === 'GET_A_BYE' || playerTwoName === 'GET_A_BYE'

  const handleOnChange = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>, legIndex: number) => {
    const value = parseInt(event.target.value);
    const remainingPoints = isNaN(value) ? 0 : value 
    setLegValue(roundIndex, winnerMatchIndex, loserMatchIndex, isPlayerOne, legIndex, remainingPoints)
  }

  return (
    <div className="flex-1 flex flex-row gap-2">
      <div
        className={`flex flex-row items-center w-40 min-h-8 border ps-2 ${isGetABye ? 'text-muted-foreground' : ''}`}
      >
        {isWinner === undefined ? '' : isWinner ? '✨ ' : '👎 '}
        {playerName}
      </div>
      {legs.map((leg, index) => (
        <LegInput
          key={index}
          value={leg.remainingPoints.toString()}
          errorMessage={leg.errorMessage}
          legIndex={index}
          disabled={disabled}
          handleOnChange={handleOnChange}
        />
      ))}
    </div>
  )
}
