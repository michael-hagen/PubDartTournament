import { Button } from '@/components/ui/button'
import MatchRowItem from './MatchRowItem'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/AppStore'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface MatchItemProps {
  roundIndex: number
  winnerMatchIndex?: number
  loserMatchIndex?: number
}

export default function MatchItem({ roundIndex, winnerMatchIndex, loserMatchIndex }: MatchItemProps) {
  const { t } = useTranslation(['common', 'app'])
  const round = useAppStore((state) => state.tournament.rounds[roundIndex])
  const winnerMatch = winnerMatchIndex != undefined ? round.winnerMatches[winnerMatchIndex] : null
  const loserMatch = loserMatchIndex != undefined && round.loserMatches ? round.loserMatches[loserMatchIndex] : null
  const match = winnerMatch ? winnerMatch : loserMatch

  if (!match) return

  const hasErrors = match.fieldErrorMessages.length > 0 || match.matchErrorMessages.length > 0

  return (
    <div className="flex flex-row gap-2">
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
      {hasErrors && (
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="outline" className="h-full w-15">
              {t('HELP')}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="flex w-90 flex-col gap-2">
            <div className="text-lg">{t('MATCH_INPUT_ERRORS', { ns: 'app' })}</div>
            {match.fieldErrorMessages.map((errorMessage, index) => (
              <div key={index} className="text-muted-foreground">
                {t(errorMessage, { ns: 'app' })}
              </div>
            ))}
            {match.matchErrorMessages.map((errorMessage, index) => (
              <div key={index} className="text-muted-foreground">
                {t(errorMessage, { ns: 'app' })}
              </div>
            ))}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  )
}
