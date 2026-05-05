import { useTranslation } from 'react-i18next'

import { File, Save, FolderOpen, Globe, Info, ChevronDown } from 'lucide-react'

import { Button } from '../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../ui/dropdown-menu'

import LanguageMenu from './LanguageMenu'
import ThemeSwitcher from './ThemeSwitcher'
import FullscreenSwitcher from './FullscreenSwitcher'
import { useAppActions } from '@/store/AppStore'
import AboutDialog from './AboutDialog'
import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import NotImplementedDialog from '@/components/common/NotImplementedDialog'

export default function NavbarMenu() {
  const { t } = useTranslation(['common'])
  const { newGame } = useAppActions()

  const handleNewTournamentClicked = () => {
    newGame()
  }

  return (
    <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
      <AlertDialogComponent
        icon={File}
        buttonTitle="NEW"
        dialogTitle="app:NEW_TOURNAMENT_TITLE"
        dialogDescription="app:NEW_TOURNAMENT_DESCRIPTION"
        handleClick={handleNewTournamentClicked}
        size="lg"
      />
      <NotImplementedDialog>
        <Button variant="outline" size="lg">
          <FolderOpen />
          {t('OPEN')}
        </Button>
      </NotImplementedDialog>
      <NotImplementedDialog>
        <Button variant="outline" size="lg">
          <Save />
          {t('SAVE')}
        </Button>
      </NotImplementedDialog>
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
      <AboutDialog>
        <Button variant="outline" size="lg">
          <Info />
          {t('ABOUT')}
        </Button>
      </AboutDialog>
      <ThemeSwitcher />
      <FullscreenSwitcher />
    </div>
  )
}
