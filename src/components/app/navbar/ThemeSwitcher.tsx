import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { isThemeType } from '@/globals/types'
import { useAppActions, useAppStore } from '@/store/AppStore'

import { ToggleGroup } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ToggleGroupButton } from '@/components/common/ToggleGroupButton'

export default function ThemeSwitcher() {
  const { t } = useTranslation(['app'])
  const theme = useAppStore((state) => state.theme)
  const { setTheme } = useAppActions()

  const handleThemeChange = (value: string) => {
    if (!isThemeType(value)) return
    setTheme(value)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroup variant="outline" type="single" defaultValue="" value="" onValueChange={handleThemeChange}>
          <ToggleGroupButton value={'dark'} currentValue={theme} children={<Moon />} />
          <ToggleGroupButton value={'light'} currentValue={theme} children={<Sun />} />
        </ToggleGroup>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('TIP.COLOR_THEME')}</p>
      </TooltipContent>
    </Tooltip>
  )
}
