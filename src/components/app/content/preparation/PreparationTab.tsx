import { useTranslation } from 'react-i18next'

import { PreparationCard } from './PreparationCard'
import GameVariantSwitcher from './GameVariantSwitcher'
import GameModeSwitcher from './GameModeSwitcher'
import GameOpeningSwitcher from './GameOpeningSwitcher'
import GameCheckoutSwitcher from './GameCheckoutSwitcher'
import GameSetsSwitcher from './GameSetsSwitcher'
import GameEliminationSwitcher from './GameEliminationSwitcher'
import PlayersList from './PlayersList'
import { useAppActions, useAppStore } from '@/store/AppStore'
import StartButton from './StartButton'

export default function PreparationTab() {
  const { t } = useTranslation(['app'])
  const gameState = useAppStore((state) => state.gameState)
  const startDisabled = gameState === 'TOURNAMENT' || gameState === 'REPORT'
  const { startTournament } = useAppActions()

  const handleStartClicked = () => {
    startTournament()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row w-full p-4 gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex flex-row space-x-6">
            <PreparationCard title={t('VARIANT')} className="flex-1 min-w-70">
              <GameVariantSwitcher />
            </PreparationCard>
            <PreparationCard title={t('GAME_MODE')} className="flex-1 min-w-70">
              <GameModeSwitcher />
            </PreparationCard>
          </div>

          <div className="flex flex-row space-x-6">
            <PreparationCard title={t('OPENING')} className="flex-1 min-w-70">
              <GameOpeningSwitcher />
            </PreparationCard>
            <PreparationCard title={t('CHECKOUT')} className="flex-1 min-w-70">
              <GameCheckoutSwitcher />
            </PreparationCard>
          </div>

          <div className="flex flex-row space-x-6">
            <PreparationCard title={t('SETS')} className="flex-1 min-w-70">
              <GameSetsSwitcher />
            </PreparationCard>
            <PreparationCard title={t('TOURNAMENT_MODE')} className="flex-1 min-w-70">
              <GameEliminationSwitcher />
            </PreparationCard>
          </div>
        </div>

        <PreparationCard title={t('PLAYERS')} className="flex-1 w-full">
          <PlayersList />
        </PreparationCard>
      </div>
      <div className="flex justify-center p-8">
        <StartButton disabled={startDisabled} handleClick={handleStartClicked} />
      </div>
    </div>
  )
}
