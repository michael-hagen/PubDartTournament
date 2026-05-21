import { Moon, Palette, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { isThemeType } from '@/globals/types'
import { useAppActions, useAppStore } from '@/store/AppStore'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'

interface ThemeSwitcherProps {
  handleClosePopup?: () => void
}

export default function ThemeSwitcher(props: ThemeSwitcherProps) {
  const { t } = useTranslation(['app'])
  const theme = useAppStore((state) => state.theme)
  const { setTheme } = useAppActions()

  const handleThemeChange = (value: string) => {
    props.handleClosePopup?.()

    if (!isThemeType(value)) return

    setTheme(value)
    localStorage.setItem('theme', value)
    document.documentElement.classList.remove('light', 'dark', 'custom')
    document.documentElement.classList.add(value)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroup variant="outline" type="single" defaultValue="" value="" onValueChange={handleThemeChange}>
          <ToggleGroupButton value={'dark'} currentValue={theme} children={<Moon />} />
          <ToggleGroupButton value={'light'} currentValue={theme} children={<Sun />} />
          <ToggleGroupButton value={'custom'} currentValue={theme} children={<Palette />} />
        </ToggleGroup>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('TIP.COLOR_THEME')}</p>
      </TooltipContent>
    </Tooltip>
  )
}
