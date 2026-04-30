import CollapsiblePanel from '@/components/common/CollapsiblePanel'
import { useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'
import RoundPanel from './RoundPanel'

export default function TournamentTab() {
  const { t } = useTranslation(['app'])
  // const gameElimination = useAppStore((state) => state.gameElimination)
  const tournamentPanelScale = useAppStore((state) => state.tournamentPanelScale)
  const tournamentRounds = useAppStore((state) => state.tournament.rounds)

  return (
    <div className="flex flex-row h-full p-4 gap-4 overflow-auto" style={{ zoom: tournamentPanelScale / 100 }}>
      {tournamentRounds.map((round, roundIndex) => (
        <CollapsiblePanel key={round.id} title={t(round.name, { round: roundIndex + 1 })} className="shrink-0">
          <div className="flex-1 flex flex-col">
            <RoundPanel roundIndex={roundIndex} />
          </div>
        </CollapsiblePanel>
      ))}
    </div>
  )
}
