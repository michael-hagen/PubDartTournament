import { useTranslation } from 'react-i18next'

import { File, Save, FolderOpen, Globe, Info, ChevronDown } from 'lucide-react'

import { Button } from '../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../ui/dropdown-menu'

import LanguageMenu from './LanguageMenu'
import ThemeSwitcher from './ThemeSwitcher'
import FullscreenSwitcher from './FullscreenSwitcher'
import { useAppActions } from '@/store/AppStore'

export default function NavbarMenu() {
  const { t } = useTranslation(['common'])
  const { newGame } = useAppActions()

  return (
    <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
      <Button variant="outline" size="lg" onClick={newGame}>
        <File />
        {t('NEW')}
      </Button>
      <Button variant="outline" size="lg">
        <FolderOpen />
        {t('OPEN')}
      </Button>
      <Button variant="outline" size="lg">
        <Save />
        {t('SAVE')}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg">
            <Globe />
            {t('LANGUAGE')}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <LanguageMenu />
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="lg">
        <Info />
        {t('ABOUT')}
      </Button>
      <ThemeSwitcher />
      <FullscreenSwitcher />
    </div>
  )
}
