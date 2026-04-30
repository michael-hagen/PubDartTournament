import { isGameOpeningType } from '@/globals/types'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'
import { useAppActions, useAppStore } from '@/store/AppStore'

export default function GameOpeningSwitcher() {
  const gameState = useAppStore((state) => state.gameState)
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT'
  const gameOpening = useAppStore((state) => state.gameOpening)
  const { setGameOpening } = useAppActions()

  const handleOpeningChange = (value: string) => {
    if (!isGameOpeningType(value)) return
    setGameOpening(value)
  }

  return (
    <ToggleGroup
      disabled={disabled}
      variant="outline"
      type="single"
      defaultValue=""
      value=""
      onValueChange={handleOpeningChange}
    >
      <ToggleGroupButton value={'SINGLE_IN'} currentValue={gameOpening} />
      <ToggleGroupButton value={'DOUBLE_IN'} currentValue={gameOpening} />
      <ToggleGroupButton value={'MASTER_IN'} currentValue={gameOpening} />
    </ToggleGroup>
  )
}
