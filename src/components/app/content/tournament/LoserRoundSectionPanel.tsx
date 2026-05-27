import { useAppActions, useAppStore } from '@/store/AppStore'
import LoserTitle from './LoserTitle'
import MatchItem from './MatchItem'
import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import { finishRound } from '@/store/RoundActions'

interface LoserRoundSectionPanelProps {
  roundIndex: number
}

export default function LoserRoundSectionPanel({ roundIndex }: LoserRoundSectionPanelProps) {
  const rounds = useAppStore((state) => state.tournament.rounds)
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'
  const { setShowConfetti } = useAppActions()
  const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
  const active = prevRoundFinished && !round.finished
  const disabled = round.finished || !prevRoundFinished || !round.finishable || isObserverMode
  const isFinalRound = roundIndex === rounds.length - 1

  const handleFinishClicked = () => {
    finishRound(roundIndex)
    if (isFinalRound) {
      setShowConfetti(true)
    }
  }

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col">
      <LoserTitle active={active} isFinalRound={isFinalRound} />
      <div className="flex-1 flex flex-col p-2 lg:p-4 overflow-auto">
        <div className="flex-1 flex flex-col gap-4 lg:gap-6">
          {round.loserMatches?.map(({ id }, index) => (
            <MatchItem key={id} roundIndex={roundIndex} loserMatchIndex={index} />
          ))}
        </div>
        <AlertDialogComponent
          buttonTitle="app:FINISH_ROUND"
          dialogTitle={isFinalRound ? 'app:FINISH_TOURNAMENT_TITLE' : 'app:FINISH_ROUND_TITLE'}
          dialogDescription={isFinalRound ? 'app:FINISH_TOURNAMENT_DESCRIPTION' : 'app:FINISH_ROUND_DESCRIPTION'}
          disabled={disabled}
          handleClick={handleFinishClicked}
        />
      </div>
    </div>
  )
}
