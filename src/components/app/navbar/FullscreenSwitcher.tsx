import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Fullscreen, Shrink } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { Button } from '../../ui/button'

interface FullscreenSwitcherProps {
  handleClosePopup?: () => void
}

export default function FullscreenSwitcher(props: FullscreenSwitcherProps) {
  const { t } = useTranslation(['app'])
  const [fullscreenFlag, setFullscreenFlag] = useState(false)

  const toggleFullscreen = () => {
    props.handleClosePopup?.()

    if (document.fullscreenElement) {
      document.exitFullscreen()
      setFullscreenFlag(false)
    } else {
      document.documentElement.requestFullscreen()
      setFullscreenFlag(true)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="lg" onClick={toggleFullscreen}>
          {fullscreenFlag ? <Shrink /> : <Fullscreen />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{fullscreenFlag ? t('TIP.EXIT_FULLSCREEN') : t('TIP.SET_FULLSCREEN')}</p>
      </TooltipContent>
    </Tooltip>
  )
}
