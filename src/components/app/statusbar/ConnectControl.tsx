import AlertDialogComponent from '@/components/common/AlertDialogComponent'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ConnectionActionType } from '@/globals/types'
import PeerService from '@/peer/PeerService'
import { useAppStore } from '@/store/AppStore'
import { ChevronDown, GlobeOff, Loader2, Radio, Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConnectDialog } from './ConnectDialog'
import { useState } from 'react'
import { setConnectionString } from '@/store/PeerServiceActions'

export default function ConnectControl() {
  const { t } = useTranslation(['app'])
  const connectionString = useAppStore((state) => state.connectionString)
  const isConnectionPending = useAppStore((state) => state.isConnectionPending)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const action: ConnectionActionType =
    connectionMode === 'SERVER' || connectionMode === 'CLIENT' ? 'DISCONNECT' : 'SHARE'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleActionClicked = (currentAction: ConnectionActionType) => {
    switch (currentAction) {
      case 'SHARE':
        PeerService.getInstance().share()
        break
      case 'CONNECT':
        PeerService.getInstance().connect()
        break
      case 'DISCONNECT':
        PeerService.getInstance().disconnect()
        break
    }
  }

  const handleConnect = (value: string) => {
    setConnectionString(value)
    setIsMenuOpen(false)
    PeerService.getInstance().connect()
  }

  return (
    <div className="inline-flex gap-4">
      {connectionMode === 'SERVER' && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex gap-2 mt-1 whitespace-nowrap text-muted-foreground">
              <div>{t('app:CONNECTION_STRING')}</div>
              <div className="text-foreground">{connectionString}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>{t('app:TIP.CONNECTION_STRING')}</TooltipContent>
        </Tooltip>
      )}
      {action === 'DISCONNECT' && (
        <AlertDialogComponent
          dialogTitle="app:DISCONNECT_TITLE"
          dialogDescription="app:DISCONNECT_DESCRIPTION"
          size="lg"
          handleClick={() => handleActionClicked(action)}
        >
          <Button disabled={isConnectionPending} variant="outline">
            {isConnectionPending ? (
              <Loader2 className="text-primary animate-spin" />
            ) : (
              <GlobeOff className="text-primary" />
            )}
            <span>{t('app:DISCONNECT')}</span>
          </Button>
        </AlertDialogComponent>
      )}
      {action !== 'DISCONNECT' && (
        <div className="inline-flex items-center -space-x-px">
          <Button
            disabled={isConnectionPending}
            variant="outline"
            className="rounded-r-none"
            onClick={() => handleActionClicked(action)}
          >
            {isConnectionPending ? (
              <Loader2 className="text-primary animate-spin" />
            ) : action === 'SHARE' ? (
              <Share2 className="text-primary" />
            ) : (
              <Radio className="text-primary" />
            )}
            {t(action)}
          </Button>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button disabled={isConnectionPending} variant="outline" className="rounded-l-none">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem onClick={() => handleActionClicked('SHARE')}>
                <Share2 />
                <span>{t('SHARE_MENU_ITEM')}</span>
              </DropdownMenuItem>
              <ConnectDialog handleConnect={handleConnect}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Radio />
                  <span>{t('CONNECT_MENU_ITEM')}</span>
                </DropdownMenuItem>
              </ConnectDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
