import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { File, Save, FolderOpen, Globe, Info, Menu } from 'lucide-react'
import { Button } from '../../ui/button'

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
import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import ErrorDialog from '@/components/common/ErrorDialog'
import { newTournament } from '@/store/TournamentActions'
import { openTournament, saveTournament } from '@/store/PersistActions'
import { useAppStore } from '@/store/AppStore'

export default function HamburgerMenu() {
  const { t } = useTranslation(['common'])
  const [menuOpen, setMenuOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const isObserverMode = connectionMode === 'CLIENT'

  const handleNewTournamentClicked = () => {
    setMenuOpen(false)
    newTournament()
  }

  const handleOpenTournamentClicked = async () => {
    setMenuOpen(false)
    setErrorMsg(await openTournament())
  }

  const handleSaveTournamentClicked = async () => {
    setMenuOpen(false)
    setErrorMsg(await saveTournament())
  }

  const handleAboutOpenChange = (open: boolean) => {
    if (!open) {
      setMenuOpen(false)
    }
  }

  const handleClosePopup = () => {
    setMenuOpen(false)
  }

  return (
    <div className="flex lg:hidden gap-1">
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
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
            <DropdownMenuItem disabled={isObserverMode} className="h-10" onSelect={(e) => e.preventDefault()}>
              <File />
              {t('NEW')}
            </DropdownMenuItem>
          </AlertDialogComponent>

          <AlertDialogComponent
            dialogTitle="app:OPEN_TOURNAMENT_TITLE"
            dialogDescription="app:OPEN_TOURNAMENT_DESCRIPTION"
            handleClick={handleOpenTournamentClicked}
          >
            <DropdownMenuItem disabled={isObserverMode} className="h-10" onSelect={(e) => e.preventDefault()}>
              <FolderOpen />
              {t('OPEN')}
            </DropdownMenuItem>
          </AlertDialogComponent>

          <DropdownMenuItem
            disabled={isObserverMode}
            className="h-10"
            onSelect={(e) => e.preventDefault()}
            onClick={handleSaveTournamentClicked}
          >
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
          <AboutDialog handleAboutOpenChange={handleAboutOpenChange}>
            <DropdownMenuItem className="h-10" onSelect={(e) => e.preventDefault()}>
              <Info />
              {t('ABOUT')}
            </DropdownMenuItem>
          </AboutDialog>
          <DropdownMenuSeparator />
          <div className="flex flex-row p-2 space-x-2">
            <ThemeSwitcher handleClosePopup={handleClosePopup} />
            {/* <NumpadSwitcher handleClosePopup={handleClosePopup} /> */}
            <FullscreenSwitcher handleClosePopup={handleClosePopup} />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ErrorDialog errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  )
}
