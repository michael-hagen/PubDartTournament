import { isGameCheckoutType } from '@/globals/types'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'
import { useAppActions, useAppStore } from '@/store/AppStore'

export default function GameCheckoutSwitcher() {
  const gameState = useAppStore((state) => state.gameState)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT' || isObserverMode
  const gameCheckout = useAppStore((state) => state.gameCheckout)
  const { setGameCheckout } = useAppActions()

  const handleCheckoutChange = (value: string) => {
    if (!isGameCheckoutType(value)) return
    setGameCheckout(value)
  }

  return (
    <ToggleGroup
      disabled={disabled}
      variant="outline"
      type="single"
      defaultValue=""
      value=""
      onValueChange={handleCheckoutChange}
    >
      <ToggleGroupButton value={'SINGLE_OUT'} currentValue={gameCheckout} />
      <ToggleGroupButton value={'DOUBLE_OUT'} currentValue={gameCheckout} />
      <ToggleGroupButton value={'MASTER_OUT'} currentValue={gameCheckout} />
    </ToggleGroup>
  )
}
