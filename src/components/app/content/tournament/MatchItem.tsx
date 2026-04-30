import MatchRowItem from './MatchRowItem'

interface MatchItemProps {
  roundIndex: number
  winnerMatchIndex?: number
  loserMatchIndex?: number
}

export default function MatchItem({ roundIndex, winnerMatchIndex, loserMatchIndex }: MatchItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <MatchRowItem
        roundIndex={roundIndex}
        winnerMatchIndex={winnerMatchIndex}
        loserMatchIndex={loserMatchIndex}
        isPlayerOne={true}
      />
      <MatchRowItem
        roundIndex={roundIndex}
        winnerMatchIndex={winnerMatchIndex}
        loserMatchIndex={loserMatchIndex}
        isPlayerOne={false}
      />
    </div>
  )
}
