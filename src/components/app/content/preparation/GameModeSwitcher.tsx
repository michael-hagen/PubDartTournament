import { isGameModeType } from '@/globals/types'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'
import { useAppActions, useAppStore } from '@/store/AppStore'

export default function GameModeSwitcher() {
  const gameState = useAppStore((state) => state.gameState)
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT'
  const gameMode = useAppStore((state) => state.gameMode)
  const { setGameMode } = useAppActions()

  const handleModeChange = (value: string) => {
    if (!isGameModeType(value)) return
    setGameMode(value)
  }

  return (
    <ToggleGroup
      disabled={disabled}
      variant="outline"
      type="single"
      defaultValue=""
      value=""
      onValueChange={handleModeChange}
    >
      <ToggleGroupButton value={'MODE_301'} currentValue={gameMode} />
      <ToggleGroupButton value={'MODE_501'} currentValue={gameMode} />
      <ToggleGroupButton value={'MODE_701'} currentValue={gameMode} />
      <ToggleGroupButton value={'MODE_1001'} currentValue={gameMode} />
    </ToggleGroup>
  )
}
