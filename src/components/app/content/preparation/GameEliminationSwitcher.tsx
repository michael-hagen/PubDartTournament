import { isGameEliminationType } from '@/globals/types'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'
import { useAppActions, useAppStore } from '@/store/AppStore'

export default function GameEliminationSwitcher() {
  const gameState = useAppStore((state) => state.gameState)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT' || isObserverMode
  const gameElimination = useAppStore((state) => state.gameElimination)
  const { setGameElimination } = useAppActions()

  const handleEliminationChange = (value: string) => {
    if (!isGameEliminationType(value)) return
    setGameElimination(value)
  }

  return (
    <ToggleGroup
      disabled={disabled}
      variant="outline"
      type="single"
      defaultValue=""
      value=""
      onValueChange={handleEliminationChange}
    >
      <ToggleGroupButton value={'KO'} currentValue={gameElimination} />
      <ToggleGroupButton value={'DOUBLE_KO'} currentValue={gameElimination} />
    </ToggleGroup>
  )
}
