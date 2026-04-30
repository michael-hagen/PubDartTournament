import { useAppStore } from '@/store/AppStore'
import MatchItem from './MatchItem'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface RoundSectionPanelProps {
  roundIndex: number
}

export default function RoundSectionPanel({ roundIndex }: RoundSectionPanelProps) {
  const { t } = useTranslation(['app'])
  const rounds = useAppStore((state) => state.tournament.rounds)
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
  const disabled = round.finished || !prevRoundFinished

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col p-4 overflow-auto">
      <div className="flex-1 flex flex-col gap-6">
        {round.winnerMatches.map(({ id }, index) => (
          <MatchItem key={id} roundIndex={roundIndex} winnerMatchIndex={index} />
        ))}
      </div>
      <Button disabled={disabled} className="mt-4" variant="outline">
        {t('FINISH_ROUND')}
      </Button>
    </div>
  )
}
