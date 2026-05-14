import { useAppActions, useAppStore } from '@/store/AppStore'
import MatchItem from './MatchItem'
import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import { finishRound } from '@/store/RoundActions'

interface RoundSectionPanelProps {
  roundIndex: number
}

export default function RoundSectionPanel({ roundIndex }: RoundSectionPanelProps) {
  const rounds = useAppStore((state) => state.tournament.rounds)
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const { setShowConfetti } = useAppActions()
  const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
  const disabled = round.finished || !prevRoundFinished || !round.finishable
  const isFinalRound = roundIndex === rounds.length - 1

  const handleFinishClicked = () => {
    finishRound(roundIndex)
    if (isFinalRound) {
      setShowConfetti(true)
    }
  }

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col p-2 lg:p-4 overflow-auto">
      <div className="flex-1 flex flex-col gap-4 lg:gap-6">
        {round.winnerMatches.map(({ id }, index) => (
          <MatchItem key={id} roundIndex={roundIndex} winnerMatchIndex={index} />
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
  )
}
