import { useTranslation } from 'react-i18next'

import { Keyboard, KeyboardOff } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { Button } from '../../ui/button'
import { useAppActions, useAppStore } from '@/store/AppStore'

interface NumpadSwitcherProps {
  handleClosePopup?: () => void
}

export default function NumpadSwitcher(props: NumpadSwitcherProps) {
  const { t } = useTranslation(['app'])
  const showNumpad = useAppStore((state) => state.showNumpad)
  const { setShowNumpad } = useAppActions()

  const toggleNumpad = () => {
    props.handleClosePopup?.()
    setShowNumpad(!showNumpad)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="lg" onClick={toggleNumpad}>
          {showNumpad ? <KeyboardOff /> : <Keyboard />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{showNumpad ? t('TIP.HIDE_NUMPAD') : t('TIP.SHOW_NUMPAD')}</p>
      </TooltipContent>
    </Tooltip>
  )
}
