import { useTranslation } from 'react-i18next'

import { File, Save, FolderOpen, Globe, Info, ChevronDown } from 'lucide-react'

import { Button } from '../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../ui/dropdown-menu'

import LanguageMenu from './LanguageMenu'
import ThemeSwitcher from './ThemeSwitcher'
import FullscreenSwitcher from './FullscreenSwitcher'
import AboutDialog from './AboutDialog'
import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import { newTournament } from '@/store/TournamentActions'
import { openTournament, saveTournament } from '@/store/PersistActions'
import { useState } from 'react'
import ErrorDialog from '@/components/common/ErrorDialog'

export default function NavbarMenu() {
  const { t } = useTranslation(['common'])
  const openFileDisabled = !('showSaveFilePicker' in window)
  const saveFileDisabled = !('showOpenFilePicker' in window)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleNewTournamentClicked = () => {
    newTournament()
  }

  const handleOpenTournamentClicked = async () => {
    setErrorMsg(await openTournament())
  }

  const handleSaveTournamentClicked = async () => {
    setErrorMsg(await saveTournament())
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
      <AlertDialogComponent
        icon={FolderOpen}
        buttonTitle="OPEN"
        dialogTitle="app:OPEN_TOURNAMENT_TITLE"
        dialogDescription="app:OPEN_TOURNAMENT_DESCRIPTION"
        handleClick={handleOpenTournamentClicked}
        size="lg"
        disabled={openFileDisabled}
      />
      <Button disabled={saveFileDisabled} variant="outline" size="lg" onClick={handleSaveTournamentClicked}>
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
      <AboutDialog>
        <Button variant="outline" size="lg">
          <Info />
          {t('ABOUT')}
        </Button>
      </AboutDialog>
      <ThemeSwitcher />
      <FullscreenSwitcher />

      <ErrorDialog errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  )
}
