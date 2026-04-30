import { isGameSetsType } from '@/globals/types'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'
import { useAppActions, useAppStore } from '@/store/AppStore'

export default function GameSetsSwitcher() {
  const gameState = useAppStore((state) => state.gameState)
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT'
  const gameSets = useAppStore((state) => state.gameSets)
  const { setGameSets } = useAppActions()

  const handleSetsChange = (value: string) => {
    if (!isGameSetsType(value)) return
    setGameSets(value)
  }

  return (
    <ToggleGroup
      disabled={disabled}
      variant="outline"
      type="single"
      defaultValue=""
      value=""
      onValueChange={handleSetsChange}
    >
      <ToggleGroupButton value={'SETS_2'} currentValue={gameSets} />
      <ToggleGroupButton value={'SETS_3'} currentValue={gameSets} />
      <ToggleGroupButton value={'SETS_4'} currentValue={gameSets} />
      <ToggleGroupButton value={'SETS_5'} currentValue={gameSets} />
    </ToggleGroup>
  )
}
