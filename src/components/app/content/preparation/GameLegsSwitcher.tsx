import { isGameLegsType } from '@/globals/types'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'
import { useAppActions, useAppStore } from '@/store/AppStore'

export default function GameLegsSwitcher() {
  const gameState = useAppStore((state) => state.gameState)
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT'
  const gameLegs = useAppStore((state) => state.gameLegs)
  const { setGameLegs } = useAppActions()

  const handleLegsChange = (value: string) => {
    if (!isGameLegsType(value)) return
    setGameLegs(value)
  }

  return (
    <ToggleGroup
      disabled={disabled}
      variant="outline"
      type="single"
      defaultValue=""
      value=""
      onValueChange={handleLegsChange}
    >
      <ToggleGroupButton value={'2'} currentValue={gameLegs} />
      <ToggleGroupButton value={'3'} currentValue={gameLegs} />
      <ToggleGroupButton value={'4'} currentValue={gameLegs} />
      <ToggleGroupButton value={'5'} currentValue={gameLegs} />
    </ToggleGroup>
  )
}
