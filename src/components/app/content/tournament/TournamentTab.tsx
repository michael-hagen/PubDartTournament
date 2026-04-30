import CollapsiblePanel from '@/components/common/CollapsiblePanel'
import { useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'
import RoundPanel from './RoundPanel'

export default function TournamentTab() {
  const { t } = useTranslation(['app'])
  const panelScale = useAppStore((state) => state.tournamentPanelScale)
  const rounds = useAppStore((state) => state.tournament.rounds)
  const roundDisabled: boolean[] = []

  rounds.map((round, roundIndex) => {
    const prevRoundFinished = roundIndex > 0 ? rounds[roundIndex - 1].finished : true
    const disabled = round.finished || !prevRoundFinished
    roundDisabled.push(disabled)
  })

  return (
    <div className="flex flex-row h-full p-4 gap-4 overflow-auto" style={{ zoom: panelScale / 100 }}>
      {rounds.map((round, roundIndex) => (
        <CollapsiblePanel
          key={round.id}
          title={t(round.name, { round: roundIndex + 1 })}
          className="shrink-0"
          titleClassName={
            roundDisabled[roundIndex] ? 'text-muted-foreground' : 'text-emerald-600 dark:text-emerald-500'
          }
        >
          <div className="flex-1 flex flex-col">
            <RoundPanel roundIndex={roundIndex} />
          </div>
        </CollapsiblePanel>
      ))}
    </div>
  )
}
