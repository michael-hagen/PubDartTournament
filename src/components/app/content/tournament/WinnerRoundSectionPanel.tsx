import { useAppStore } from '@/store/AppStore'
import WinnerTitle from './WinnerTitle'
import MatchItem from './MatchItem'

interface WinnerRoundSectionPanelProps {
  roundIndex: number
}

export default function WinnerRoundSectionPanel({ roundIndex }: WinnerRoundSectionPanelProps) {
  const rounds = useAppStore((state) => state.tournament.rounds)
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
  const active = prevRoundFinished && !round.finished
  const final = roundIndex === rounds.length - 1

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col">
      <WinnerTitle active={active} isFinalRound={final} />
      <div className="flex-1 flex flex-col p-2 lg:p-4 gap-4 lg:gap-6 overflow-auto">
        {round.winnerMatches.map(({ id }, index) => (
          <MatchItem key={id} roundIndex={roundIndex} winnerMatchIndex={index} />
        ))}
      </div>
    </div>
  )
}
