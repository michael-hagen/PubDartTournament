import { File, Save, FolderOpen, Globe, Info, Menu } from 'lucide-react'
import { Button } from '../../ui/button'
import { useTranslation } from 'react-i18next'

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
import AboutDialog from './AboutDialog'
import NotImplementedDialog from '@/components/common/NotImplementedDialog'
import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import { newTournament } from '@/store/TournamentActions'

export default function Navbar() {
  const { t } = useTranslation(['common'])

  const handleNewTournamentClicked = () => {
    newTournament()
  }

  return (
    <div className="flex lg:hidden gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-max lg:hidden">
          <AlertDialogComponent
            dialogTitle="app:NEW_TOURNAMENT_TITLE"
            dialogDescription="app:NEW_TOURNAMENT_DESCRIPTION"
            handleClick={handleNewTournamentClicked}
          >
            <DropdownMenuItem className="h-10" onSelect={(e) => e.preventDefault()}>
              <File />
              {t('NEW')}
            </DropdownMenuItem>
          </AlertDialogComponent>
          <NotImplementedDialog>
            <DropdownMenuItem className="h-10" onSelect={(e) => e.preventDefault()}>
              <FolderOpen />
              {t('OPEN')}
            </DropdownMenuItem>
          </NotImplementedDialog>
          <NotImplementedDialog>
            <DropdownMenuItem className="h-10" onSelect={(e) => e.preventDefault()}>
              <Save />
              {t('SAVE')}
            </DropdownMenuItem>
          </NotImplementedDialog>
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
          <AboutDialog>
            <DropdownMenuItem className="h-10" onSelect={(e) => e.preventDefault()}>
              <Info />
              {t('ABOUT')}
            </DropdownMenuItem>
          </AboutDialog>
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
