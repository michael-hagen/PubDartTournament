import { File, Save, FolderOpen, Globe, Info, Menu } from 'lucide-react'
import { Button } from '../../ui/button'
import { useTranslation } from 'react-i18next'
import { useAppActions } from '@/store/AppStore'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import LanguageMenu from './LanguageMenu'
import ThemeSwitcher from './ThemeSwitcher'
import FullscreenSwitcher from './FullscreenSwitcher'

export default function Navbar() {
  const { t } = useTranslation(['common'])
  const { newGame } = useAppActions()

  return (
    <div className="flex lg:hidden gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-max lg:hidden">
          <DropdownMenuItem className="h-10" onClick={newGame}>
            <File />
            {t('NEW')}
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10">
            <FolderOpen />
            {t('OPEN')}
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10">
            <Save />
            {t('SAVE')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="h-10">
              <Globe />
              {t('LANGUAGE')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <LanguageMenu />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="h-10">
            <Info />
            {t('ABOUT')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="flex flex-row p-2 space-x-2">
            <ThemeSwitcher />
            <FullscreenSwitcher />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
