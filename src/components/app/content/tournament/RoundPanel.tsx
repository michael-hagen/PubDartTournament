import { useAppStore } from '@/store/AppStore'
import WinnerRoundSectionPanel from './WinnerRoundSectionPanel'
import RoundSectionPanel from './RoundSectionPanel'
import LoserRoundSectionPanel from './LoserRoundSectionPanel'

interface RoundPanelProps {
  roundIndex: number
}

export default function RoundPanel({ roundIndex }: RoundPanelProps) {
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const hasLoser = round.loserMatches ? round.loserMatches.length > 0 : false
  return (
    <div className="flex-1 flex flex-col h-full">
      {hasLoser ? (
        <div className="flex-1 flex flex-col h-full">
          <WinnerRoundSectionPanel roundIndex={roundIndex} />
          <LoserRoundSectionPanel roundIndex={roundIndex} />
        </div>
      ) : (
        <RoundSectionPanel roundIndex={roundIndex} />
      )}
    </div>
  )
}
