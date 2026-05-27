import { useTranslation } from 'react-i18next'

import { PreparationCard } from './PreparationCard'
import GameVariantSwitcher from './GameVariantSwitcher'
import GameModeSwitcher from './GameModeSwitcher'
import GameOpeningSwitcher from './GameOpeningSwitcher'
import GameCheckoutSwitcher from './GameCheckoutSwitcher'
import GameLegsSwitcher from './GameLegsSwitcher'
import GameEliminationSwitcher from './GameEliminationSwitcher'
import PlayersList from './PlayersList'
import { useAppStore } from '@/store/AppStore'
import { Goal } from 'lucide-react'
import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import { startTournament } from '@/store/TournamentActions'
import GameOptionsPanel from './GameOptionsPanel'
import DonationPanel from './DonationPanel'

export default function PreparationTab() {
  const { t } = useTranslation(['app'])
  const gameState = useAppStore((state) => state.gameState)
  const preparationErrorMessages = useAppStore((state) => state.preparationErrorMessages)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'
  const startDisabled =
    (preparationErrorMessages && preparationErrorMessages.length > 0) ||
    gameState === 'TOURNAMENT' ||
    gameState === 'REPORT' ||
    isObserverMode

  const handleStartClicked = () => {
    startTournament()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row w-full p-2 md:p-4 gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <PreparationCard title={t('VARIANT')} className="flex-1 min-w-70">
              <GameVariantSwitcher />
            </PreparationCard>
            <PreparationCard title={t('GAME_MODE')} className="flex-1 min-w-70">
              <GameModeSwitcher />
            </PreparationCard>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <PreparationCard title={t('OPENING')} className="flex-1 min-w-70">
              <GameOpeningSwitcher />
            </PreparationCard>
            <PreparationCard title={t('CHECKOUT')} className="flex-1 min-w-70">
              <GameCheckoutSwitcher />
            </PreparationCard>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <PreparationCard title={t('LEGS')} className="flex-1 min-w-70">
              <GameLegsSwitcher />
            </PreparationCard>
            <PreparationCard title={t('TOURNAMENT_MODE')} className="flex-1 min-w-70">
              <GameEliminationSwitcher />
            </PreparationCard>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <PreparationCard title={t('OPTIONS')} className="flex-1 min-w-70">
              <GameOptionsPanel />
            </PreparationCard>
            <PreparationCard title={t('DONATION')} className="flex-1 min-w-70">
              <DonationPanel />
            </PreparationCard>
          </div>
        </div>

        <PreparationCard title={t('PLAYERS')} className="flex-1 w-full">
          <PlayersList />
        </PreparationCard>
      </div>

      <div className="flex justify-center p-2">
        <AlertDialogComponent
          icon={Goal}
          buttonTitle="app:START_TOURNAMENT"
          dialogTitle="app:START_TOURNAMENT_TITLE"
          dialogDescription="app:START_TOURNAMENT_DESCRIPTION"
          disabled={startDisabled}
          handleClick={handleStartClicked}
          size="lg"
          className="min-w-60 md:min-h-12 lg:min-h-14"
        />
      </div>
    </div>
  )
}
