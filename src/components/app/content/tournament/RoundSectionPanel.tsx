import { useAppStore } from '@/store/AppStore'
import MatchItem from './MatchItem'
import FinishButton from './FinishButton'

interface RoundSectionPanelProps {
  roundIndex: number
}

export default function RoundSectionPanel({ roundIndex }: RoundSectionPanelProps) {
  const rounds = useAppStore((state) => state.tournament.rounds)
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
  const disabled = round.finished || !prevRoundFinished

  const handleFinishClicked = () => {
    console.log('--> Finish clicked')
  }

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col p-4 overflow-auto">
      <div className="flex-1 flex flex-col gap-6">
        {round.winnerMatches.map(({ id }, index) => (
          <MatchItem key={id} roundIndex={roundIndex} winnerMatchIndex={index} />
        ))}
      </div>
      <FinishButton disabled={disabled} handleClick={handleFinishClicked} />
    </div>
  )
}
