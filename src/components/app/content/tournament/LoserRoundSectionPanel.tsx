import { useAppStore } from '@/store/AppStore'
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
  const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
  const disabled = round.finished || !prevRoundFinished || !round.finishable

  const handleFinishClicked = () => {
    finishRound(roundIndex)
  }

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col">
      <LoserTitle disabled={disabled} />
      <div className="flex-1 flex flex-col p-2 lg:p-4 overflow-auto">
        <div className="flex-1 flex flex-col gap-4 lg:gap-6">
          {round.loserMatches?.map(({ id }, index) => (
            <MatchItem key={id} roundIndex={roundIndex} loserMatchIndex={index} />
          ))}
        </div>
        <AlertDialogComponent
          buttonTitle="app:FINISH_ROUND"
          dialogTitle="app:FINISH_ROUND_TITLE"
          dialogDescription="app:FINISH_ROUND_DESCRIPTION"
          disabled={disabled}
          handleClick={handleFinishClicked}
        />
      </div>
    </div>
  )
}
