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
import { useEffect, useState } from 'react'
import { setConnectionString } from '@/store/PeerServiceActions'
import { toast } from 'sonner'

export default function ConnectControl() {
  const { t } = useTranslation(['app'])
  const connectionString = useAppStore((state) => state.connectionString)
  const isConnectionPending = useAppStore((state) => state.isConnectionPending)
  const connectionMode = useAppStore((state) => state.connectionMode)
  const action: ConnectionActionType =
    connectionMode === 'SERVER' || connectionMode === 'CLIENT' ? 'DISCONNECT' : 'SHARE'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Establishing a connection is async. It starts with setting pending to true
  // and finished setting pending to false. So if it's no longer pending and there 
  // are error messages we have to show it somehow
  useEffect(() => {
    if (isConnectionPending || !PeerService.getInstance().hasErrors()) return
    let errMsg = ''
    PeerService.getInstance()
      .getErrorMessages()
      .forEach((message) => (errMsg += message + '\n'))
    toast(t('app:ERROR_MESSAGE.CONNECTION_ERROR_TITLE'), {
      closeButton: true,
      duration: 8000,
      description: <span className="whitespace-pre-line">{errMsg}</span>,
    })
  }, [isConnectionPending, t])

  const handleActionClicked = (currentAction: ConnectionActionType) => {
    switch (currentAction) {
      case 'SHARE':
        PeerService.getInstance().share()
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
              <DropdownMenuItem className="p-2" onClick={() => handleActionClicked('SHARE')}>
                <Share2 />
                <span>{t('SHARE_MENU_ITEM')}</span>
              </DropdownMenuItem>
              <ConnectDialog handleConnect={handleConnect}>
                <DropdownMenuItem className="p-2" onSelect={(e) => e.preventDefault()}>
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
