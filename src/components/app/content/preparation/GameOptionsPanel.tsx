import { Field, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { useAppActions, useAppStore } from '@/store/AppStore'
import { useTranslation } from 'react-i18next'

export default function GameOptionsPanel() {
  const { t } = useTranslation(['app'])
  const gameState = useAppStore((state) => state.gameState)
  const disabled = gameState === 'TOURNAMENT' || gameState === 'REPORT'
  const gameMatchForThirdPlace = useAppStore((state) => state.gameMatchForThirdPlace)
  const { setGameMatchForThirdPlace } = useAppActions()

  const handleGameMatchForThirdPlaceChanged = (checked: boolean) => {
    setGameMatchForThirdPlace(checked)
  }

  return (
    <Field orientation="horizontal" data-disabled={disabled} className="w-fit cursor-default!">
      <Switch
        id="game-match-for-third-place"
        disabled={disabled}
        checked={gameMatchForThirdPlace}
        onCheckedChange={handleGameMatchForThirdPlaceChanged}
        className="disabled:cursor-default!"
      />
      <FieldLabel htmlFor="game-match-for-third-place" className="cursor-default!">
        {t('MATCH_FOR_THIRD_PLACE')}
      </FieldLabel>
    </Field>

    // <div className="flex items-center space-x-2">
    //   <Switch id="game-match-for-third-place" disabled={disabled} value={gameMatchForThirdPlace}/>
    //   <Label htmlFor="game-match-for-third-place">{t('MATCH_FOR_THIRD_PLACE')}</Label>
    // </div>
  )
}
