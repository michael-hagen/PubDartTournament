import { isGameVariantType } from '@/globals/types'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'
import { useAppActions, useAppStore } from '@/store/AppStore'

export default function GameVariantSwitcher() {
  const gameState = useAppStore((state) => state.gameState)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'
  // TODO: Remove "|| true" when game variant selection is implemented
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT' || isObserverMode || true
  const gameVariant = useAppStore((state) => state.gameVariant)
  const { setGameVariant } = useAppActions()

  const handleVariantChange = (value: string) => {
    if (!isGameVariantType(value)) return
    setGameVariant(value)
  }

  return (
    <ToggleGroup
      disabled={disabled}
      variant="outline"
      type="single"
      defaultValue=""
      value=""
      onValueChange={handleVariantChange}
    >
      <ToggleGroupButton value={'ELECTRONIC_DART'} currentValue={gameVariant} />
      <ToggleGroupButton value={'STEEL_DART'} currentValue={gameVariant} />
    </ToggleGroup>
  )
}
